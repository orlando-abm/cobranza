import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import { useAppStore } from '../store/useAppStore';

const filters = [
  { id: 'all', label: 'Todas' },
  { id: 'Demanda', label: 'Demanda' },
  { id: 'Notificación', label: 'Notificación' },
  { id: 'Embargo', label: 'Embargo' },
  { id: 'excepciones', label: 'Con excepciones' },
];

type Mgmt = 'active' | 'suspended' | 'all';
const mgmtFilters: { id: Mgmt; label: string }[] = [
  { id: 'active', label: 'Activas' },
  { id: 'suspended', label: 'Suspendidas' },
  { id: 'all', label: 'Todas' },
];

const stageClass = (stage: string) =>
  stage === 'Embargo' ? 'green' : stage === 'Rechazo' ? 'red' : '';

export default function Causas() {
  const navigate = useNavigate();
  const causas = useAppStore((s) => s.causas);
  const [filter, setFilter] = useState('all');
  const [mgmt, setMgmt] = useState<Mgmt>('active');
  const [query, setQuery] = useState('');

  // Las eliminadas nunca se muestran; el filtro de gestión opera sobre el resto.
  const base = useMemo(() => causas.filter((c) => c.managementStatus !== 'deleted'), [causas]);

  const mgmtCounts = useMemo(() => ({
    active: base.filter((c) => c.managementStatus !== 'suspended').length,
    suspended: base.filter((c) => c.managementStatus === 'suspended').length,
    all: base.length,
  }), [base]);

  const mgmtFiltered = useMemo(() => base.filter((c) => {
    if (mgmt === 'active') return c.managementStatus !== 'suspended';
    if (mgmt === 'suspended') return c.managementStatus === 'suspended';
    return true;
  }), [base, mgmt]);

  const counts = useMemo(() => {
    const c: Record<string, number> = {
      all: mgmtFiltered.length,
      Demanda: 0, Notificación: 0, Embargo: 0, excepciones: 0,
    };
    mgmtFiltered.forEach((x) => {
      if (x.stage in c) c[x.stage]++;
      if (x.clock.label.toLowerCase().includes('excepciones')) c.excepciones++;
    });
    return c;
  }, [mgmtFiltered]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return mgmtFiltered.filter((c) => {
      const matchFilter =
        filter === 'all'
          ? true
          : filter === 'excepciones'
          ? c.clock.label.toLowerCase().includes('excepciones')
          : c.stage === filter;
      const matchQuery =
        !q ||
        c.credito.toLowerCase().includes(q) ||
        c.parties.toLowerCase().includes(q) ||
        c.rut.toLowerCase().includes(q) ||
        (c.patente?.toLowerCase().includes(q) ?? false);
      return matchFilter && matchQuery;
    });
  }, [mgmtFiltered, filter, query]);

  return (
    <>
      <div className="head">
        <div className="brand-row">
          <span className="dot"><Icon name="grid" /></span>
          Estudio Cid &amp; Asociados
        </div>
        <h1>Causas</h1>
        <div className="sub">Cada causa es un número de operación con su crédito. Entrá para trabajar con el procurador.</div>
      </div>

      <div className="ops-toolbar">
        {mgmtFilters.map((f) => (
          <button
            key={f.id}
            className={`filter-pill${mgmt === f.id ? ' active' : ''}`}
            onClick={() => setMgmt(f.id)}
          >
            {f.label} · {mgmtCounts[f.id]}
          </button>
        ))}
      </div>

      <div className="ops-toolbar">
        {filters.map((f) => (
          <button
            key={f.id}
            className={`filter-pill${filter === f.id ? ' active' : ''}`}
            onClick={() => setFilter(f.id)}
          >
            {f.label} · {counts[f.id] ?? 0}
          </button>
        ))}
        <div className="search-box">
          <Icon name="search" />
          <input
            placeholder="Buscar por crédito, RUT o nombre…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="ops-table">
        {rows.length === 0 && (
          <div className="empty">
            <Icon name="search" />
            <div>No hay causas que calcen con el filtro o la búsqueda.</div>
          </div>
        )}
        {rows.map((c) => {
          const suspended = c.managementStatus === 'suspended';
          return (
            <button key={c.id} className={`op-row${suspended ? ' suspended' : ''}`} onClick={() => navigate(`/causas/${c.id}`)}>
              <span className="op-credito">{c.credito}</span>
              <div className="op-parties">
                <div className="n">{c.parties}</div>
                <div className="f">{c.detail}</div>
              </div>
              {suspended
                ? <span className="op-stage suspended-tag"><Icon name="pause" />Suspendida</span>
                : <span className={`op-stage ${stageClass(c.stage)}`}>{c.stage}</span>}
              <span className={`op-clock ${suspended ? 'calm' : c.clock.tone}`}>
                <Icon name={suspended ? 'pause' : c.clock.icon} />{suspended ? 'En pausa' : c.clock.label}
              </span>
              <span className="op-chev"><Icon name="chevronRight" /></span>
            </button>
          );
        })}
      </div>
    </>
  );
}
