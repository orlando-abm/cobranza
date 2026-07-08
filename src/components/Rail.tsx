import { NavLink } from 'react-router-dom';
import Icon, { type IconName } from './Icon';
import { useAppStore } from '../store/useAppStore';

interface RailLink {
  to: string;
  icon: IconName;
  label: string;
  badge?: number;
}

export default function Rail() {
  const pendingRevisiones = useAppStore((s) => s.pendingRevisiones());

  const links: RailLink[] = [
    { to: '/', icon: 'home', label: 'Inicio' },
    { to: '/demandas', icon: 'file', label: 'Demandas' },
    { to: '/causas', icon: 'grid', label: 'Causas' },
    { to: '/revisiones', icon: 'clipboard', label: 'Revisiones', badge: pendingRevisiones },
    { to: '/informes', icon: 'chart', label: 'Informes' },
    { to: '/config', icon: 'settings', label: 'Config' },
    { to: '/backlog', icon: 'checkSquare', label: 'Backlog' },
  ];

  return (
    <nav className="rail">
      <NavLink to="/bienvenida" className="rail-logo" title="Bienvenida">P</NavLink>
      {links.map((l) => (
        <NavLink
          key={l.to}
          to={l.to}
          end={l.to === '/'}
          className={({ isActive }) => `rail-item${isActive ? ' active' : ''}`}
        >
          {!!l.badge && <span className="rail-badge">{l.badge}</span>}
          <Icon name={l.icon} />
          <span>{l.label}</span>
        </NavLink>
      ))}
      <div className="rail-spacer" />
      <div className="rail-avatar" title="Cristóbal Ovando">CO</div>
    </nav>
  );
}
