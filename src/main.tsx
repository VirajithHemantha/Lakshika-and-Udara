import { StrictMode, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { guestFromLocation } from './lib/guest';
import './index.css';

const AdminPage = lazy(() => import('./pages/AdminPage'));

const isAdmin = /^\/admin\/?$/i.test(window.location.pathname);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isAdmin ? (
      <Suspense fallback={null}>
        <AdminPage />
      </Suspense>
    ) : (
      <App guestName={guestFromLocation()} />
    )}
  </StrictMode>,
);
