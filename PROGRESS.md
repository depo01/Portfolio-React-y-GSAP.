# Portafolio Josué Batista: estado y siguientes pasos

Última actualización: 2026-11-12. **Publicado** en GitHub Pages: https://depo01.github.io/

## Qué es
Portafolio "el día entero como página": el scroll recorre un día (amanecer cobalto → noche) y el sol se detiene en la sección de trabajo ("Detenido +HH:MM"). Idea: detener el reloj de quien repite la misma tarea.

## Stack
React + Vite + TypeScript, GSAP + ScrollTrigger + SplitText, Lenis. Router propio (~1 KB, `src/router.tsx`), sin Next.js. Prerender por ruta para SEO (`scripts/prerender.mjs`). JS ≈ 127 KB gzip.

## Publicación (GitHub Pages)
- Repositorio: https://github.com/depo01/depo01.github.io (público, rama `main`).
- Se llama `depo01.github.io` a propósito: el sitio y el prerender asumen que viven en la **raíz** del dominio (rutas `/assets/...`, `/cv-josue-batista.pdf`, `404.html`). Bajo una subruta tipo `/repo/` se rompería el enrutador.
- Despliegue automático: `.github/workflows/deploy.yml` compila (`npm run build`, Node 24) y publica `dist/` en cada `push` a `main`.
- Configuración requerida en GitHub: *Settings → Pages → Source: **GitHub Actions***. Con "Deploy from a branch" se sirve el código sin compilar y la página sale en blanco (ocurrió y se corrigió).
- Para actualizar el sitio: commit y `git push` a `main`; tarda 1-2 min y la caché de GitHub hasta 10 min (`Ctrl+F5`).
- Identidad de git **solo de este repositorio**: `depo01 <44944602+depo01@users.noreply.github.com>` (correo privado `noreply`; no usar el correo del trabajo en commits públicos).
- `.gitignore` excluye `.dev.log`, `.serve.log`, `.shots`, `dist`, `dist-ssr`.
- `site.url` = `https://depo01.github.io` (también `index.html`: canonical, `og:url`, `og:image`, `twitter:image`; sitemap y robots se generan en el build).

## Cómo correrlo
```
cd C:\Users\mjbatista\josue-batista
npm install            # solo la primera vez
npm run dev            # http://127.0.0.1:5173/
npm run build          # genera dist/ (prerender incluido)
```
Para ver el build: servir `dist` en el puerto 4400 (`node <skill>/scripts/serve.mjs dist --port 4400`, el skill awwwards está en `C:\Users\mjbatista\.claude\plugins\cache\juliobsz\awwwards\add880bd6ec9`).

## Dónde está cada cosa
- Contenido (textos, proyectos, teléfono, correo, estudios, testimonios): `src/data/site.ts`
- Páginas: `src/pages/Home.tsx`, `Case.tsx`, `NotFound.tsx`
- Cabecera, sol, pie con contacto: `src/components/Chrome.tsx`
- Estilos: `src/styles.css`
- Motor de movimiento: `src/engine/*`, `src/motion/day.ts` (variable `hour`), `src/motion/setup.ts`
- CV descargable: `public/cv-josue-batista.pdf` (se sirve tal cual; el botón "Descargar CV" usa `site.cv`)
- Diseño y decisiones: `DESIGN.md` (aún refleja supuestos antiguos, ver pendientes)

## Hecho
### Sesión anterior (2026-11-06)
- Sección **Estudios** (formación + certificaciones) entre Trayectoria y contacto.
- Arreglo de clics muertos: los saltos de ancla disparaban `popstate` y dejaban bloqueado el motor de navegación. Ahora las anclas de la misma página solo hacen scroll, y "Volver al amanecer" funciona desde los casos.
- Contacto: número `+1 829 815 3395` que abre WhatsApp (`wa.me/18298153395`) con mensaje inicial; correo debajo.

