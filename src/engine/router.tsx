// Adaptador React Router. <Engine /> va una sola vez, como último hijo del layout raíz,
// para que los efectos de las páginas (usePage) se registren antes de que el motor arranque.
// Los enlaces internos reproducen leave → navigate → enter. data-no-transition los excluye.
import { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigate } from '../router';
import { boot, cleanup, enter, leave, onPage, scrollToTarget, type PageFn } from './index';

const norm = (p: string) => (p.length > 1 ? p.replace(/\/+$/, '') : p);

export function Engine({ setup }: { setup?: () => void }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const mode = useRef<'idle' | 'push' | 'pop'>('idle');
  const first = useRef(true);
  const shown = useRef(pathname); // ruta que muestra React ahora mismo

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { boot(setup); }, []);

  useEffect(() => {
    const onClick = async (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest('a');
      if (!a || (a.target && a.target !== '_self') || a.hasAttribute('download') || a.hasAttribute('data-no-transition')) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      e.preventDefault();
      // Misma página: solo se desplaza (con Lenis), sin transición ni cambio de ruta.
      if (norm(url.pathname) === norm(location.pathname)) {
        if (url.hash !== location.hash) history.pushState(null, '', url.pathname + url.search + url.hash);
        const id = decodeURIComponent(url.hash.slice(1));
        scrollToTarget(id && document.getElementById(id) ? `#${CSS.escape(id)}` : 0);
        return;
      }
      if (mode.current !== 'idle') return;
      mode.current = 'push';
      try {
        await leave();
        cleanup();
        navigate(url.pathname + url.search + url.hash);
      } catch {
        mode.current = 'idle';
      }
    };
    const onPop = () => {
      // Los saltos de ancla también disparan popstate: solo cuenta si cambió la ruta.
      if (norm(location.pathname) === norm(shown.current)) return;
      mode.current = 'pop';
      cleanup();
    };
    document.addEventListener('click', onClick, true);
    addEventListener('popstate', onPop);
    return () => {
      document.removeEventListener('click', onClick, true);
      removeEventListener('popstate', onPop);
    };
  }, [navigate]);

  // useLayoutEffect: el DOM nuevo ya está montado, antes de que el navegador pinte.
  useLayoutEffect(() => {
    shown.current = pathname;
    if (first.current) { first.current = false; return; }
    const pop = mode.current === 'pop';
    mode.current = 'idle';
    enter({ transition: !pop, scrollTop: !pop }).then(() => {
      if (!pop && location.hash) setTimeout(() => scrollToTarget(location.hash), 60);
    });
  }, [pathname]);

  return null;
}

/** Código de página: corre cuando la página está lista (tras el loader) y se revierte al salir. */
export function usePage(fn: PageFn) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => onPage(fn), []);
}
