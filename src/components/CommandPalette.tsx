import { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import Icon, { type IconName } from './Icon';

const nav: { to: string; label: string; icon: IconName }[] = [
  { to: '/', label: 'Inicio', icon: 'home' },
  { to: '/demandas', label: 'Demandas', icon: 'file' },
  { to: '/causas', label: 'Causas', icon: 'grid' },
  { to: '/revisiones', label: 'Revisiones', icon: 'clipboard' },
  { to: '/estado-diario', label: 'Estado diario PJUD', icon: 'table' },
  { to: '/informes', label: 'Informes', icon: 'chart' },
  { to: '/config', label: 'Configuración', icon: 'settings' },
  { to: '/backlog', label: 'Backlog', icon: 'checkSquare' },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const causas = useAppStore((s) => s.causas);
  const demandas = useAppStore((s) => s.demandas);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    const onOpen = () => setOpen(true);
    document.addEventListener('keydown', onKey);
    window.addEventListener('cmdk:open', onOpen);
    return () => {
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('cmdk:open', onOpen);
    };
  }, []);

  function go(to: string) {
    setOpen(false);
    navigate(to);
  }

  if (!open) return null;

  const listCausas = causas.filter((c) => c.managementStatus !== 'deleted');

  return (
    <div className="cmdk-overlay" onClick={() => setOpen(false)}>
      <Command className="cmdk" label="Buscar en ProdBooster" onClick={(e) => e.stopPropagation()}>
        <div className="cmdk-inputwrap">
          <Icon name="search" />
          <Command.Input autoFocus placeholder="Buscar causas, demandas o ir a una sección…" />
          <kbd className="cmdk-kbd">esc</kbd>
        </div>
        <Command.List>
          <Command.Empty className="cmdk-empty">Sin resultados.</Command.Empty>

          <Command.Group heading="Ir a">
            {nav.map((n) => (
              <Command.Item key={n.to} value={`ir ${n.label}`} onSelect={() => go(n.to)}>
                <Icon name={n.icon} size={16} />
                <span>{n.label}</span>
              </Command.Item>
            ))}
          </Command.Group>

          <Command.Group heading="Causas">
            {listCausas.map((c) => (
              <Command.Item
                key={c.id}
                value={`causa ${c.credito} ${c.parties} ${c.rut} ${c.patente ?? ''}`}
                onSelect={() => go(`/causas/${c.id}`)}
              >
                <Icon name="grid" size={16} />
                <span className="cmdk-mono">{c.credito}</span>
                <span className="cmdk-sub">{c.parties}</span>
              </Command.Item>
            ))}
          </Command.Group>

          <Command.Group heading="Demandas">
            {demandas.map((d) => (
              <Command.Item
                key={d.id}
                value={`demanda ${d.credito} ${d.parties} ${d.rut}`}
                onSelect={() => go('/demandas')}
              >
                <Icon name="file" size={16} />
                <span className="cmdk-mono">{d.credito}</span>
                <span className="cmdk-sub">{d.parties}</span>
              </Command.Item>
            ))}
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  );
}
