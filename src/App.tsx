import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Rail from './components/Rail';
import Toasts from './components/Toasts';
import CommandPalette from './components/CommandPalette';
import { TooltipProvider } from './components/Tooltip';

export default function App() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return (
    <TooltipProvider delayDuration={250} skipDelayDuration={400}>
      <div className="app">
        <Rail />
        <div className="main">
          <div className="screen">
            <Outlet />
          </div>
        </div>
        <Toasts />
        <CommandPalette />
      </div>
    </TooltipProvider>
  );
}
