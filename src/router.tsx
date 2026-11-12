// Router mínimo (≈1 KB): tres rutas no justifican una librería. Los clics los intercepta el motor
// (engine/router.tsx), que llama a navigate() cuando termina la transición.
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

type Nav = { pathname: string; navigate: (to: string) => void };
const Ctx = createContext<Nav>({ pathname: '/', navigate: () => {} });

export const useLocation = () => ({ pathname: useContext(Ctx).pathname });
export const useNavigate = () => useContext(Ctx).navigate;

/** Cliente: sigue el historial del navegador. */
export function Router({ children }: { children: ReactNode }) {
  const [pathname, setPathname] = useState(() => location.pathname);
  useEffect(() => {
    history.scrollRestoration = 'manual';
    const on = () => setPathname(location.pathname);
    addEventListener('popstate', on);
    return () => removeEventListener('popstate', on);
  }, []);
  const navigate = useCallback((to: string) => {
    history.pushState(null, '', to);
    setPathname(new URL(to, location.href).pathname);
  }, []);
  const value = useMemo(() => ({ pathname, navigate }), [pathname, navigate]);
  return <Ctx value={value}>{children}</Ctx>;
}

/** Servidor (prerender): una ruta fija. */
export function StaticRouter({ url, children }: { url: string; children: ReactNode }) {
  const value = useMemo(() => ({ pathname: url, navigate: () => {} }), [url]);
  return <Ctx value={value}>{children}</Ctx>;
}

export const CASE_RE = /^\/work\/([^/]+)\/?$/;
