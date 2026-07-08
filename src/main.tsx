import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import './index.css';
import App from './App';
import Home from './pages/Home';
import Welcome from './pages/Welcome';
import Demandas from './pages/Demandas';
import EstadoDiario from './pages/EstadoDiario';
import Causas from './pages/Causas';
import Causa from './pages/Causa';
import Backlog from './pages/Backlog';
import Revisiones from './pages/Revisiones';
import Config from './pages/Config';
import Informes from './pages/Informes';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'bienvenida', element: <Welcome /> },
      { path: 'demandas', element: <Demandas /> },
      { path: 'estado-diario', element: <EstadoDiario /> },
      { path: 'causas', element: <Causas /> },
      { path: 'causas/:id', element: <Causa /> },
      { path: 'revisiones', element: <Revisiones /> },
      { path: 'informes', element: <Informes /> },
      { path: 'config', element: <Config /> },
      { path: 'backlog', element: <Backlog /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
