import { createContext, useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Icon, { type IconName } from './Icon';
import { useAppStore } from '../store/useAppStore';

interface SidebarCtx {
  open: boolean;
  setOpen: (v: boolean) => void;
  animate: boolean;
}

const SidebarContext = createContext<SidebarCtx | undefined>(undefined);

function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error('useSidebar must be used within SidebarProvider');
  return ctx;
}

interface RailLink {
  to: string;
  icon: IconName;
  label: string;
  badge?: number;
}

const COLLAPSED = 76;
const EXPANDED = 248;

export default function Rail() {
  const [open, setOpen] = useState(false);
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
    <SidebarContext.Provider value={{ open, setOpen, animate: true }}>
      <DesktopSidebar links={links} />
      <MobileSidebar links={links} />
    </SidebarContext.Provider>
  );
}

function Logo({ open }: { open: boolean }) {
  return (
    <NavLink to="/bienvenida" className="sb-logo" title="Bienvenida">
      <span className="sb-logo-mark">P</span>
      <motion.span
        className="sb-logo-text"
        animate={{ opacity: open ? 1 : 0, width: open ? 'auto' : 0 }}
        transition={{ duration: 0.2 }}
      >
        ProdBooster
      </motion.span>
    </NavLink>
  );
}

function SidebarLink({ link, open }: { link: RailLink; open: boolean }) {
  return (
    <NavLink
      to={link.to}
      end={link.to === '/'}
      className={({ isActive }) => `sb-link${isActive ? ' active' : ''}`}
      title={!open ? link.label : undefined}
    >
      <span className="sb-link-ic">
        <Icon name={link.icon} size={20} />
        {!!link.badge && !open && <span className="sb-badge">{link.badge}</span>}
      </span>
      <motion.span
        className="sb-link-label"
        animate={{
          opacity: open ? 1 : 0,
          display: open ? 'inline-block' : 'none',
        }}
        transition={{ duration: 0.15 }}
      >
        {link.label}
      </motion.span>
      {!!link.badge && open && (
        <motion.span
          className="sb-badge-inline"
          animate={{ opacity: open ? 1 : 0 }}
        >
          {link.badge}
        </motion.span>
      )}
    </NavLink>
  );
}

function NavBody({ links, open }: { links: RailLink[]; open: boolean }) {
  return (
    <>
      <div className="sb-top">
        <Logo open={open} />
        <button className="sb-link sb-search" onClick={() => window.dispatchEvent(new Event('cmdk:open'))} title="Buscar (⌘K)">
          <span className="sb-link-ic"><Icon name="search" /></span>
          <motion.span
            className="sb-link-label"
            animate={{ opacity: open ? 1 : 0, width: open ? 'auto' : 0 }}
            transition={{ duration: 0.2 }}
          >
            Buscar
          </motion.span>
          {open && <kbd className="sb-kbd">⌘K</kbd>}
        </button>
        <div className="sb-links">
          {links.map((l) => (
            <SidebarLink key={l.to} link={l} open={open} />
          ))}
        </div>
      </div>
      <div className="sb-footer">
        <div className="sb-avatar" title="Cristóbal Ovando">
          <span className="sb-avatar-mark">CO</span>
          <motion.span
            className="sb-avatar-meta"
            animate={{ opacity: open ? 1 : 0, width: open ? 'auto' : 0 }}
            transition={{ duration: 0.2 }}
          >
            <span className="sb-avatar-name">Cristóbal Ovando</span>
            <span className="sb-avatar-role">Estudio Cid &amp; Asociados</span>
          </motion.span>
        </div>
      </div>
    </>
  );
}

function DesktopSidebar({ links }: { links: RailLink[] }) {
  const { open, setOpen, animate } = useSidebar();
  return (
    <motion.nav
      className="sb-desktop"
      animate={{ width: animate ? (open ? EXPANDED : COLLAPSED) : EXPANDED }}
      transition={{ duration: 0.28, ease: [0.2, 0.65, 0.3, 0.9] }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <NavBody links={links} open={open} />
    </motion.nav>
  );
}

function MobileSidebar({ links }: { links: RailLink[] }) {
  const { open, setOpen } = useSidebar();
  return (
    <div className="sb-mobile">
      <div className="sb-mobile-bar">
        <NavLink to="/bienvenida" className="sb-logo-mark" title="Bienvenida">P</NavLink>
        <button
          type="button"
          className="sb-mobile-toggle"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setOpen(!open)}
        >
          <Icon name={open ? 'x' : 'menu'} size={22} />
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            className="sb-mobile-overlay"
            initial={{ y: '-100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
          >
            <div className="sb-mobile-head">
              <span className="sb-logo-text" style={{ opacity: 1, width: 'auto' }}>ProdBooster</span>
              <button type="button" className="sb-mobile-toggle" aria-label="Cerrar" onClick={() => setOpen(false)}>
                <Icon name="x" size={22} />
              </button>
            </div>
            <div className="sb-mobile-body" onClick={() => setOpen(false)}>
              <NavBody links={links} open />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
