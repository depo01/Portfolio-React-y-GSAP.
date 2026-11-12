# DESIGN.md — Josué Batista

## Brief (supuestos)
- Sujeto: Josué Batista (nombre deducido del correo de la cuenta; cambiar en `src/data/site.ts`).
- Profesión asumida: diseñador y desarrollador creativo independiente. **Supuesto, a confirmar.**
- Audiencia: estudios y marcas pequeñas que contratan; trabajo freelance.
- Trabajo del sitio: conseguir encargos.
- Idioma: español. Stack: **React + Vite + React Router** (pedido del usuario; sin Next.js), GSAP, Lenis, SplitText. Sin WebGL: el concepto se resuelve con color, geometría y tipografía.
- Los 4 proyectos y sus casos son **ficticios** (marcados `placeholder`). No hay clientes, premios ni cifras inventadas.

## Concepto (tres territorios)
| | Idea | Ancla | O / Fit / Fac / Port (menor = mejor) |
|---|---|---|---|
| A. Nombre | El día entero como página: el sol cruza el cielo al hacer scroll y se **detiene** en el trabajo, como el Josué bíblico que mandó parar el sol | el nombre "Josué" y el episodio de Josué 10 | 5 / 5 / 4 / 1 |
| B. Material | Proyectos como hojas de un cuaderno de código con diffs | oficio de dev | 3 / 4 / 4 / 4 |
| C. Formal | Todo el sitio en una sola línea de texto que se desplaza | sistema | 3 / 3 / 5 / 4 |

Elegida: **A**. Alternativa robada para detalle: el 404 de C (una sola línea).

### Concept Card
```
Idea:        Un día que recorres con el scroll y que se detiene en el trabajo.
Metaphor:    El reloj de sol / el episodio de Josué: el sol se para para que haya tiempo de ver.
Signature:   El sol (anillo) cruza el cielo; al llegar al trabajo se detiene y el reloj marca "Detenido +HH:MM".
Emotion:     Primer vistazo: amanecer cobalto, calma con tensión; luego calor.
Motion verb: "se desliza y se asienta", como la sombra de un reloj de sol (expo.out, sin rebotes).
Screenshot:  Mediodía amarillo, anillo solar detrás de la lista de proyectos, reloj en 12:00 "Detenido".
```
Driver único: `hour` (0–24) derivada del scroll por secciones (`data-hour`, `data-hour-end`). Gobierna: color de fondo y tinta (variables en `<html>`), posición del sol, reloj, estado "detenido", transición de páginas. Estado en reposo: el anillo de marcas gira 1 vuelta cada 2 minutos y respira ±0,4 %; al detenerse el sol, el giro frena a cero y solo queda la respiración.

## Sistema
**Paleta (el cielo, un campo plano por hora; el sol es una geometría, no una ilustración)**
| Hora | Fondo | Nombre |
|---|---|---|
| 3 | `#0a0d24` | noche |
| 5 | `#2433ff` | amanecer cobalto (primer frame) |
| 8 | `#bcd4ff` | mañana |
| 12 | `#ffd21f` | mediodía (sol detenido) |
| 16 | `#ffa31a` | tarde |
| 19 | `#ff4a2a` | atardecer |
| 22 | `#0a0d24` | noche |
Tinta: `#0a0d24` o `#f6f4ee`, la que dé más contraste según luminancia (umbral 0,19). Mínimo medido ≈ 5,3:1 en el cruce. Muted = 74 % tinta sobre fondo. Línea = 28 % tinta. Cortina = tinta saliente.

**Tipo**: una familia, **Archivo variable** (Fontsource, autoalojada). Display: ancho 125 %, peso 800, mayúsculas, tracking −0,035 em, leading 0,86. Texto: ancho 100 %, peso 400, 17 px, leading 1,55. UI: 13 px, peso 600, +0,02 em. Cifras tabulares en reloj.

**Rejilla**: 12 columnas, gutter fluido 1–2,5 rem, margen igual al gutter. Cada sección una familia de composición distinta (ver wireframes).
**Forma**: radio 0 en bloques; píldora (999px) solo para el CTA. **Motion**: `expo.out` / `expo.inOut`, 0,7–1,3 s; los grandes más lentos; stagger 20–80 ms.

## Composición
```
HERO (5h)           ABOUT (8→12h)          TRABAJO (12h detenido)   MÉTODO (12→19h)       CONTACTO (19→22h)
JOSUÉ ........      frase 8 col  ........  título + reloj detenido  título sticky | lista  HABLEMOS gigante
     BATISTA        | párrafo 4 col         ┌ fila 01 ─────── ↗ ┐    1 ─────────────        email gigante
rol / aviso   ↓     servicios en columnas  └ fila 02 ...         2 ───                     pie: © · subir
(anillo sale        (anillo sube)          (anillo en el cénit)   (anillo baja, naranja)   (luna baja)
 por abajo-izq)
```
Hover (un tratamiento por rol): nav y enlaces = rodillo de texto (text-shadow + translateY); filas de proyecto = relleno que sube desde abajo con inversión de color y flecha que viaja; CTA píldora = mismo relleno. Foco = contorno 2 px en tinta. Cursor nativo siempre.

**Loader** (2 s máx.): sobre noche, nombre + reloj 04:00→05:00 (amanecer); salida: círculo que se cierra hasta la posición del sol del hero.
**Transición de página**: iris de tinta que nace del centro del sol, cubre la pantalla y se recoge hacia el sol de la página nueva.
**404**: noche (3 h), luna alta, "Aquí ya anocheció".

## Prueba de genericidad
Un modelo genérico daría: portafolio oscuro, acento verde/violeta, hero centrado con gradiente, tres tarjetas. Aquí: campo de color plano que cambia por hora, un anillo solar como único ornamento, nombre expandido en dos líneas escalonadas, lista de proyectos como índice. Cambios hechos al detectar tics: sin eyebrows, sin numeración decorativa salvo en el método (que sí es secuencia), sin tarjetas iguales.

## Idle
Anillo gira y respira en reposo (un solo reloj, pausa con reduced-motion). Detenido el sol: solo respira (decisión del concepto).
