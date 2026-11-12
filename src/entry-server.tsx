import { renderToString } from 'react-dom/server';
import App, { routeMeta } from './App';
import { projects, site } from './data/site';
import { StaticRouter } from './router';

export function render(url: string) {
  return renderToString(
    <StaticRouter url={url}>
      <App />
    </StaticRouter>,
  );
}

export const routes = ['/', ...projects.map((p) => `/work/${p.slug}/`)];
export { routeMeta, site };
