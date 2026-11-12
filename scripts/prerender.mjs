// Prerender: genera HTML real por ruta (SEO, sin JS, rastreadores) desde el build SSR.
// Uso: se ejecuta tras `vite build` y `vite build --ssr` (ver "build" en package.json).
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const dist = path.resolve('dist');
const ssr = path.resolve('dist-ssr/entry-server.js');
const { render, routes, routeMeta, site } = await import(pathToFileURL(ssr).href);
let template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');

// CSS crítico en línea: el primer pintado no espera a otra petición (rutas de fuente absolutas, seguras).
template = template.replace(/<link rel="stylesheet"[^>]*href="(\/assets\/[^"]+\.css)"[^>]*>/, (_, href) => {
  const css = fs.readFileSync(path.join(dist, href), 'utf8');
  return `<style>${css}</style>`;
});

// Precarga de la fuente principal (subset latin): el loader espera a document.fonts.ready.
const latin = fs.readdirSync(path.join(dist, 'assets')).find((f) => /^archivo-latin-wdth-normal.*\.woff2$/.test(f));
const preload = latin ? `<link rel="preload" as="font" type="font/woff2" crossorigin href="/assets/${latin}" />` : '';

const esc =(s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

function page(url) {
  const m = routeMeta(url);
  let html = template.replace('<!--app-html-->', render(url));
  html = html
    .replace(/<title>.*?<\/title>/, `<title>${esc(m.title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*/, `$1${esc(m.description)}`)
    .replace(/(<meta property="og:title" content=")[^"]*/, `$1${esc(m.title)}`)
    .replace(/(<meta property="og:description" content=")[^"]*/, `$1${esc(m.description)}`)
    .replace(/(<link rel="canonical" href=")[^"]*/, `$1${site.url}${url}`)
    .replace(/(<meta property="og:url" content=")[^"]*/, `$1${site.url}${url}`)
    .replace(/(<meta name="twitter:title" content=")[^"]*/, `$1${esc(m.title)}`)
    .replace(/(<meta name="twitter:description" content=")[^"]*/, `$1${esc(m.description)}`);
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.name,
    jobTitle: site.role,
    url: site.url,
    email: `mailto:${site.email}`,
  };
  return html.replace('</head>', `${preload}<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script></head>`);
}

for (const url of routes) {
  const out = path.join(dist, url === '/' ? 'index.html' : path.join(url, 'index.html'));
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, page(url));
}
fs.writeFileSync(path.join(dist, '404.html'), page('/404/'));

const urls = routes.map((u) => `  <url><loc>${site.url}${u}</loc></url>`).join('\n');
fs.writeFileSync(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
fs.writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap.xml\n`);
fs.rmSync(path.resolve('dist-ssr'), { recursive: true, force: true });
console.log(`prerender: ${routes.length} rutas + 404 + sitemap + robots`);
