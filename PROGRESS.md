# Portafolio Josué Batista: estado y siguientes pasos

Última actualización: 2026-11-06. Nada está publicado; todo corre en local.

## Qué es
Portafolio "el día entero como página": el scroll recorre un día (amanecer cobalto → noche) y el sol se detiene en la sección de trabajo ("Detenido +HH:MM"). Idea: detener el reloj de quien repite la misma tarea.

## Stack
React + Vite + TypeScript, GSAP + ScrollTrigger + SplitText, Lenis. Router propio (~1 KB, `src/router.tsx`), sin Next.js. Prerender por ruta para SEO (`scripts/prerender.mjs`). JS ≈ 127 KB gzip.

## Cómo correrlo
```
cd C:\Users\mjbatista\josue-batista
npm install            # solo la primera vez
npm run dev            # http://127.0.0.1:5173/
npm run build          # genera dist/ (prerender incluido)
```
Para ver el build: servir `dist` en el puerto 4400 (`node <skill>/scripts/serve.mjs dist --port 4400`, el skill awwwards está en `C:\Users\mjbatista\.claude\plugins\cache\juliobsz\awwwards\add880bd6ec9`).

## Dónde está cada cosa
- Contenido (textos, proyectos, teléfono, correo, estudios): `src/data/site.ts`
- Páginas: `src/pages/Home.tsx`, `Case.tsx`, `NotFound.tsx`
- Cabecera, sol, pie con contacto: `src/components/Chrome.tsx`
- Estilos: `src/styles.css`
- Motor de movimiento: `src/engine/*`, `src/motion/day.ts` (variable `hour`), `src/motion/setup.ts`
- Diseño y decisiones: `DESIGN.md` (aún refleja supuestos antiguos, ver pendientes)

## Hecho en la última sesión
- Sección **Estudios** (formación + certificaciones) entre Trayectoria y contacto.
- Arreglo de clics muertos: los saltos de ancla disparaban `popstate` y dejaban bloqueado el motor de navegación. Ahora las anclas de la misma página solo hacen scroll, y "Volver al amanecer" funciona desde los casos.
- Contacto: número `+1 829 815 3395` que abre WhatsApp (`wa.me/18298153395`) con mensaje inicial; correo debajo.

## Estado de calidad (último dato medido)
- Críticos externos: 6,9 y luego 7,7. No se repasó después de los últimos arreglos ni de las secciones nuevas.
- 0 errores de consola, 0 overflow, 0 violaciones axe, auditoría 0 FAIL / 0 WARN, LCP móvil ≈ 1 s.
- Bajo el 8: loader móvil ≈ 6 s y fps móvil 34-40 (con CPU 4x lenta y red lenta; sin medir en teléfono real).
- Falsos positivos conocidos de `shoot.mjs`: `skipLinkFirst: false` (busca "skip" en inglés) y "Siguiente caso" sin cambio de hover (el puntero ya estaba encima).

## Pendientes / decisiones del dueño
1. Confirmar el **nombre** "Josué Batista" (el CV no lo trae; deducido del correo).
2. Confirmar correo público y teléfono visibles (cualquiera los puede copiar).
3. **Dominio real**: `https://josuebatista.dev` es un marcador (`site.url` en `site.ts`, además `og:image`, canonical, sitemap). Cambiarlo antes de publicar y regenerar `og.png` con `og.mjs` si hace falta.
4. Revisar el texto de "Cómo automatizo" (lo redacté yo desde el CV).
5. Aportar **resultados y capturas reales** de CRM Médico, Sistema de Gestión Interna y Dashboard Analítico (hoy sin cifras, sin imágenes). Es lo que más subiría Diseño y Contenido.
6. Fechas reales de Dominican Watchman (hoy "Antes") y años de estudios/certificaciones (hoy sin fechas).
7. Actualizar `DESIGN.md` con el contenido basado en el CV, la sección Estudios y el contacto por WhatsApp.
8. Pasar un tercer crítico externo y repetir `shoot.mjs --crawl --nav` + `audit.mjs` sobre el build actual.
9. Medir rendimiento en un teléfono real; si el loader sigue largo, acortarlo.
10. **Deploy**: no hecho. Solo con confirmación del dueño (Vercel/Netlify/Cloudflare Pages sirven `dist/` tal cual; el 404 es `dist/404.html`).
