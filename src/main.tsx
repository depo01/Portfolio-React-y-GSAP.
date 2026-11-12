import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import '@fontsource-variable/archivo/wdth.css';
import './styles.css';
import App from './App';
import { Router } from './router';

const app = (
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>
);
const root = document.getElementById('root')!;
// Con HTML prerenderizado se hidrata (reutiliza el DOM: LCP temprano, sin parpadeo); en desarrollo se monta.
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
