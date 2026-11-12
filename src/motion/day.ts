// Módulo conductor: una sola variable, `hour`, gobierna todo lo que lleva el concepto.
// Entra: la posición de scroll. Sale: color de fondo y tinta (variables en <html>), posición
// del sol, reloj, estado "detenido" y contador de tiempo detenido. Corre en el reloj único de GSAP.
import { gsap } from 'gsap';
import { onPage, prefersReducedMotion, scrollState } from '../engine';

const DARK = '#0a0d24';
const LIGHT = '#f6f4ee';
const SKY: [number, string][] = [
  [3, '#0a0d24'],
  [5, '#2433ff'],
  [8, '#bcd4ff'],
  [12, '#ffd21f'],
  [16, '#ffa31a'],
  [19, '#ff4a2a'],
  [22, '#0a0d24'],
];

const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const lin = (c: number) => { const s = c / 255; return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); };
const lum = ([r, g, b]: number[]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const pad = (n: number) => String(n).padStart(2, '0');

function skyAt(h: number): number[] {
  if (h <= SKY[0][0]) return hex(SKY[0][1]);
  for (let i = 1; i < SKY.length; i++) {
    if (h <= SKY[i][0]) {
      const [h0, c0] = SKY[i - 1];
      const [h1, c1] = SKY[i];
      const t = (h - h0) / (h1 - h0);
      const a = hex(c0), b = hex(c1);
      return a.map((v, k) => Math.round(lerp(v, b[k], t)));
    }
  }
  return hex(SKY[SKY.length - 1][1]);
}

function label(h: number, held: boolean) {
  if (held) return 'Detenido';
  if (h < 5) return 'Noche';
  if (h < 7) return 'Amanecer';
  if (h < 11) return 'Mañana';
  if (h < 14) return 'Mediodía';
  if (h < 18) return 'Tarde';
  if (h < 20.5) return 'Atardecer';
  return 'Noche';
}

/** Centro del sol (fracción del viewport) según la hora. */
function sunAt(h: number): [number, number] {
  const portrait = innerWidth < 768; // en el móvil el arco es más alto y más estrecho
  const base = portrait ? 0.84 : 0.95;
  const amp = portrait ? 0.52 : 0.63;
  if (h < 5) {
    const u = (5 - h) / 2; // 404: la luna alta
    return [lerp(0.15, 0.5, clamp(u)), lerp(base, 0.5, clamp(u))];
  }
  if (h <= 19) {
    const t = (h - 5) / 14;
    return [lerp(0.15, 0.85, t), base - amp * Math.sin(Math.PI * t)];
  }
  const t = clamp((h - 19) / 3);
  return [lerp(0.85, 0.5, t), lerp(1.15, 0.78, t)]; // la luna sube
}

type Seg = { top: number; bottom: number; h0: number; h1: number };

export function sunCenter() {
  const el = document.getElementById('sun');
  if (!el) return { x: innerWidth / 2, y: innerHeight, r: 0 };
  const b = el.getBoundingClientRect();
  return { x: b.left + b.width / 2, y: b.top + b.height / 2, r: b.width / 2 };
}

let hourNow = 5; // la hora que se muestra (suavizada)
export const currentHour = () => hourNow;

export function initDay() {
  const root = document.documentElement;
  const sun = document.getElementById('sun');
  // Capas HTML con transform (compuestas por GPU): girar o respirar no repinta el SVG.
  const ticks = sun?.querySelector<HTMLElement>('.sun__ticks') ?? null;
  const breathe = sun?.querySelector<HTMLElement>('.sun__breathe') ?? null;
  const theme = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  const setX = sun ? gsap.quickSetter(sun, 'x', 'px') : null;
  const setY = sun ? gsap.quickSetter(sun, 'y', 'px') : null;
  const setAngle = ticks ? gsap.quickSetter(ticks, 'rotation', 'deg') : null;
  const setScale = breathe ? gsap.quickSetter(breathe, 'scale') : null;
  let sunSize = sun?.offsetWidth ?? 0; // se mide aparte: leerlo cada fotograma fuerza layout
  let lastXY = '';

  let segs: Seg[] = [];
  let target = 5;
  let held = false;
  let heldMin = 0;
  let spin = 1;
  let angle = 0;
  let lastClock = '';
  let lastHeld = '';
  let lastBg = '';
  let lastInk = '';
  const header = document.querySelector<HTMLElement>('.header');
  const clocks = () => document.querySelectorAll<HTMLElement>('[data-clock]');
  const labels = () => document.querySelectorAll<HTMLElement>('[data-clock-label]');
  const heldEls = () => document.querySelectorAll<HTMLElement>('[data-held]');

  function measure() {
    sunSize = sun?.offsetWidth ?? sunSize;
    lastXY = '';
    const els = [...document.querySelectorAll<HTMLElement>('[data-hour]')];
    const sy = scrollY;
    const tops = els.map((el) => el.getBoundingClientRect().top + sy);
    const total = document.documentElement.scrollHeight;
    segs = els.map((el, i) => ({
      top: i === 0 ? 0 : tops[i],
      bottom: i < els.length - 1 ? tops[i + 1] : total,
      h0: parseFloat(el.dataset.hour!),
      h1: el.dataset.hourEnd
        ? parseFloat(el.dataset.hourEnd)
        : i < els.length - 1 ? parseFloat(els[i + 1].dataset.hour!) : parseFloat(el.dataset.hour!),
    }));
  }

  function read() {
    if (!segs.length) return;
    const vh = innerHeight;
    const max = Math.max(1, document.documentElement.scrollHeight - vh);
    const y = scrollState().y || scrollY;
    // Punto de lectura: en la cima del scroll lee el borde superior (hora exacta del primer frame),
    // en el centro de pantalla a media página, y en el borde inferior al final (llega a la hora final).
    const probe = y + vh * 0.5 * clamp(y / (vh * 0.5)) + vh * 0.5 * clamp((y - (max - vh * 0.5)) / (vh * 0.5));
    let seg = segs[segs.length - 1];
    for (const s of segs) if (probe < s.bottom) { seg = s; break; }
    const t = clamp((probe - seg.top) / Math.max(1, seg.bottom - seg.top));
    target = lerp(seg.h0, seg.h1, t);
    held = seg.h0 === seg.h1;
    heldMin = held ? t * 1440 : 0;
  }

  function apply() {
    const h = hourNow;
    // Color y tinta: una sola variable global, todo el texto la sigue.
    const bg = skyAt(h);
    const bgHex = '#' + bg.map((v) => v.toString(16).padStart(2, '0')).join('');
    const ink = lum(bg) > 0.19 ? DARK : LIGHT;
    if (bgHex !== lastBg) {
      lastBg = bgHex;
      // El fondo va directo a dos elementos (no por variable heredada: una variable obliga a
      // recalcular estilos de toda la página en cada fotograma). La tinta solo cambia al cruzar el umbral.
      root.style.backgroundColor = bgHex;
      if (header) header.style.backgroundColor = bgHex;
      theme?.setAttribute('content', bgHex);
      if (ink !== lastInk) {
        lastInk = ink;
        root.style.setProperty('--c-fg', ink);
        root.style.setProperty('--c-on', ink === DARK ? LIGHT : DARK);
      }
    }
    // Sol
    if (sun && setX && setY) {
      const [fx, fy] = sunAt(h);
      const px = Math.round((fx * innerWidth - sunSize / 2) * 10) / 10;
      const py = Math.round((fy * innerHeight - sunSize / 2) * 10) / 10;
      const key = `${px},${py}`;
      if (key !== lastXY) { lastXY = key; setX(px); setY(py); }
    }
    // Reloj
    const mins = Math.round(h * 60);
    const clock = `${pad(Math.floor(mins / 60) % 24)}:${pad(mins % 60)}`;
    const text = held ? '12:00' : clock;
    const lab = label(h, held);
    if (text + lab !== lastClock) {
      lastClock = text + lab;
      clocks().forEach((el) => { el.textContent = text; });
      labels().forEach((el) => { el.textContent = lab; });
    }
    const hm = `+${pad(Math.floor(heldMin / 60))}:${pad(Math.floor(heldMin % 60))}`;
    if (hm !== lastHeld) {
      lastHeld = hm;
      heldEls().forEach((el) => { el.textContent = hm; });
    }
    root.classList.toggle('is-held', held);
  }

  function snap() {
    measure();
    read();
    hourNow = target;
    lastClock = '';
    lastHeld = '';
    apply();
  }

  const tick = (time: number, dtMs: number) => {
    const dt = Math.min(dtMs, 64) / 1000;
    const reduce = prefersReducedMotion();
    read();
    if (reduce) hourNow = target;
    else hourNow += (target - hourNow) * (1 - Math.exp(-dt * 8));
    apply();
    // Reposo: el anillo gira y respira. Detenido, el giro frena a cero; la respiración queda.
    if (!reduce && setAngle && setScale) {
      spin += ((held ? 0 : 1) - spin) * (1 - Math.exp(-dt * 2.2));
      angle += spin * dt * 3;
      setAngle(angle);
      setScale(1 + 0.004 * Math.sin(time * 0.9));
    }
  };
  gsap.ticker.add(tick);

  // Cada página reconstruye sus tramos de hora y fija la hora sin suavizar.
  onPage(() => {
    snap();
    const remeasure = () => { measure(); read(); };
    addEventListener('resize', remeasure);
    const iv = window.setInterval(remeasure, 2500); // fuentes y reflujos tardíos
    return () => { removeEventListener('resize', remeasure); clearInterval(iv); segs = []; };
  });
}
