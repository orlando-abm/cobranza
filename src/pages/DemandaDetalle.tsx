import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import Modal from '../components/Modal';
import EscritoEditor from '../components/EscritoEditor';
import ProcuradorChat from '../components/ProcuradorChat';
import ConfidenceBadge from '../components/ConfidenceBadge';
import { useAppStore } from '../store/useAppStore';
import { agentReplyDemanda, cambiarPlantillaPlan, thinkingPlan } from '../data/flows';
import { runAgentPlan } from '../data/agentRun';
import { escritos } from '../data/escritos';
import type { RevisarReason } from '../types';

const TEMPLATES: { id: string; label: string }[] = [
  { id: 'GLOBAL 1 SIN EXHORTO', label: 'Persona natural · Santiago' },
  { id: 'GLOBAL 1 CON EXHORTO', label: 'Persona natural · Región (exhorto)' },
  { id: 'GLOBAL 2 SIN EXHORTO', label: 'Persona + aval · Santiago' },
  { id: 'GLOBAL 2 CON EXHORTO', label: 'Persona + aval · Región (exhorto)' },
  { id: 'GLOBAL 2 SOC SIN EXHORTO', label: 'Sociedad + aval · Santiago' },
  { id: 'GLOBAL 2 SOC CON EXHORTO', label: 'Sociedad + aval · Región (exhorto)' },
];
const templateLabel = (t: string) => TEMPLATES.find((x) => x.id === t)?.label ?? t;

const reasonMeta: Record<RevisarReason, string> = {
  incompleta: 'Documentación incompleta — falta uno de los 4 documentos mandatorios (pagaré, CAV inicial, tabla de desarrollo o mandato).',
  transferido: 'Vehículo transferido — el propietario del CAV no coincide con el deudor/aval. Requiere tu decisión.',
  ocr: 'OCR bajo umbral — verifica RUT, nombres y monto contra el PDF origen.',
};

const sourceDocs = [
  { name: 'Pagaré protestado.pdf', type: 'Título ejecutivo' },
  { name: 'CAV inicial.pdf', type: 'Certificado de Anotaciones Vigentes' },
  { name: 'Tabla de desarrollo.pdf', type: 'Tabla / prepago' },
  { name: 'Mandato de la financiera.pdf', type: 'Mandato' },
];

const TABS = ['Procurador', 'Documentos'] as const;
type Tab = (typeof TABS)[number];

