import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { AppRouter } from './app/Router.tsx';
import { AppRoutes } from './app/AppRoutes.tsx';
import { ScriptProvider } from './app/ScriptProvider.tsx';
import { AuthProvider } from './app/AuthProvider.tsx';
import { queryClient } from './app/queryClient.ts';
import './i18n';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ScriptProvider>
        <AppRouter>
          {/* Inside the router: the guard redirects, which needs a router. */}
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </AppRouter>
      </ScriptProvider>
    </QueryClientProvider>
  </StrictMode>
);
