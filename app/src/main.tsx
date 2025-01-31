import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { router } from './router';
import './styles/index.css';

createRoot(document.getElementById('root')!).render(
  <>
    <RouterProvider router={router} />
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          fontSize: '1rem', // Tamanho reduzido para telas pequenas
          fontWeight: 'bold',
          padding: '1.5rem', // Padding menor para telas pequenas
        },
        // Ajusta o tamanho para telas maiores
        className: 'sm:text-lg sm:p-6',
      }}
    />
  </>
);
