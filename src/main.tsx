import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, HashRouter, Routes, Route } from 'react-router-dom';
import './index.css';

const Router = import.meta.env.VITE_USE_HASH_ROUTER === 'true' ? HashRouter : BrowserRouter;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router basename={import.meta.env.VITE_USE_HASH_ROUTER === 'true' ? undefined : '/prostor/'}>
      <Routes>
        <Route path="/" element={<h1>Prostor</h1>} />
      </Routes>
    </Router>
  </StrictMode>
);