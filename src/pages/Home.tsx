import { memo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { about, categories, certs, languages, method, path, projects, services, site, stack, study, testimonials } from '../data/site';
import { Roll } from '../components/Chrome';
import { ease, prefersReducedMotion } from '../engine';

gsap.registerPlugin(Flip);

const Arrow = () => (
  <svg className="arrow" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    <path d="M6 18 18 6M8 6h10v10" />
  </svg>
);

const HeldCounter = memo(function HeldCounter() {
  return <span className="work__held" data-held>+00:00</span>;
});

/** Índice de casos con filtro por categoría. Secuencia en tres tiempos, todos en la curva del sitio:
 *  1) las filas que sobran se desvanecen y suben un poco, sin moverse del sitio;
 *  2) las que se quedan se deslizan a su nuevo lugar (Flip) y la altura de la lista se ajusta con suavidad;
 *  3) las nuevas entran subiendo desde abajo, una tras otra. */
function WorkIndex() {
  const [cat, setCat] = useState(categories[0]);
  const listRef = useRef<HTMLUListElement>(null);
  const settled = useRef(false);
  const target = useRef(categories[0]);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const count = cat === categories[0] ? projects.length : projects.filter((p) => p.category === cat).length;

  const itemsOf = () => [...(listRef.current?.children ?? [])] as HTMLElement[];
  const visibleIn = (li: HTMLElement, c: string) => c === categories[0] || li.dataset.cat === c;

  /** Deja la lista en su estado final al instante (también al interrumpir una animación). */
  function settle() {
    const list = listRef.current;
    if (!list) return;
    const items = itemsOf();
    tl.current?.kill();
    tl.current = null;
    gsap.killTweensOf([list, ...items]);
    items.forEach((li) => { li.style.display = visibleIn(li, target.current) ? '' : 'none'; });
    gsap.set(items, { autoAlpha: 1, y: 0, clearProps: 'transform' });
    gsap.set(list, { clearProps: 'height,overflow' });
    ScrollTrigger.refresh();
    window.dispatchEvent(new Event('resize')); // el sol vuelve a medir las horas
  }

  function choose(next: string) {
    if (next === target.current) return;
    const list = listRef.current;
    if (!list) return;
    if (tl.current) settle(); // un clic nuevo termina la animación anterior sin saltos visibles
    const prev = target.current;
    target.current = next;
    setCat(next);

    const items = itemsOf();
    if (!settled.current) {
      // Las filas aún sin revelar por scroll quedan visibles: el filtro toma el control de su animación.
      items.forEach((li) => gsap.killTweensOf(li));
      gsap.set(items, { autoAlpha: 1, y: 0 });
      settled.current = true;
    }
    if (prefersReducedMotion()) { settle(); return; }

    const leaving = items.filter((li) => visibleIn(li, prev) && !visibleIn(li, next));
    const entering = items.filter((li) => !visibleIn(li, prev) && visibleIn(li, next));
    const staying = items.filter((li) => visibleIn(li, prev) && visibleIn(li, next));
    const h0 = list.offsetHeight;
    gsap.set(list, { height: h0, overflow: 'hidden' });

    const t = gsap.timeline({ onComplete: settle });
    tl.current = t;
    if (leaving.length) t.to(leaving, { autoAlpha: 0, y: -20, duration: 0.45, ease: ease.soft, stagger: 0.05 });
    t.add(() => {
      const state = Flip.getState(staying);
      leaving.forEach((li) => { li.style.display = 'none'; });
      entering.forEach((li) => { li.style.display = ''; });
      gsap.set(entering, { autoAlpha: 0, y: 36 });
      gsap.set(list, { height: 'auto' });
      const h1 = list.offsetHeight;
      gsap.set(list, { height: h0 });
      gsap.to(list, { height: h1, duration: 0.9, ease: ease.out });
      Flip.from(state, { duration: 0.9, ease: ease.out });
      gsap.to(entering, { autoAlpha: 1, y: 0, duration: 1, ease: ease.out, stagger: 0.09, delay: 0.25 });
    });
    t.to({}, { duration: 1.35 }); // mantiene viva la secuencia hasta que terminen los tweens anteriores
  }

  return (
    <>
      <div className="filter" role="group" aria-label="Filtrar casos por categoría">
        {categories.map((c) => (
          <button key={c} type="button" className="filter__chip" aria-pressed={c === cat} onClick={() => choose(c)}>{c}</button>
        ))}
        <p className="filter__count" role="status" aria-live="polite">{count} {count === 1 ? 'caso' : 'casos'}</p>
      </div>
      <ul className="index" ref={listRef}>
        {projects.map((p) => (
          <li key={p.slug} data-cat={p.category} data-reveal="up">
            <a className="row" href={`/work/${p.slug}/`}>
              <img className="row__thumb" src={p.image} alt="" width="800" height="600" loading="lazy" />
              <span className="row__org">{p.label}</span>
              <span className="row__title">{p.title}</span>
              <span className="row__kind">{p.kind}</span>
              <span className="row__go"><Arrow /></span>
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}

export default function Home() {
  return (
    <>
      <section id="inicio" className="hero" data-hour="5" aria-label="Presentación">
        <h1 className="hero__name">
          <span className="hero__a" data-split="chars" data-intro>Josué</span>
          <span className="hero__b" data-split="chars" data-intro>Batista</span>
        </h1>
        <div className="hero__foot">
          <p className="hero__role" data-reveal="fade" data-intro data-delay="0.5">
            {site.tagline}. Automatizo tareas operativas con Python, APIs REST y modelos de lenguaje, y mido el resultado en horas devueltas.
          </p>
          <p className="hero__cue" data-reveal="fade" data-intro data-delay="0.7">
            Baja: el día corre contigo
          </p>
        </div>
      </section>

      <section id="sobre" className="about" data-hour="8" aria-labelledby="sobre-t">
        <h2 id="sobre-t" className="about__lead" data-split="lines">
          Se dice que Josué detuvo el sol. Yo me conformo con detener el reloj de quien repite la misma tarea cada día.
        </h2>
        <div className="about__side">
          <img className="about__photo" src={about.photo} alt={about.photoAlt} width="400" height="480" loading="lazy" data-reveal="up" />
          <p data-reveal="up">
            Desarrollo aplicaciones completas, de la base de datos a la interfaz, y rediseño procesos manuales para que corran solos. Lo que automatizo con código queda pensado para replicarse en Make, n8n o Zapier.
          </p>
          <p className="about__now" data-reveal="up">{about.now}</p>
          <dl className="about__stack" data-reveal="up" data-delay="0.1">
            {stack.map((s) => (
              <div key={s.g}><dt>{s.g}</dt><dd>{s.v}</dd></div>
            ))}
          </dl>
        </div>
      </section>

      <section id="trabajo" className="work" data-hour="12" aria-labelledby="trabajo-t">
        <header className="work__head">
          <h2 id="trabajo-t" className="work__title" data-split="lines">Mediodía detenido</h2>
          <p className="work__note" data-reveal="up">
            El sol lleva <HeldCounter /> parado mientras miras. Cada caso empieza con una tarea repetida y termina con horas devueltas.
          </p>
        </header>
        <WorkIndex />
      </section>

      <section id="metodo" className="method" data-hour="12" data-hour-end="14" aria-labelledby="metodo-t">
        <h2 id="metodo-t" className="method__title" data-split="lines">Cómo automatizo</h2>
        <ol className="method__list">
          {method.map((m) => (
            <li key={m.n} data-reveal="up">
              <span className="method__n">{m.n}</span>
              <h3>{m.t}</h3>
              <p>{m.d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="servicios" className="method" data-hour="14" data-hour-end="16" aria-labelledby="servicios-t">
        <h2 id="servicios-t" className="method__title" data-split="lines">En qué puedo ayudarte</h2>
        <ol className="method__list">
          {services.map((s) => (
            <li key={s.n} data-reveal="up">
              <span className="method__n">{s.n}</span>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="trayectoria" className="path" data-hour="16" data-hour-end="17.5" aria-labelledby="trayectoria-t">
        <h2 id="trayectoria-t" className="path__title" data-split="lines">Trayectoria</h2>
        <ul className="path__jobs">
          {path.map((j) => (
            <li key={j.who} data-reveal="up">
              <p className="path__when">{j.when}</p>
              <h3 className="path__who">{j.who}</h3>
              <p className="path__what">{j.what}</p>
              <p className="path__d">{j.d}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="testimonios" className="voices" data-hour="17.5" data-hour-end="18" aria-labelledby="testimonios-t">
        <h2 id="testimonios-t" className="voices__title" data-split="lines">Lo que dicen</h2>
        <ul className="voices__list">
          {testimonials.map((t, i) => (
            <li key={i} data-reveal="up">
              <blockquote>{t.q}</blockquote>
              <p className="voices__who">{t.who}<span>{t.role}</span></p>
            </li>
          ))}
        </ul>
      </section>

      <section id="estudios" className="study" data-hour="18" data-hour-end="19" aria-labelledby="estudios-t">
        <h2 id="estudios-t" className="study__title" data-split="lines">Estudios</h2>
        <div className="study__col" data-reveal="up">
          <h3>Formación</h3>
          <ul className="study__big">
            {study.map((s) => (
              <li key={s.what}><span className="study__what">{s.what}</span><span className="study__where">{s.where}</span></li>
            ))}
          </ul>
        </div>
        <div className="study__col" data-reveal="up" data-delay="0.1">
          <h3>Certificaciones</h3>
          <ul className="study__list">
            {certs.map((c) => <li key={c.what}><span>{c.what}</span><span className="study__by">{c.by}</span></li>)}
          </ul>
        </div>
        <div className="study__col study__col--langs" data-reveal="up" data-delay="0.2">
          <h3>Idiomas</h3>
          <ul className="study__list">
            {languages.map((l) => <li key={l.l}><span>{l.l}</span><span className="study__by">{l.v}</span></li>)}
          </ul>
        </div>
        <a className="cta" href="#contacto"><Roll>Hablemos de tu proceso</Roll></a>
      </section>
    </>
  );
}
