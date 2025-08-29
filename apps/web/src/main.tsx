import { createRoot } from 'react-dom/client';
import './style.css';
import { RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/theme-provider';
import { createRouter } from './router';

const router = createRouter();

const App = () => (
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Toaster />
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>
);

const rootElement = document.getElementById('app');
if (rootElement) {
  createRoot(rootElement).render(<App />);
} else {
  // biome-ignore lint/suspicious/noConsole: ignore
  console.error("Root element with id 'app' not found in the DOM.");
}
