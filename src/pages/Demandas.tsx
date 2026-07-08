import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon, { type IconName } from '../components/Icon';
import { useAppStore } from '../store/useAppStore';
import { ingestBatch } from '../data/mock';
import type { Demanda, DemandaStatus, IngestStep } from '../types';

const filters: { id: DemandaStatus | 'all'; label: string }[] = [
  { id: 'all', label: 'Todas' },
  { id: 'redactada', label: 'Redactadas' },
  { id: 'lista', label: 'Listas' },
  { id: 'subida', label: 'Subidas' },
  { id: 'suspendida', label: 'Suspendidas' },
];

const statusMeta: Record<DemandaStatus, { label: string; cls: string }> = {
  redactada: { label: 'Redactada', cls: 'neutral' },
  lista: { label: 'Lista para presentar', cls: 'ready' },
  subida: { label: 'Subida · causa activa', cls: 'wait' },
  suspendida: { label: 'Suspendida', cls: 'blocked' },
};

const stepMeta: Record<IngestStep['status'], { label: string; cls: string; icon: IconName; spin?: boolean }> = {
  leyendo: { label: 'Leyendo…', cls: 'neutral', icon: 'spinner', spin: true },
  validada: { label: 'Validada', cls: 'ready', icon: 'check' },
  revision: { label: 'A revisión', cls: 'wait', icon: 'alert' },
  error: { label: 'Incompleta', cls: 'blocked', icon: 'alert' },
};

const montos = ['$6.410.000', '$9.280.000', '$4.150.000', '$12.700.000', '$7.020.000', '$5.660.000', '$8.340.000', '$10.110.000'];

