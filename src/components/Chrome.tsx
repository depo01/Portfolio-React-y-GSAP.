import { memo, useState } from 'react';
import type { FormEvent } from 'react';
import { useLocation } from '../router';
import { contact, site } from '../data/site';

type Status = 'idle' | 'sending' | 'sent' | 'error';

/** Formulario: con `contact.formEndpoint` envía por fetch; sin él, abre el correo del visitante. */
function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if (data.get('empresa')) return; // trampa para bots: un humano no lo ve ni lo llena
    const name = String(data.get('nombre') ?? '').trim();
    const email = String(data.get('correo') ?? '').trim();
    const message = String(data.get('mensaje') ?? '').trim();

    if (!contact.formEndpoint) {
      const subject = encodeURIComponent(`Contacto desde el portafolio: ${name}`);
      const body = encodeURIComponent(`${message}\n\n${name}\n${email}`);
      window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
      setStatus('sent');
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch(contact.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  }

  return (
    <form className="form" onSubmit={onSubmit} aria-label="Formulario de contacto">
      <div className="form__row">
        <label className="form__field">
          <span>Nombre</span>
          <input name="nombre" type="text" autoComplete="name" required maxLength={80} />
        </label>
        <label className="form__field">
          <span>Correo</span>
          <input name="correo" type="email" autoComplete="email" required maxLength={120} />
        </label>
      </div>
      <label className="form__field">
        <span>¿Qué tarea quieres quitarte de encima?</span>
        <textarea name="mensaje" rows={4} required maxLength={1500} />
      </label>
      <label className="form__trap" aria-hidden="true">
        Empresa
        <input name="empresa" type="text" tabIndex={-1} autoComplete="off" />
      </label>
      <div className="form__foot">
        <button className="cta" type="submit" disabled={status === 'sending'}>
          <Roll>{status === 'sending' ? 'Enviando…' : 'Enviar mensaje'}</Roll>
        </button>
        <p className="form__status" role="status" aria-live="polite">
          {status === 'sent' && (contact.formEndpoint ? 'Recibido. Te respondo pronto.' : 'Se abrió tu correo con el mensaje listo para enviar.')}
          {status === 'error' && `No se pudo enviar. Escríbeme a ${site.email} o por WhatsApp.`}
        </p>
      </div>
      <p className="form__meta">{contact.responseTime} · {contact.location}</p>
    </form>
  );
}

/** Rodillo de texto: el texto sube y su copia (text-shadow, no está en el DOM) ocupa su lugar. */
export function Roll({ children }: { children: string }) {
  return <span className="roll"><span>{children}</span></span>;
}

const TICKS = Array.from({ length: 72 }, (_, i) => i);

/** El sol: un anillo con marcas, siempre detrás del contenido. Persiste entre páginas. */
export const Sun = memo(function Sun() {
  return (
    <div id="sun" aria-hidden="true">
      <div className="sun__breathe">
        <svg className="sun__body" viewBox="0 0 200 200" fill="none">
          <circle className="sun__core" cx="100" cy="100" r="72" />
          <circle className="sun__ring" cx="100" cy="100" r="98" />
        </svg>
        <svg className="sun__ticks" viewBox="0 0 200 200" fill="none">
          {TICKS.map((i) => {
            const long = i % 6 === 0;
            return <line key={i} x1="100" y1={long ? 6 : 10} x2="100" y2={long ? 22 : 17} transform={`rotate(${i * 5} 100 100)`} />;
          })}
        </svg>
      </div>
    </div>
  );
});

/** Reloj: lo actualiza el módulo conductor; React no lo vuelve a tocar. */
const Clock = memo(function Clock() {
  return (
    <p className="clock">
      <span className="clock__time" data-clock>05:00</span>
      <span className="clock__label" data-clock-label>Amanecer</span>
    </p>
  );
});

export function Header() {
  const { pathname } = useLocation();
  const home = pathname === '/';
  const to = (hash: string) => (home ? hash : `/${hash}`);
  return (
    <header className="header">
      <a className="header__brand" href="/" aria-current={home ? 'page' : undefined}>
        <Roll>JB</Roll><span className="sr-only"> {site.name}, inicio</span>
      </a>
      <Clock />
      <nav className="header__nav" aria-label="Principal">
        <a href={to('#trabajo')} aria-current={pathname.startsWith('/work') ? 'page' : undefined}><Roll>Trabajo</Roll></a>
        <a className="hide-s" href={to('#sobre')}><Roll>Sobre mí</Roll></a>
        <a className="pill" href={to('#contacto')}><Roll>Hablemos</Roll></a>
      </nav>
    </header>
  );
}

export function Footer() {
  const { pathname } = useLocation();
  return (
    <footer id="contacto" className="footer" data-hour="19" data-hour-end="22">
      <h2 className="footer__title" data-split="lines">Hablemos.</h2>
      <p className="footer__lead" data-reveal="fade">
        Cuéntame qué tarea repite tu equipo todos los días. Te respondo con una forma de medirla y de quitársela de encima.
      </p>
      <div className="footer__contact">
        <a
          className="footer__mail"
          href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent('Hola Josué, vi tu portafolio y quiero hablar de un proceso que hoy se hace a mano.')}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`WhatsApp ${site.phone} (se abre en una pestaña nueva)`}
        >
          <Roll>{site.phone}</Roll>
        </a>
        <span className="footer__via">WhatsApp</span>
        <a className="footer__mail footer__mail--s" href={`mailto:${site.email}`} data-no-transition><Roll>{site.email}</Roll></a>
      </div>
      <ContactForm />
      <ul className="footer__social" aria-label="Perfiles profesionales">
        <li>
          <a href={site.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub (se abre en una pestaña nueva)"><Roll>GitHub</Roll></a>
        </li>
        <li>
          <a href={site.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn (se abre en una pestaña nueva)"><Roll>LinkedIn</Roll></a>
        </li>
        <li>
          <a href={site.cv} download data-no-transition aria-label="Descargar CV en PDF"><Roll>Descargar CV</Roll></a>
        </li>
      </ul>
      <div className="footer__base">
        <p>© 2026 {site.name}. {site.tagline}, hecho a mano con React y GSAP.</p>
        <a className="footer__up" href={pathname === '/' ? '#inicio' : '/'}><Roll>Volver al amanecer</Roll></a>
      </div>
    </footer>
  );
}
