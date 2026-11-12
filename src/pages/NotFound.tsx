import { Roll } from '../components/Chrome';

export default function NotFound() {
  return (
    <section className="nf" data-hour="3" data-hour-end="4" aria-labelledby="nf-t">
      <p className="nf__code" aria-hidden="true">404</p>
      <h1 id="nf-t" className="nf__title" data-reveal="clip" data-intro>Aquí ya anocheció.</h1>
      <p className="nf__text" data-reveal="fade" data-intro data-delay="0.3">
        Esta página no existe, o se fue con el sol. Ni Josué pudo detenerla.
      </p>
      <a className="cta" href="/"><Roll>Volver al amanecer</Roll></a>
    </section>
  );
}