export default function DemandaDetalle() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const demanda = useAppStore((s) => s.getDemanda(id));
  const addMessage = useAppStore((s) => s.addDemandaMessage);
  const updateMessage = useAppStore((s) => s.updateDemandaMessage);
  const setDemandaTemplate = useAppStore((s) => s.setDemandaTemplate);
  const setDemandaConfidence = useAppStore((s) => s.setDemandaConfidence);
  const markDemandaCorrected = useAppStore((s) => s.markDemandaCorrected);
  const submitDemandaToPjud = useAppStore((s) => s.submitDemandaToPjud);
  const pushToast = useAppStore((s) => s.pushToast);

  const [tab, setTab] = useState<Tab>('Procurador');
  const [input, setInput] = useState('');
  const [editorOpen, setEditorOpen] = useState(false);
  const [pickTemplate, setPickTemplate] = useState(false);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [rol, setRol] = useState('');
  const [doc, setDoc] = useState<string | null>(null);

  if (!demanda) {
    return (
      <div className="empty" style={{ padding: 80 }}>
        <Icon name="alert" />
        <div>No encontré esa demanda. <Link to="/demandas" style={{ color: 'var(--violeta)' }}>Volver a Demandas</Link></div>
      </div>
    );
  }

  const revisar = demanda.status === 'revisar';
  const chat = demanda.chat ?? [];

  // Las propuestas de la demanda son acciones re-abribles (borrador / plantilla): no se marcan como "hechas".
  function runFlow(_msgId: string, flow: string) {
    if (flow === 'demanda-plantilla') setPickTemplate(true);
    else setEditorOpen(true); // 'demanda-editar'
  }

  function onDoc(label: string) {
    if (label.toLowerCase().includes('plantilla')) setPickTemplate(true);
    else setEditorOpen(true); // 'Ver borrador'
  }

  function send() {
    const v = input.trim();
    if (!v) return;
    addMessage(id, { role: 'user', text: v, time: 'Ahora' });
    setInput('');
    const t = v.toLowerCase();
    const wantsTemplate = t.includes('plantilla') || t.includes('equivoc') || t.includes('aval');
    const wantsEdit = t.includes('monto') || t.includes('nombre') || t.includes('rut') || t.includes('domicilio') || t.includes('cambi') || t.includes('corrig') || t.includes('edit') || t.includes('text');
    runAgentPlan(addMessage, updateMessage, id, thinkingPlan, 'Revisando el borrador…', () => {
      addMessage(id, { role: 'agent', text: agentReplyDemanda(v), time: 'Ahora' });
      if (wantsTemplate) {
        addMessage(id, { role: 'agent', text: '', time: 'Ahora', proposal: { tag: 'Plantilla', text: 'Elige la plantilla GLOBAL que corresponde y la reasigno.', primaryLabel: 'Elegir plantilla', flow: 'demanda-plantilla' } });
      } else if (wantsEdit) {
        addMessage(id, { role: 'agent', text: '', time: 'Ahora', proposal: { tag: 'Borrador', text: 'Te abro el editor tipo Word para ese cambio.', primaryLabel: 'Abrir el borrador', flow: 'demanda-editar' } });
      }
    });
  }

  function chooseTemplate(tpl: string) {
    setPickTemplate(false);
    if (tpl === demanda!.template) { pushToast('info', 'La plantilla ya es esa.'); return; }
    setDemandaTemplate(id, tpl);
    setDemandaConfidence(id, 97);
    addMessage(id, { role: 'user', text: `Cambia la plantilla a ${tpl}`, time: 'Ahora' });
    runAgentPlan(addMessage, updateMessage, id, cambiarPlantillaPlan, 'Reasignando la plantilla…', () => {
      addMessage(id, { role: 'agent', time: 'Ahora', confidence: 97, text: `Listo. Reasigné la plantilla a **${tpl}** (${templateLabel(tpl)}) y regeneré el borrador con esa base. Con tu confirmación, mi confianza sube.` });
      pushToast('ok', `Plantilla reasignada a ${tpl}`);
    });
  }

  function correctFromEditor() {
    markDemandaCorrected(id);
    setDemandaConfidence(id, 90);
    setEditorOpen(false);
    addMessage(id, { role: 'agent', time: 'Ahora', confidence: 90, text: 'Corregí el borrador — la demanda queda **redactada**, lista para ingresar la causa.' });
    pushToast('ok', `${demanda!.credito} corregida`);
  }

  function confirmSubmit() {
    const r = rol.trim();
    if (!r) return;
    const causaId = submitDemandaToPjud(id, r);
    setSubmitOpen(false);
    setRol('');
    pushToast('ok', `Causa creada con Rol ${r}. Arrancó el reloj y el hito de facturación (5%).`);
    if (causaId) navigate(`/causas/${causaId}`);
  }

  return (
    <>
      <div className="causa-head">
        <div className="breadcrumb">
          <Link to="/demandas">Demandas</Link>
          <Icon name="chevronRight" />
          <span>{demanda.credito}</span>
        </div>
        <div className="causa-title-row">
          <div>
            <h1>{demanda.parties}</h1>
            <div className="credito-tag">{demanda.credito} · {templateLabel(demanda.template)} · aún no es causa</div>
          </div>
          <div className="causa-head-right">
            <span className={`stage-tag${revisar ? ' suspended' : ''}`}>
              <Icon name={revisar ? 'alert' : 'file'} />Redacción · {revisar ? 'Por revisar' : 'Redactada'}
            </span>
            {!revisar && (
              <button className="btn btn-primary btn-sm" onClick={() => setSubmitOpen(true)}><Icon name="arrowRight" />Ingresar causa</button>
            )}
          </div>
        </div>
        {revisar && demanda.revisarReason && (
          <div className="note suspended-note">
            <Icon name="alert" />
            <span>{reasonMeta[demanda.revisarReason]} Corrígela con el procurador o en el borrador; al confirmar queda <b>redactada</b>.</span>
          </div>
        )}
      </div>

      <div className="tabs">
        {TABS.map((t) => (
          <button key={t} className={`tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      {tab === 'Procurador' && (
        <div className="causa-grid">
          <div>
            <ProcuradorChat
              title="Tu procurador en esta demanda"
              sub="Redactando y validando antes de ingresar la causa"
              messages={chat}
              input={input}
              placeholder="Pídele algo… ej: te equivocaste de plantilla, hay un aval"
              onInput={setInput}
              onSend={send}
              onRunFlow={runFlow}
              onDoc={onDoc}
            />
          </div>

          <div className="col-side">
            <div>
              <div className="sec-label"><h2>Estado</h2></div>
              <div className="side-card">
                <div className={`milestone active`}>
                  <div className="mi done"><Icon name="check" /></div>
                  <span className="ml">Demanda redactada</span>
                  <span className="mp">{revisar ? 'por revisar' : 'lista'}</span>
                </div>
                <div className="milestone">
                  <div className="mi wait">→</div>
                  <span className="ml">Ingresar la causa (PJUD)</span>
                  <span className="mp">5%</span>
                </div>
              </div>
            </div>

            <div>
              <div className="sec-label"><h2>Datos</h2></div>
              <div className="side-card">
                <Row k="Financiera" v={demanda.financiera} />
                <Row k="Nombres / partes" v={demanda.parties} />
                <Row k="RUT" v={demanda.rut} />
                <Row k="Monto" v={demanda.monto} />
                <Row k="Plantilla" v={demanda.template} />
              </div>
            </div>

            <div>
              <div className="sec-label"><h2>Borrador</h2></div>
              <div className="side-card">
                <div className="queue-row" style={{ paddingTop: 0 }}>
                  <span className="ic" style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--paper)', color: 'var(--violeta)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon name="file" size={17} />
                  </span>
                  <div className="qbody">
                    <div className="qt">Demanda ejecutiva</div>
                    <div className="qs">Documento del agente · editable</div>
                  </div>
                  {demanda.confidence != null && <ConfidenceBadge pct={demanda.confidence} />}
                </div>
                <button className="btn btn-ghost btn-sm" style={{ width: '100%', justifyContent: 'center', marginTop: 4 }} onClick={() => setEditorOpen(true)}>
                  <Icon name="eye" />Ver / editar borrador
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'Documentos' && (
        <div className="section">
          <div className="card">
            <div className="card-head">
              <span className="ic"><Icon name="file" /></span>
              <h3>Documentos del set</h3>
              <span className="count">{sourceDocs.length}</span>
            </div>
            <div className="note" style={{ margin: '0 0 4px' }}>
              <Icon name="info" />
              <span>Los <b>4 documentos mandatorios</b> del deudor. El agente los valida (completitud, consistencia cruzada y propietario del CAV) antes de redactar.</span>
            </div>
            {sourceDocs.map((d) => (
              <div className="queue-row" key={d.name}>
                <span className="ic" style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--paper)', color: 'var(--red)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name="file" size={17} />
                </span>
                <div className="qbody">
                  <div className="qt">{d.name}</div>
                  <div className="qs">{d.type}</div>
                </div>
                <div className="qactions">
                  <button className="btn btn-ghost btn-sm" onClick={() => setDoc(d.name)}><Icon name="eye" />Ver</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {editorOpen && (
        <EscritoEditor
          escritoId={`demanda:${demanda.id}`}
          title={`Demanda ejecutiva · ${demanda.credito}`}
          body={escritos.demanda.body}
          action={revisar
            ? { label: 'Marcar corregida', icon: 'check', onClick: correctFromEditor }
            : { label: 'Ingresar causa', icon: 'arrowRight', onClick: () => { setEditorOpen(false); setSubmitOpen(true); } }}
          onClose={() => setEditorOpen(false)}
        />
      )}

      {pickTemplate && (
        <Modal title="Reasignar plantilla GLOBAL" icon="file" onClose={() => setPickTemplate(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p style={{ fontSize: 13, color: 'var(--muted)', margin: '0 0 4px' }}>
              La plantilla depende del deudor, los avales y la jurisdicción. Elige la que corresponde:
            </p>
            {TEMPLATES.map((tpl) => {
              const active = tpl.id === demanda.template;
              return (
                <button key={tpl.id} className={`template-opt${active ? ' active' : ''}`} onClick={() => chooseTemplate(tpl.id)} disabled={active}>
                  <div className="template-opt-body">
                    <div className="t">{tpl.id}</div>
                    <div className="s">{tpl.label}</div>
                  </div>
                  {active ? <span className="status-tag neutral">Actual</span> : <Icon name="arrowRight" />}
                </button>
              );
            })}
          </div>
        </Modal>
      )}

      {submitOpen && (
        <Modal
          title="Ingresar la causa en el PJUD"
          icon="arrowRight"
          onClose={() => { setSubmitOpen(false); setRol(''); }}
          footer={<>
            <button className="btn btn-ghost" onClick={() => { setSubmitOpen(false); setRol(''); }}>Cancelar</button>
            <button className="btn btn-primary" disabled={!rol.trim()} onClick={confirmSubmit}><Icon name="check" />Ingresar causa</button>
          </>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p style={{ fontSize: 13.5, color: 'var(--muted)', margin: 0 }}>
              <b style={{ color: 'var(--indigo)' }}>{demanda.credito} · {demanda.parties}</b>. Se presenta con la clave de la patrocinante,
              se deriva a los apoderados y, con el envío final, la demanda <b>se convierte en causa</b>: arranca el reloj y el hito de facturación (5%).
            </p>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--indigo)', display: 'flex', flexDirection: 'column', gap: 6 }}>
              Código / Rol de la causa
              <input className="input" autoFocus placeholder="Ej: E-1234-2026" value={rol} onChange={(e) => setRol(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && confirmSubmit()} />
            </label>
            <span style={{ fontSize: 12, color: 'var(--muted-2)' }}>Hasta que el tribunal distribuya, puedes usar “En trámite de ingreso”.</span>
          </div>
        </Modal>
      )}

      {doc && (
        <Modal title={doc} icon="file" onClose={() => setDoc(null)}
          footer={<button className="btn btn-primary" onClick={() => setDoc(null)}>Cerrar</button>}>
          <div className="doc-preview">{`Vista previa simulada — ${doc}\n\nDocumento de origen del set del deudor. En el front real\neste panel embebe el visor de PDF con el recorte OCR resaltado.`}</div>
        </Modal>
      )}
    </>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="state-row"><span className="k">{k}</span><span className="v">{v}</span></div>
  );
}
