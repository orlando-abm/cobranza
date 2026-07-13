import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon, { type IconName } from '../components/Icon';
import Modal from '../components/Modal';
import EscritoEditor from '../components/EscritoEditor';
import AgentPlan, { advancePlan, completePlan } from '../components/AgentPlan';
import { useAppStore } from '../store/useAppStore';
import { ingestBatch } from '../data/mock';
import { ingestPlan, toPendingPlan } from '../data/flows';
import { escritos } from '../data/escritos';
import type { AgentPlanStep, Demanda, DemandaStatus, IngestStep, RevisarReason } from '../types';

const reasonMeta: Record<RevisarReason, { label: string; detail: string }> = {
  incompleta: { label: 'Documentación incompleta', detail: 'Falta uno de los 4 documentos mandatorios (pagaré, CAV inicial, tabla de desarrollo, mandato). Adjunta el faltante o corrige antes de ingresar la causa.' },
  transferido: { label: 'Vehículo transferido', detail: 'El propietario del CAV no coincide con el deudor/aval — decisión humana antes de embargar un bien ajeno.' },
  ocr: { label: 'OCR bajo umbral', detail: 'Un campo se leyó con baja confianza. Verifica RUT, nombres y monto contra el PDF origen.' },
};

const stepMeta: Record<IngestStep['status'], { label: string; cls: string; icon: IconName; spin?: boolean }> = {
  leyendo: { label: 'Creando…', cls: 'neutral', icon: 'spinner', spin: true },
  validada: { label: 'Redactada', cls: 'ready', icon: 'check' },
  revision: { label: 'Por revisar', cls: 'wait', icon: 'alert' },
  error: { label: 'Por revisar', cls: 'blocked', icon: 'alert' },
};

const montos = ['$6.410.000', '$9.280.000', '$4.150.000', '$12.700.000', '$7.020.000', '$5.660.000', '$8.340.000', '$10.110.000'];
const ruts = ['14.552.331-9', '9.884.201-K', '17.203.556-4', '12.907.118-2', '20.114.882-7', '16.640.903-1', '13.305.771-8', '18.812.334-0'];

