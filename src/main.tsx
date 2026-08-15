import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Routes, Route } from 'react-router-dom';
import { AppRouter } from './app/Router.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppRouter>
      <Routes>
        <Route path="/" element={<h1>Prostor</h1>} />
      </Routes>
    </AppRouter>
  </StrictMode>
);