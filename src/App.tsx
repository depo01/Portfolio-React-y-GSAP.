import { useEffect } from 'react';
import { CASE_RE, useLocation } from './router';
import { Footer, Header, Sun } from './components/Chrome';
import { Engine } from './engine/router';
import { projects, site } from './data/site';
import { setupMotion } from './motion/setup';
import Case from './pages/Case';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

export function routeMeta(path: string) {
  const m = path.match(CASE_RE);
  const p = m && projects.find((x) => x.slug === m[1]);
  if (p) return { title: `${p.title} | ${site.name}`, description: `${p.title}: ${p.summary} Caso de ${site.name}.` };
  if (path === '/' || path === '') return { title: `${site.name} | ${site.tagline} e IA`, description: site.description };
  return { title: `Página no encontrada | ${site.name}`, description: 'Esta página no existe. Vuelve al inicio.' };
}

function Meta() {
  const { pathname } = useLocation();
  useEffect(() => {
    const m = routeMeta(pathname);
    document.title = m.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', m.description);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', m.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', m.description);
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', site.url + pathname);
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', site.url + pathname);
  }, [pathname]);
  return null;
}

export default function App() {
  const { pathname } = useLocation();
  const slug = pathname.match(CASE_RE)?.[1];
  const project = projects.find((p) => p.slug === slug);
  const is404 = !(pathname === '/' || project);
  return (
    <>
      <a className="skip-link" href="#main" data-no-transition>Saltar al contenido</a>
      <Sun />
      <div id="curtain" aria-hidden="true"><div className="curtain__panel" /></div>
      <div id="loader" role="status" aria-label="Cargando">
        <div className="loader__inner">
          <span className="loader__name" data-loader-out>{site.name}</span>
          <span className="loader__count" data-loader-out data-loader-count>04:00</span>
        </div>
        <div className="loader__bar" data-loader-bar />
      </div>
      <Header />
      <main id="main" tabIndex={-1} className={is404 ? 'is-404' : undefined}>
        {pathname === '/' ? <Home /> : project ? <Case project={project} /> : <NotFound />}
      </main>
      {!is404 && <Footer />}
      <Meta />
      <Engine setup={setupMotion} />
    </>
  );
}
