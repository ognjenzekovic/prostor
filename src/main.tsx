import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AppRouter } from './app/Router.tsx';
import { AppRoutes } from './app/AppRoutes.tsx';
import { ScriptProvider } from './app/ScriptProvider.tsx';
import './i18n';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ScriptProvider>
      <AppRouter>
        <AppRoutes />
      </AppRouter>
    </ScriptProvider>
  </StrictMode>
);
