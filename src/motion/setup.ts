// Movimiento global del sitio. Corre una vez en el cliente, antes de la primera página.
import { gsap } from 'gsap';
import { ease, setLoaderExit, setLoaderFormat, setTransition } from '../engine';
import { initDay, sunCenter } from './day';

const reach = (x: number, y: number) =>
  Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)) * 1.06;

export function setupMotion() {
  // Loader: un reloj que va de las 04:00 a las 05:00 (el amanecer del hero).
  setLoaderFormat((p) => {
    const m = Math.round((p / 100) * 60);
    return m >= 60 ? '05:00' : `04:${String(m).padStart(2, '0')}`;
  });

  // Salida del loader: el círculo oscuro se cierra hasta el sol que sale en el hero.
  setLoaderExit((root) => {
    const c = sunCenter();
    const R = reach(c.x, c.y);
    return gsap.timeline()
      .to(root.querySelectorAll('[data-loader-out]'), { yPercent: -110, duration: 0.35, ease: ease.inOut, stagger: 0.03 })
      .fromTo(root, { clipPath: `circle(${R}px at ${c.x}px ${c.y}px)` }, { clipPath: `circle(0px at ${c.x}px ${c.y}px)`, duration: 0.8, ease: ease.inOut }, '-=0.2');
  });

  // Transición: un iris de tinta que nace del centro del sol, cubre y se recoge hacia el sol nuevo.
  setTransition({
    leave: (curtain) => {
      const panel = curtain.querySelector<HTMLElement>('.curtain__panel')!;
      const c = sunCenter();
      const ink = getComputedStyle(document.documentElement).getPropertyValue('--c-fg').trim();
      return gsap.timeline()
        .set(curtain, { autoAlpha: 1 })
        .set(panel, { yPercent: 0, backgroundColor: ink })
        .fromTo(panel, { clipPath: `circle(0px at ${c.x}px ${c.y}px)` }, { clipPath: `circle(${reach(c.x, c.y)}px at ${c.x}px ${c.y}px)`, duration: 0.7, ease: ease.inOut });
    },
    enter: (curtain) => {
      const panel = curtain.querySelector<HTMLElement>('.curtain__panel')!;
      const c = sunCenter();
      return gsap.timeline()
        .fromTo(panel, { clipPath: `circle(${reach(c.x, c.y)}px at ${c.x}px ${c.y}px)` }, { clipPath: `circle(0px at ${c.x}px ${c.y}px)`, duration: 0.8, ease: ease.inOut })
        .set(curtain, { autoAlpha: 0 });
    },
  });

  initDay();
}
