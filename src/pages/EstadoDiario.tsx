import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import Tooltip from '../components/Tooltip';
import { pjudDaily, TODAY, daysFromToday } from '../data/mock';

function dayLabel(day: string): string {
  if (day === TODAY) return 'Hoy';
  if (day === daysFromToday(-1)) return 'Ayer';
  return day.split('-').reverse().join('/');
}

const tipoClass = (tipo: string) => {
  const t = tipo.toLowerCase();
  if (t.includes('notific') || t.includes('registro')) return 'green';
  if (t.includes('resol') || t.includes('apremio')) return 'red';
  return '';
};

type SortKey = 'day' | 'rol' | 'tribunal' | 'tipo';

export default function EstadoDiario() {
  const navigate = useNavigate();
  const [day, setDay] = useState<string>(TODAY);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState<{ key: SortKey; dir: 'asc' | 'desc' }>({ key: 'day', dir: 'desc' });

  const days = useMemo(() => Array.from(new Set(pjudDaily.map((m) => m.day))).sort().reverse(), []);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = pjudDaily.filter((m) => {
      if (day !== 'all' && m.day !== day) return false;
      if (!q) return true;
      return m.rol.toLowerCase().includes(q)
        || m.tribunal.toLowerCase().includes(q)
        || m.movimiento.toLowerCase().includes(q)
        || m.tipo.toLowerCase().includes(q);
    });
    const dir = sort.dir === 'asc' ? 1 : -1;
    return [...filtered].sort((a, b) => a[sort.key].localeCompare(b[sort.key], 'es') * dir);
  }, [day, query, sort]);

  function toggleSort(key: SortKey) {
    setSort((s) => (s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: key === 'day' ? 'desc' : 'asc' }));
  }

  const Th = ({ k, label }: { k: SortKey; label: string }) => {
    const active = sort.key === k;
    return (
      <button className={`pjud-th${active ? ' sorted' : ''}`} onClick={() => toggleSort(k)} aria-label={`Ordenar por ${label}`}>
        {label}
        <Icon name={active && sort.dir === 'asc' ? 'chevronRight' : 'chevronRight'} className="sort-ic" style={{ transform: active && sort.dir === 'asc' ? 'rotate(-90deg)' : 'rotate(90deg)' }} />
      </button>
    );
  };

  return (
    <>
      <div className="head">
        <div className="brand-row"><span className="dot"><Icon name="table" /></span>Vista de respaldo · trigger check</div>
        <h1>Estado diario del PJUD</h1>
        <div className="sub">Réplica de lo que muestra el PJUD, día por día. El feed del agente ya prioriza esto en el Inicio; aquí lo cruzas en crudo.</div>
      </div>

      <div className="ops-toolbar">
        <select className="filter-select" value={day} onChange={(e) => setDay(e.target.value)}>
          {days.map((d) => (
            <option key={d} value={d}>{dayLabel(d)} · {pjudDaily.filter((m) => m.day === d).length}</option>
          ))}
          <option value="all">Todos los días · {pjudDaily.length}</option>
        </select>
        <div className="search-box">
          <Icon name="search" />
          <input
            placeholder="Buscar por rol, tribunal o movimiento…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="section" style={{ paddingTop: 8 }}>
        <div className="pjud-table">
          <div className="pjud-row pjud-head">
            <Th k="day" label="Día" />
            <Th k="rol" label="Rol" />
            <span>Movimiento (leído del documento)</span>
            <Th k="tribunal" label="Tribunal" />
            <Th k="tipo" label="Tipo" />
            <span />
          </div>
          {rows.length === 0 && (
            <div className="empty" style={{ padding: '40px 0' }}>
              <Icon name="search" />
              <div>No hay movimientos que calcen con el filtro.</div>
            </div>
          )}
          {rows.map((m) => (
            <div className="pjud-row" key={m.id}>
              <span className="pjud-day">{dayLabel(m.day)}</span>
              <span className="pjud-rol">{m.rol}</span>
              <span className="pjud-mov">{m.movimiento}</span>
              <span className="pjud-trib">{m.tribunal}</span>
              <span><span className={`op-stage ${tipoClass(m.tipo)}`}>{m.tipo}</span></span>
              <span className="pjud-go">
                {m.causaId
                  ? (
                    <Tooltip label="Abrir causa">
                      <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/causas/${m.causaId}`)} aria-label="Abrir causa"><Icon name="search" size={15} /></button>
                    </Tooltip>
                  )
                  : <span className="pjud-nocausa" title="Sin causa en la cartera">—</span>}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
