import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { router } from './router'
import './styles/index.css'

createRoot(document.getElementById('root')!).render(
  <>
    <RouterProvider router={router} />
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          fontSize: '1.5rem', // Aumenta o tamanho do texto
          fontWeight: 'bold', // Deixa o texto em negrito
          padding: '2.5rem', // Aumenta o espaço dentro do toast
        },
      }}
    />
  </>
);