export default function Demandas() {
  const navigate = useNavigate();
  const demandas = useAppStore((s) => s.demandas);
  const markDemandaReady = useAppStore((s) => s.markDemandaReady);
  const addDemandas = useAppStore((s) => s.addDemandas);
  const pushToast = useAppStore((s) => s.pushToast);

  const [filter, setFilter] = useState<DemandaStatus | 'all'>('all');
  const [query, setQuery] = useState('');
  const [drag, setDrag] = useState(false);

  // FB-08 · estado de la ingesta en vivo
  const [ingesting, setIngesting] = useState(false);
  const [done, setDone] = useState(false);
  const [steps, setSteps] = useState<IngestStep[]>([]);
  const timers = useRef<number[]>([]);
  useEffect(() => () => { timers.current.forEach((t) => clearTimeout(t)); }, []);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: demandas.length, redactada: 0, lista: 0, subida: 0, suspendida: 0 };
    demandas.forEach((d) => { c[d.status]++; });
    return c;
  }, [demandas]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return demandas.filter((d) => {
      const matchFilter = filter === 'all' || d.status === filter;
      const matchQuery = !q
        || d.credito.toLowerCase().includes(q)
        || d.parties.toLowerCase().includes(q)
        || d.rut.toLowerCase().includes(q);
      return matchFilter && matchQuery;
    });
  }, [demandas, filter, query]);

  const revisionCount = ingestBatch.filter((s) => s.status === 'revision').length;
  const validadaCount = ingestBatch.filter((s) => s.status === 'validada').length;
  const resolved = steps.filter((s) => s.status !== 'leyendo').length;

  function loadLote() {
    if (ingesting) return;
    setIngesting(true);
    setDone(false);
    setSteps([]);
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
    pushToast('info', 'Descomprimiendo ZIP y clasificando documentos…');

    const stepMs = 520;
    ingestBatch.forEach((raw, i) => {
      timers.current.push(window.setTimeout(() => {
        setSteps((s) => [...s, { ...raw, status: 'leyendo' }]);
      }, i * stepMs));
      timers.current.push(window.setTimeout(() => {
        setSteps((s) => s.map((x) => (x.id === raw.id ? { ...x, status: raw.status } : x)));
      }, i * stepMs + stepMs - 150));
    });

    timers.current.push(window.setTimeout(() => {
      const nuevas: Demanda[] = ingestBatch
        .filter((s) => s.status === 'validada')
        .map((s, i) => {
          const [credito, parties] = s.doc.split(' · ');
          const financiera = parties.includes('OLX') ? 'OLX' : parties.includes('PROFIN') ? 'PROFIN' : 'Tanner';
          return {
            id: `ing-${credito}`, credito, parties, financiera,
            rut: '—', monto: montos[i % montos.length],
            status: 'redactada' as const, template: 'GLOBAL 1 SIN EXHORTO',
          };
        });
      addDemandas(nuevas);
      setDone(true);
      pushToast('ok', `Lote procesado: ${validadaCount} demandas redactadas · ${revisionCount} en revisión`);
    }, ingestBatch.length * stepMs + 250));
  }

  function closeLote(goRevisiones: boolean) {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
    setIngesting(false);
    setDone(false);
    setSteps([]);
    if (goRevisiones) navigate('/revisiones');
  }

  function markReady(d: Demanda) {
    const updated = markDemandaReady(d.id);
    if (updated?.recurrent) {
      pushToast('info', `Crédito recurrente — ${d.credito} ya existió el mes pasado. Podés reusar la demanda previa cambiando solo el monto.`);
    } else {
      pushToast('ok', `${d.credito} marcada como lista para presentar por PJUD.`);
    }
  }

  return (
    <>
      <div className="head">
        <div className="brand-row">
          <span className="dot"><Icon name="file" /></span>
          Estudio Cid &amp; Asociados
        </div>
        <h1>Redacción de demandas</h1>
        <div className="sub">La demanda vive acá antes de existir la causa. La causa nace recién cuando la subís al PJUD.</div>
      </div>

      {/* FB-01 · ingesta de lote como acción principal de esta sección */}
      {!ingesting && (
        <div
          className={`ingest-drop${drag ? ' drag' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); loadLote(); }}
        >
          <div className="ingest-drop-ic"><Icon name="upload" size={20} /></div>
          <div className="ingest-drop-body">
            <div className="t">Arrastrá un ZIP del lote acá</div>
            <div className="s">Identifico la financiera, clasifico pagaré/CAV/tabla y armo las demandas — con feedback en vivo.</div>
          </div>
          <button className="btn btn-dark" onClick={loadLote}>Seleccionar archivo</button>
        </div>
      )}

      {/* FB-08 · feedback en vivo durante la carga */}
      {ingesting && (
        <div className="card">
          <div className="card-head">
            <span className="ic"><Icon name={done ? 'checkSquare' : 'spinner'} className={done ? '' : 'spin'} /></span>
            <h3>{done ? 'Lote procesado' : 'Procesando lote…'}</h3>
            <span className="count">{resolved} de {ingestBatch.length}</span>
          </div>
          <div className="ingest-progress"><i style={{ width: `${(resolved / ingestBatch.length) * 100}%` }} /></div>
          <div style={{ marginTop: 14 }}>
            {steps.map((s) => {
              const m = stepMeta[s.status];
              return (
                <div className="queue-row" key={s.id}>
                  <span className={`ingest-dot ${s.status}`}><Icon name={m.icon} size={15} className={m.spin ? 'spin' : ''} /></span>
                  <div className="qbody">
                    <div className="qt">{s.doc}</div>
                    <div className="qs">{s.status === 'leyendo' ? 'Leyendo documentos y validando…' : s.detail}</div>
                  </div>
                  <div className="qactions"><span className={`status-tag ${m.cls}`}>{m.label}</span></div>
                </div>
              );
            })}
          </div>
          {done && (
            <div className="ingest-summary">
              <div className="note" style={{ margin: 0 }}>
                <Icon name="info" />
                <span><b>{validadaCount} demandas redactadas</b> quedaron en el listado como borradores. <b>{revisionCount} operaciones</b> pasaron a revisión manual (OCR bajo umbral o documentación incompleta).</span>
              </div>
              <div className="ingest-summary-actions">
                <button className="btn btn-ghost" onClick={() => closeLote(false)}>Cerrar y ver demandas</button>
                <button className="btn btn-primary" onClick={() => closeLote(true)}><Icon name="clipboard" />Ver las {revisionCount} en revisión</button>
              </div>
            </div>
          )}
        </div>
      )}

      {!ingesting && (
        <>
          <div className="ops-toolbar" style={{ marginTop: 22 }}>
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
                <div>No hay demandas que calcen con el filtro o la búsqueda.</div>
              </div>
            )}
            {rows.map((d) => {
              const m = statusMeta[d.status];
              return (
                <div className="op-row demanda-row" key={d.id}>
                  <span className="op-credito">{d.credito}</span>
                  <div className="op-parties">
                    <div className="n">{d.parties}{d.recurrent && <span className="recurrent-flag"><Icon name="clock" size={12} />Recurrente</span>}</div>
                    <div className="f">{d.financiera} · RUT {d.rut} · {d.template}</div>
                  </div>
                  <span className="demanda-monto">{d.monto}</span>
                  <span className={`status-tag ${m.cls}`}>{m.label}</span>
                  <div className="demanda-action">
                    {d.status === 'redactada' && (
                      <button className="btn btn-primary btn-sm" onClick={() => markReady(d)}><Icon name="check" />Marcar como lista</button>
                    )}
                    {d.status === 'lista' && (
                      <span className="ready-hint">Subís por PJUD (v1)</span>
                    )}
                    {d.status === 'subida' && d.causaId && (
                      <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/causas/${d.causaId}`)}>Abrir causa<Icon name="chevronRight" /></button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}
