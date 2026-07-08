import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import Icon from './Icon';
import { useAppStore } from '../store/useAppStore';
import type { BatchMetric } from '../types';

const verbs: Record<BatchMetric['flow'], { running: string; done: string; doneShort: string; cta: string }> = {
  embargos: { running: 'Escribiendo al receptor', done: 'Embargos encargados', doneShort: 'Encargado', cta: 'Encargar los embargos listos' },
  registro: { running: 'Consultando Registro Civil', done: 'Consultas realizadas', doneShort: 'Consultado', cta: 'Consultar inscripción en lote' },
};

export default function BatchFlowModal({ metric, onClose }: { metric: BatchMetric; onClose: () => void }) {
  const navigate = useNavigate();
  const pushToast = useAppStore((s) => s.pushToast);
  const advanceMilestone = useAppStore((s) => s.advanceMilestone);

  function openCausa(id: string) {
    onClose();
    navigate(`/causas/${id}`);
  }
  const [running, setRunning] = useState(false);
  const [doneCount, setDoneCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const timers = useRef<number[]>([]);
  const v = verbs[metric.flow];
  const isRegistro = metric.flow === 'registro';

  const ready = useMemo(() => metric.items.filter((i) => !i.blocked), [metric.items]);
  const blocked = useMemo(() => metric.items.filter((i) => i.blocked), [metric.items]);
  const okCount = useMemo(() => ready.filter((i) => i.outcome === 'ok').length, [ready]);
  const retryCount = useMemo(() => ready.filter((i) => i.outcome === 'retry').length, [ready]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function finishToast() {
    if (isRegistro) {
      pushToast('ok', `${okCount} inscritas · ${retryCount} quedan en recordatorio a 5 días`);
      ready.forEach((i) => { if (i.outcome === 'ok' && i.causaId) advanceMilestone(i.causaId, 'Inscripción Registro Civil'); });
      return;
    }
    pushToast('ok',
      blocked.length
        ? `${v.done}: ${ready.length} · ${blocked.length} quedaron para revisión previa`
        : `${v.done}: ${ready.length} ítems del lote procesados`,
    );
  }

  function run() {
    if (!ready.length) return;
    setRunning(true);
    ready.forEach((_, i) => {
      const id = window.setTimeout(() => {
        setDoneCount(i + 1);
        if (i === ready.length - 1) {
          setFinished(true);
          finishToast();
        }
      }, 450 * (i + 1));
      timers.current.push(id);
    });
  }

  function resultLabel(outcome?: 'ok' | 'retry') {
    if (!isRegistro) return { text: v.doneShort, color: 'var(--green)' };
    if (outcome === 'retry') return { text: 'Aún no · recordar en 5 días', color: 'var(--amber)' };
    return { text: 'Inscrita', color: 'var(--green)' };
  }

  return (
    <Modal title={metric.title} icon="bolt" onClose={onClose}
      footer={
        finished ? (
          <button className="btn btn-primary" onClick={onClose}><Icon name="check" />Listo</button>
        ) : (
          <>
            <button className="btn btn-ghost" onClick={onClose} disabled={running}>Cancelar</button>
            <button className="btn btn-primary" onClick={run} disabled={running || !ready.length}>
              {running ? <><Icon name="spinner" className="spin" />{v.running}…</> : <><Icon name="bolt" />{v.cta} ({ready.length})</>}
            </button>
          </>
        )
      }
    >
      <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 16 }}>{metric.sub}</p>

      {finished && isRegistro && (
        <div className="note" style={{ margin: '0 0 16px' }}>
          <Icon name="check" />
          <span><b>{okCount} inscritas</b> avanzan a facturación. <b>{retryCount}</b> aún no salieron — programé un recordatorio automático en 5 días.</span>
        </div>
      )}

      {!!ready.length && (
        <div style={{ marginBottom: blocked.length ? 18 : 0 }}>
          <div className="tg-label" style={{ marginBottom: 8 }}>
            {isRegistro ? `En plazo de consulta · ${ready.length}` : `Listos · ${ready.length}`}
          </div>
          {ready.map((item, i) => {
            const done = i < doneCount;
            const active = running && i === doneCount && !finished;
            const res = resultLabel(item.outcome);
            return (
              <div key={item.label} className="batch-item">
                <span className={`batch-check${done ? ' done' : active ? ' run' : ''}`}
                  style={done && isRegistro && item.outcome === 'retry' ? { background: 'var(--amber-soft)', color: 'var(--amber)', borderColor: 'transparent' } : undefined}>
                  {done ? (isRegistro && item.outcome === 'retry' ? <Icon name="clock" /> : <Icon name="check" />) : active ? <Icon name="spinner" className="spin" /> : i + 1}
                </span>
                <span style={{ flex: 1, color: done ? 'var(--indigo)' : 'var(--muted)' }}>{item.label}</span>
                {done && <span style={{ fontSize: 12, fontWeight: 600, color: res.color }}>{res.text}</span>}
                {!done && item.causaId && (
                  <button className="btn btn-ghost btn-sm" onClick={() => openCausa(item.causaId!)}><Icon name="eye" />Abrir</button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {!!blocked.length && (
        <div>
          <div className="tg-label" style={{ marginBottom: 8, color: 'var(--amber)' }}>Requieren revisión previa · {blocked.length}</div>
          {blocked.map((item) => (
            <div key={item.label} className="batch-item" style={{ alignItems: 'flex-start' }}>
              <span className="batch-check" style={{ background: 'var(--amber-soft)', color: 'var(--amber)', borderColor: 'transparent' }}>
                <Icon name="alert" />
              </span>
              <span style={{ flex: 1 }}>
                <span style={{ display: 'block', color: 'var(--indigo)' }}>{item.label}</span>
                <span style={{ display: 'block', fontSize: 12, color: 'var(--amber)', marginTop: 2 }}>{item.blocked}</span>
              </span>
              {item.causaId && (
                <button className="btn btn-ghost btn-sm" onClick={() => openCausa(item.causaId!)}><Icon name="eye" />Revisar</button>
              )}
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}