export default function Demandas() {
  const navigate = useNavigate();
  const demandas = useAppStore((s) => s.demandas);
  const markDemandaCorrected = useAppStore((s) => s.markDemandaCorrected);
  const submitDemandaToPjud = useAppStore((s) => s.submitDemandaToPjud);
  const addDemandas = useAppStore((s) => s.addDemandas);
  const pushToast = useAppStore((s) => s.pushToast);

  const [tab, setTab] = useState<DemandaStatus>('revisar');
  const [query, setQuery] = useState('');
  const [drag, setDrag] = useState(false);

  // Ingesta en vivo ("creando demandas")
  const [ingesting, setIngesting] = useState(false);
  const [done, setDone] = useState(false);
  const [steps, setSteps] = useState<IngestStep[]>([]);
  const [planSteps, setPlanSteps] = useState<AgentPlanStep[]>([]);
  const timers = useRef<number[]>([]);
  useEffect(() => () => { timers.current.forEach((t) => clearTimeout(t)); }, []);

  // Editor de la demanda (documento del agente, siempre editable) + ingreso de causa
  const [editing, setEditing] = useState<Demanda | null>(null);
  const [submit, setSubmit] = useState<Demanda | null>(null);
  const [rol, setRol] = useState('');

  const counts = useMemo(() => ({
    revisar: demandas.filter((d) => d.status === 'revisar').length,
    redactada: demandas.filter((d) => d.status === 'redactada').length,
  }), [demandas]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return demandas.filter((d) => {
      if (d.status !== tab) return false;
      return !q
        || d.credito.toLowerCase().includes(q)
        || d.parties.toLowerCase().includes(q)
        || d.rut.toLowerCase().includes(q);
    });
  }, [demandas, tab, query]);

  const validadaCount = ingestBatch.filter((s) => s.status === 'validada').length;
  const revisionCount = ingestBatch.length - validadaCount;
  const resolved = steps.filter((s) => s.status !== 'leyendo').length;

  function loadLote() {
    if (ingesting) return;
    setIngesting(true);
    setDone(false);
    setSteps([]);
    const base = toPendingPlan(ingestPlan.steps);
    setPlanSteps(advancePlan(base, 0));
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
    pushToast('info', 'Descomprimiendo el ZIP y creando las demandas del lote…');

    const planMs = 480;
    base.forEach((_, i) => {
      if (i === 0) return;
      timers.current.push(window.setTimeout(() => setPlanSteps(advancePlan(base, i)), i * planMs));
    });

    const stepMs = 520;
    const docsStart = base.length * planMs;
    ingestBatch.forEach((raw, i) => {
      timers.current.push(window.setTimeout(() => {
        setSteps((s) => [...s, { ...raw, status: 'leyendo' }]);
      }, docsStart + i * stepMs));
      timers.current.push(window.setTimeout(() => {
        setSteps((s) => s.map((x) => (x.id === raw.id ? { ...x, status: raw.status } : x)));
      }, docsStart + i * stepMs + stepMs - 150));
    });

    timers.current.push(window.setTimeout(() => {
      setPlanSteps(completePlan(base));
      // Toda operación nace como demanda: validada → redactada; el resto → revisar con su motivo.
      const nuevas: Demanda[] = ingestBatch.map((s, i) => {
        const [credito, parties] = s.doc.split(' · ');
        const financiera = parties.includes('OLX') ? 'OLX' : parties.includes('PROFIN') ? 'PROFIN' : 'Tanner';
        const ok = s.status === 'validada';
        return {
          id: `ing-${credito}`, credito, parties, financiera,
          rut: ruts[i % ruts.length], monto: montos[i % montos.length],
          status: ok ? 'redactada' : 'revisar',
          revisarReason: ok ? undefined : s.reason,
          template: 'GLOBAL 1 SIN EXHORTO',
        };
      });
      addDemandas(nuevas);
      setDone(true);
      pushToast('ok', `Lote creado: ${validadaCount} demandas redactadas · ${revisionCount} por revisar`);
    }, docsStart + ingestBatch.length * stepMs + 250));
  }

  function closeLote() {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
    setIngesting(false);
    setDone(false);
    setSteps([]);
    setPlanSteps([]);
  }

  function correctFromEditor(d: Demanda) {
    markDemandaCorrected(d.id);
    setEditing(null);
    setTab('redactada');
    pushToast('ok', `${d.credito} corregida — queda redactada, lista para ingresar la causa.`);
  }

  function confirmSubmit() {
    if (!submit) return;
    const r = rol.trim();
    if (!r) return;
    const causaId = submitDemandaToPjud(submit.id, r);
    setSubmit(null);
    setRol('');
    pushToast('ok', `Causa creada con Rol ${r}. Arrancó el reloj y el hito de facturación (5%).`);
    if (causaId) navigate(`/causas/${causaId}`);
  }

  // Todo documento del agente se abre editable en el editor tipo Word.
  const editorAction = editing && editing.status === 'revisar'
    ? { label: 'Marcar corregida', icon: 'check' as const, onClick: () => correctFromEditor(editing) }
    : editing
      ? { label: 'Ingresar causa', icon: 'arrowRight' as const, onClick: () => { const d = editing; setEditing(null); setSubmit(d); } }
      : undefined;

  return (
    <>
      <div className="head">
        <div className="brand-row">
          <span className="dot"><Icon name="file" /></span>
          Estudio Cid &amp; Asociados
        </div>
        <h1>Redacción de demandas</h1>
        <div className="sub">La demanda vive aquí antes de existir la causa. El N° de causa se asocia al ingresar la causa en el PJUD.</div>
      </div>

      {/* Ingesta del lote */}
      {!ingesting && (
        <div
          className={`ingest-drop${drag ? ' drag' : ''}`}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); loadLote(); }}
        >
          <div className="ingest-drop-ic"><Icon name="upload" size={20} /></div>
          <div className="ingest-drop-body">
            <div className="t">Arrastra un ZIP del lote aquí</div>
            <div className="s">Identifico la financiera, valido los 4 documentos y voy creando cada demanda con su plantilla — en vivo.</div>
          </div>
          <button className="btn btn-dark" onClick={loadLote}>Seleccionar archivo</button>
        </div>
      )}

      {/* Vista en vivo: se están creando las demandas */}
      {ingesting && (
        <div className="card">
          <div className="card-head">
            <span className="ic"><Icon name={done ? 'checkSquare' : 'spinner'} className={done ? '' : 'spin'} /></span>
            <h3>{done ? 'Demandas creadas' : 'Creando demandas…'}</h3>
            <span className="count">{resolved} de {ingestBatch.length}</span>
          </div>
          {planSteps.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <AgentPlan title={ingestPlan.title} steps={planSteps} />
            </div>
          )}
          <div className="ingest-progress"><i style={{ width: `${(resolved / ingestBatch.length) * 100}%` }} /></div>
          <div style={{ marginTop: 14 }}>
            {steps.map((s) => {
              const m = stepMeta[s.status];
              return (
                <div className="queue-row" key={s.id}>
                  <span className={`ingest-dot ${s.status}`}><Icon name={m.icon} size={15} className={m.spin ? 'spin' : ''} /></span>
                  <div className="qbody">
                    <div className="qt">{s.doc}</div>
                    <div className="qs">{s.status === 'leyendo' ? 'Validando documentos y redactando la demanda…' : s.detail}</div>
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
                <span><b>{validadaCount} demandas redactadas</b> y <b>{revisionCount} por revisar</b> (documentación incompleta, vehículo transferido u OCR bajo umbral). Corrígelas antes de ingresar la causa.</span>
              </div>
              <div className="ingest-summary-actions">
                <button className="btn btn-primary" onClick={closeLote}><Icon name="file" />Ver el lote de demandas</button>
              </div>
            </div>
          )}
        </div>
      )}

      {!ingesting && (
        <>
          <div className="tabs" style={{ margin: '22px 0 0' }}>
            {(['revisar', 'redactada'] as const).map((t) => (
              <button key={t} className={`tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
                {t === 'revisar' ? 'Por revisar' : 'Redactada'} · {counts[t]}
              </button>
            ))}
          </div>

          <div className="ops-toolbar">
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
                <Icon name={tab === 'revisar' ? 'check' : 'search'} />
                <div>{tab === 'revisar' ? 'No hay demandas por revisar. Todo lo creado quedó redactado.' : 'No hay demandas redactadas que coincidan.'}</div>
              </div>
            )}
            {rows.map((d) => (
              <div className="op-row demanda-row" key={d.id}>
                <span className="op-credito">{d.credito}</span>
                <div className="op-parties">
                  <div className="n">{d.parties}</div>
                  <div className="f">{d.financiera} · RUT {d.rut} · {d.template}</div>
                </div>
                {d.status === 'revisar' && d.revisarReason && (
                  <span className="revisar-flag"><Icon name="alert" size={12} />{reasonMeta[d.revisarReason].label}</span>
                )}
                <div className="demanda-action">
                  {d.status === 'revisar' ? (
                    <button className="btn btn-primary btn-sm" onClick={() => setEditing(d)}><Icon name="alert" />Revisar y corregir</button>
                  ) : (
                    <>
                      <button className="btn btn-ghost btn-sm" onClick={() => setEditing(d)}><Icon name="eye" />Ver</button>
                      <button className="btn btn-primary btn-sm" onClick={() => setSubmit(d)}><Icon name="arrowRight" />Ingresar causa</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Documento del agente: siempre editable en el editor tipo Word */}
      {editing && (
        <EscritoEditor
          escritoId={`demanda:${editing.id}`}
          title={`Demanda ejecutiva · ${editing.credito}`}
          body={escritos.demanda.body}
          action={editorAction}
          onClose={() => setEditing(null)}
        />
      )}

      {/* Ingresar causa: pide el Rol y convierte la demanda en causa */}
      {submit && (
        <Modal
          title="Ingresar la causa en el PJUD"
          icon="arrowRight"
          onClose={() => { setSubmit(null); setRol(''); }}
          footer={<>
            <button className="btn btn-ghost" onClick={() => { setSubmit(null); setRol(''); }}>Cancelar</button>
            <button className="btn btn-primary" disabled={!rol.trim()} onClick={confirmSubmit}><Icon name="check" />Ingresar causa</button>
          </>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p style={{ fontSize: 13.5, color: 'var(--muted)', margin: 0 }}>
              <b style={{ color: 'var(--indigo)' }}>{submit.credito} · {submit.parties}</b>. Se presenta con la clave de la patrocinante,
              se deriva a los apoderados y, con el envío final, la demanda <b>se convierte en causa</b>: arranca el reloj y el hito de facturación (5%).
            </p>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--indigo)', display: 'flex', flexDirection: 'column', gap: 6 }}>
              Código / Rol de la causa
              <input
                className="input"
                autoFocus
                placeholder="Ej: E-1234-2026"
                value={rol}
                onChange={(e) => setRol(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && confirmSubmit()}
              />
            </label>
            <span style={{ fontSize: 12, color: 'var(--muted-2)' }}>Hasta que el tribunal distribuya, puedes usar “En trámite de ingreso”.</span>
          </div>
        </Modal>
      )}
    </>
  );
}
