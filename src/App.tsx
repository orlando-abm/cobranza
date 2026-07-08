import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Rail from './components/Rail';
import Toasts from './components/Toasts';

export default function App() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return (
    <div className="app">
      <Rail />
      <div className="main">
        <div className="screen">
          <Outlet />
        </div>
      </div>
      <Toasts />
    </div>
  );
}