### Sesión 2026-11-12
- **CV sin marca de agua.** El PDF (exportado desde Word 2016) traía un "DWN" amarillo en diagonal como bloque de cabecera (imagen de contorno + letras en vector) en las 2 páginas. Se eliminó ese bloque del flujo de contenido; texto, fuentes, tamaño y el resto de píxeles quedaron idénticos.
- **CV con el portafolio nuevo.** La línea "Portfolio:" pasó de `legionportfolio.netlify.app` a `https://depo01.github.io/` (texto y enlace clicable, misma fuente/color/subrayado). El resto del documento no cambió. El nombre en el CV se deja como está ("Malber Josué Batista Cuello").
- Si hay que regenerar el CV desde Word, la marca de agua también debe quitarse allí (*Diseño → Marca de agua → Quitar*) y volver a poner el enlace nuevo. Los PDF de trabajo no están en el repositorio.
- **Testimonios** (`testimonials` en `site.ts`): se reemplazaron los dos ejemplos por tres textos: dos de Ing. Gerson Cabreja (jefe directo, Dominican Watchman National) y uno de Jeso Heredia (experto en SAP). **Son borradores redactados a partir del CV, no citas reales.**
- **Publicación** en GitHub Pages (ver sección arriba) y cambio del dominio de marcador a `depo01.github.io`.

## Estado de calidad (último dato medido, 2026-11-06)
- Críticos externos: 6,9 y luego 7,7. No se repasó después de los últimos arreglos ni de las secciones nuevas.
- 0 errores de consola, 0 overflow, 0 violaciones axe, auditoría 0 FAIL / 0 WARN, LCP móvil ≈ 1 s.
- Bajo el 8: loader móvil ≈ 6 s y fps móvil 34-40 (con CPU 4x lenta y red lenta; sin medir en teléfono real).
- Falsos positivos conocidos de `shoot.mjs`: `skipLinkFirst: false` (busca "skip" en inglés) y "Siguiente caso" sin cambio de hover (el puntero ya estaba encima).
- El build del 2026-11-12 pasa (`tsc -b` + vite + SSR + prerender: 6 rutas + 404 + sitemap + robots). Las mediciones de arriba no se repitieron.

## Pendientes / decisiones del dueño
1. **Testimonios**: pedir a Gerson Cabreja y a Jeso Heredia que aprueben (o reemplacen) el texto antes de difundir la web; si no aprueban, quitarlos o dejar solo los aprobados. Confirmar ortografía "Jeso" y el tratamiento "Ing.". Opcional: poner empresa en el cargo.
2. **Foto**: sigue `foto-placeholder.svg` (decisión del dueño: dejarla así por ahora). Reemplazar por una real en `public/` y ajustar `about.photo`/`photoAlt`.
3. **Textos marcados "ejemplo"** en `site.ts`: inglés "Intermedio (ejemplo)", `about.now` ("Hoy busco…"). Salen públicos tal cual.
4. Confirmar **correo público y teléfono** visibles en la web y en el CV (cualquiera los puede copiar).
5. Regenerar `og.png` con `og.mjs` si hace falta (el dominio ya es `depo01.github.io`).
6. Revisar el texto de "Cómo automatizo" (lo redacté yo desde el CV).
7. Aportar **resultados y capturas reales** de CRM Médico, Sistema de Gestión Interna y Dashboard Analítico (hoy sin cifras, sin imágenes). Es lo que más subiría Diseño y Contenido.
8. Fechas reales de Dominican Watchman (hoy "Antes") y años de estudios/certificaciones (hoy sin fechas). En el CV la empresa figura como "Dominican Watchman"; en el testimonio de Gerson, "Dominican Watchman National": unificar.
9. Actualizar `DESIGN.md` con el contenido basado en el CV, la sección Estudios y el contacto por WhatsApp.
10. Pasar un tercer crítico externo y repetir `shoot.mjs --crawl --nav` + `audit.mjs` sobre el build actual.
11. Medir rendimiento en un teléfono real; si el loader sigue largo, acortarlo.
12. Dominio propio (opcional): si se compra uno, configurar en *Settings → Pages → Custom domain* y cambiar `site.url`, `index.html`, y regenerar `og.png`.
