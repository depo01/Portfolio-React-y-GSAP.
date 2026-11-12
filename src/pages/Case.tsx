import { projects, type Project } from '../data/site';

export default function Case({ project: p }: { project: Project }) {
  const i = projects.indexOf(p);
  const next = projects[(i + 1) % projects.length];
  return (
    <article className="case">
      <header className="case__head" data-hour="7">
        <h1 className="case__title" data-reveal="clip" data-intro>{p.title}</h1>
        <dl className="case__meta" data-reveal="fade" data-intro data-delay="0.3">
          <div><dt>Dónde</dt><dd>{p.org}</dd></div>
          <div><dt>Tipo</dt><dd>{p.kind}</dd></div>
          <div><dt>Mi papel</dt><dd>{p.role}</dd></div>
          <div><dt>Herramientas</dt><dd>{p.stack}</dd></div>
        </dl>
      </header>

      <figure className="case__cover" style={{ background: p.bg, color: p.fg }} data-reveal="scale" aria-label={`Portada tipográfica de ${p.title}`}>
        {p.metric ? (
          <p className="case__metric"><span className="case__n">{p.metric.n}</span><span className="case__u">{p.metric.u}</span></p>
        ) : (
          <span className="case__glyph" aria-hidden="true">{p.title.charAt(0)}</span>
        )}
        <figcaption>{p.summary}</figcaption>
      </figure>

      <img className="case__shot" src={p.image} alt={`Imagen de prueba de ${p.title}`} width="800" height="600" loading="lazy" data-reveal="up" />

      <div className="case__body" data-hour="10">
        {p.flow && (
          <ol className="flow" data-reveal="up" aria-label="De dónde a dónde">
            {['Antes', 'Puente', 'Después'].map((k, n) => (
              <li key={k}><span className="flow__k">{k}</span><span className="flow__v">{p.flow![n]}</span></li>
            ))}
          </ol>
        )}
        {p.sections.map((s) => (
          <section key={s.h}>
            <h2 data-split="lines">{s.h}</h2>
            <p data-reveal="up">{s.p}</p>
          </section>
        ))}
      </div>

      <a className="case__next" href={`/work/${next.slug}/`} data-hour="16">
        <span className="case__next-k">Siguiente caso</span>
        <span className="case__next-t">{next.title}</span>
      </a>
    </article>
  );
}
