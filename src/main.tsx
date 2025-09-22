import { StrictMode } from 'react';
import { StoreProvider } from '@/store';
import { createRoot } from 'react-dom/client';
import { Toaster } from './components/ui/sonner.tsx';
import ReactQueryProvider from '@/requests/query.tanstack';
import App from './app.tsx';
import './global.css';
import ModalBank from './components/modals/ModalBank.tsx';
import { ThemeProvider } from '@/context/themeContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreProvider>
      <ReactQueryProvider>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <Toaster />
          <App />
          <ModalBank />
        </ThemeProvider>
      </ReactQueryProvider>
    </StoreProvider>
  </StrictMode>
);
