import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import RichText from '../components/RichText';
import Modal from '../components/Modal';
import EscritoEditor from '../components/EscritoEditor';
import { useAppStore } from '../store/useAppStore';
import { flows, agentReply } from '../data/flows';
import { escritoFor, type EscritoTemplate } from '../data/escritos';
import { daysFromToday } from '../data/mock';
import type { ChatMessage } from '../types';

function parseReminder(text: string): { due: string; dueLabel: string } | null {
  const t = text.toLowerCase();
  if (!/acord|record|recu[eé]rd/.test(t)) return null;
  let days = 2;
  const m = t.match(/(\d+)\s*d[ií]a/);
  if (m) days = parseInt(m[1], 10);
  else if (t.includes('mañana')) days = 1;
  else if (t.includes('semana')) days = 7;
  return { due: daysFromToday(days), dueLabel: `en ${days} ${days === 1 ? 'día' : 'días'}` };
}

const TABS = ['Procurador', 'Expediente', 'Documentos', 'Hitos de cobro'] as const;
type Tab = (typeof TABS)[number];

export default function Causa() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const causa = useAppStore((s) => s.getCausa(id));
  const addMessage = useAppStore((s) => s.addMessage);
  const removeMessage = useAppStore((s) => s.removeMessage);
  const markProposalDone = useAppStore((s) => s.markProposalDone);
  const advanceMilestone = useAppStore((s) => s.advanceMilestone);
  const pushToast = useAppStore((s) => s.pushToast);
  const suspendCausa = useAppStore((s) => s.suspendCausa);
  const reactivateCausa = useAppStore((s) => s.reactivateCausa);
  const deleteCausa = useAppStore((s) => s.deleteCausa);
  const notes = useAppStore((s) => s.notes);
  const addNote = useAppStore((s) => s.addNote);
  const addReminder = useAppStore((s) => s.addReminder);
  const causaNotes = useMemo(() => notes.filter((n) => n.causaId === id), [notes, id]);

  const [tab, setTab] = useState<Tab>('Procurador');
  const [input, setInput] = useState('');
  const [noteInput, setNoteInput] = useState('');
  const [doc, setDoc] = useState<{ title: string; body?: string } | null>(null);
  const [escrito, setEscrito] = useState<EscritoTemplate | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mgmtAction, setMgmtAction] = useState<'suspend' | 'delete' | null>(null);
  const [reason, setReason] = useState('');
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [causa?.chat.length, tab]);

  if (!causa) {
    return (
      <div className="empty" style={{ padding: 80 }}>
        <Icon name="alert" />
        <div>No encontré esa causa. <Link to="/causas" style={{ color: 'var(--violeta)' }}>Volver a Causas</Link></div>
      </div>
    );
  }

  function runFlow(msgId: string, flowKey: string) {
    const script = flows[flowKey] ?? flows.generic;
    markProposalDone(id, msgId);
    addMessage(id, { role: 'user', text: script.userText, time: 'Ahora' });
    const typingId = addMessage(id, { role: 'agent', text: script.working, time: '', typing: true });
    window.setTimeout(() => {
      removeMessage(id, typingId);
      addMessage(id, { role: 'agent', text: script.reply, time: 'Ahora', doc: script.doc });
      if (script.milestone) advanceMilestone(id, script.milestone);
      pushToast('ok', script.toast);
    }, 1600);
  }

  function send() {
    const v = input.trim();
    if (!v) return;
    addMessage(id, { role: 'user', text: v, time: 'Ahora' });
    setInput('');
    const rem = parseReminder(v);
    const typingId = addMessage(id, { role: 'agent', text: '', time: '', typing: true });
    window.setTimeout(() => {
      removeMessage(id, typingId);
      if (rem) {
        addReminder({ text: v, due: rem.due, causaId: id, causaLabel: causa!.parties });
        addMessage(id, { role: 'agent', text: `Anotado. Te lo recuerdo **${rem.dueLabel}** — lo vas a ver en el Inicio, en “Recordatorios tuyos”. No es un plazo legal, así que no bloquea nada.`, time: 'Ahora' });
        pushToast('ok', 'Recordatorio agendado');
      } else {
        addMessage(id, { role: 'agent', text: agentReply(v), time: 'Ahora' });
      }
    }, 1200);
  }

  function addNoteHandler() {
    const v = noteInput.trim();
    if (!v) return;
    addNote(id, v);
    setNoteInput('');
    pushToast('ok', 'Nota agregada al historial de la causa');
  }

  function confirmMgmt() {
    const r = reason.trim();
    if (mgmtAction === 'suspend') {
      suspendCausa(id, r || 'Sin motivo indicado');
      pushToast('ok', 'Causa suspendida — sale de las métricas y relojes activos');
      setMgmtAction(null);
      setReason('');
    } else if (mgmtAction === 'delete') {
      deleteCausa(id, r || 'Sin motivo indicado');
      pushToast('ok', 'Causa eliminada del listado');
      setMgmtAction(null);
      setReason('');
      navigate('/causas');
    }
  }

  const suspended = causa.managementStatus === 'suspended';

  // FB-04: los escritos redactables abren el editor tipo Word; los PDFs del expediente, el visor.
  function openDoc(title: string) {
    const e = escritoFor(title);
    if (e) { setEscrito(e); return; }
    setDoc({ title });
  }

  return (
    <>
      <div className="causa-head">
        <div className="breadcrumb">
          <Link to="/causas">Causas</Link>
          <Icon name="chevronRight" />
          <span>{causa.credito}</span>
        </div>
        <div className="causa-title-row">
          <div>
            <h1>{causa.parties}</h1>
            <div className="credito-tag">
              Crédito {causa.id} · {causa.detail} · Rol {causa.rol}
            </div>
          </div>
          <div className="causa-head-right">
            {suspended
              ? <span className="stage-tag suspended"><Icon name="pause" />Suspendida</span>
              : <span className="stage-tag"><Icon name="activity" />Etapa · {causa.stage}</span>}
            <div className="causa-actions">
              <button className="btn btn-ghost btn-sm" onClick={() => setMenuOpen((o) => !o)} aria-label="Gestión de la causa">
                <Icon name="more" />Gestión
              </button>
              {menuOpen && (
                <>
                  <div className="menu-backdrop" onClick={() => setMenuOpen(false)} />
                  <div className="action-menu">
                    {suspended ? (
                      <button onClick={() => { reactivateCausa(id); setMenuOpen(false); pushToast('ok', 'Causa reactivada — vuelve a las métricas y relojes'); }}>
                        <Icon name="play" />Reactivar causa
                      </button>
                    ) : (
                      <button onClick={() => { setMgmtAction('suspend'); setMenuOpen(false); }}>
                        <Icon name="pause" />Suspender causa
                      </button>
                    )}
                    <button className="danger" onClick={() => { setMgmtAction('delete'); setMenuOpen(false); }}>
                      <Icon name="trash" />Eliminar causa
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        {suspended && (
          <div className="note suspended-note">
            <Icon name="pause" />
            <span>Causa <b>suspendida</b>{causa.managementReason ? ` — ${causa.managementReason}` : ''}. No aparece en las métricas del inicio ni en los relojes activos. Reactivala desde <b>Gestión</b> para retomarla.</span>
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
            <div className="proc-card">
              <div className="proc-header">
                <div className="proc-avatar"><Icon name="message" /></div>
                <div>
                  <div className="pt">Tu procurador en esta causa</div>
                  <div className="ps"><span className="live" />Vigilando ambos cuadernos en tiempo real</div>
                </div>
              </div>

              <div className="proc-body" ref={bodyRef}>
                {causa.chat.map((m) => (
                  <ChatBubble key={m.id} m={m}
                    onRun={runFlow}
                    onDoc={openDoc}
                  />
                ))}
              </div>

              <div className="proc-input">
                <input
                  placeholder="Pedile algo a tu procurador… ej: pedí el CAV a la financiera"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && send()}
                />
                <button className="proc-send" onClick={send} aria-label="Enviar"><Icon name="send" /></button>
              </div>
            </div>
          </div>

          <div className="col-side">
            <div className="parallel-card">
              <div className="parallel-head">
                <Icon name="triangle" />
                <span className="pt">Cuaderno de apremio</span>
                <span className="badge">{causa.apremio.badge}</span>
              </div>
              <div className="parallel-body">
                <div className="timeline-mini">
                  {causa.apremio.timeline.map((t, i) => (
                    <div key={i} className={`tl-item ${t.state}`}>
                      <div className="tt">{t.title}</div>
                      <div className="td">{t.detail}</div>
                    </div>
                  ))}
                </div>
                <div className="note" style={{ margin: '14px 0 0', padding: '11px 13px' }}>
                  <Icon name="info" />
                  <span>Este plazo <b>no bloquea el embargo</b>. Corre en paralelo — sigo avanzando el cuaderno principal.</span>
                </div>
              </div>
            </div>

            {causa.inscripcion && <InscripcionClock day={causa.inscripcion.day} status={causa.inscripcion.status} patente={causa.patente} />}

            <div>
              <div className="sec-label"><h2>Estado de la causa</h2></div>
              <div className="side-card">
                {causa.milestones.map((m, i) => (
                  <div key={i} className={`milestone${m.state === 'active' ? ' active' : ''}`}>
                    <div className={`mi ${m.state === 'wait' ? 'wait' : 'done'}`}>
                      {m.state === 'wait' ? '→' : <Icon name="check" />}
                    </div>
                    <span className="ml">{m.label}</span>
                    <span className="mp">{m.pct}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="sec-label"><h2>Datos</h2></div>
              <div className="side-card">
                <Row k="Financiera" v={causa.financiera} />
                <Row k="Tribunal" v={causa.tribunal} />
                <Row k="Receptor" v={causa.receptor} />
                <Row k="Monto demandado" v={causa.monto} />
                <Row k="RUT deudor" v={causa.rut} />
                {causa.patente && <Row k="Patente" v={causa.patente} />}
                <Row k="Intentos (pauta)" v={causa.intentos} />
              </div>
            </div>

            <div>
              <div className="sec-label"><h2>Notas internas</h2></div>
              <div className="side-card">
                {causaNotes.length === 0 && <div className="note-empty">Sin notas todavía. El procurador las consulta al proponer pasos.</div>}
                {causaNotes.map((n) => (
                  <div className="note-item" key={n.id}>
                    <div className="note-text">{n.text}</div>
                    <div className="note-meta"><Icon name="note" size={12} />{n.author} · {n.time}</div>
                  </div>
                ))}
                <div className="note-add">
                  <input
                    placeholder="Escribí una nota interna…"
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addNoteHandler()}
                  />
                  <button className="btn btn-primary btn-sm" onClick={addNoteHandler} aria-label="Agregar nota"><Icon name="plus" /></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'Expediente' && (
        <div className="section">
          {(['Principal', 'Apremio'] as const).map((cuad) => (
            <div className="card" key={cuad}>
              <div className="card-head">
                <span className="ic"><Icon name={cuad === 'Principal' ? 'scale' : 'triangle'} /></span>
                <h3>Cuaderno {cuad}</h3>
              </div>
              <div className="timeline-mini" style={{ paddingLeft: 20 }}>
                {(cuad === 'Apremio'
                  ? causa.apremio.timeline
                  : causa.milestones.map((m) => ({ title: m.label, detail: `Avance ${m.pct}`, state: m.state === 'wait' ? 'pending' : 'done' as const }))
                ).map((t, i) => (
                  <div key={i} className={`tl-item ${t.state === 'pending' ? 'pending' : 'done'}`}>
                    <div className="tt">{t.title}</div>
                    <div className="td">{t.detail}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'Documentos' && (
        <div className="section">
          <div className="card">
            <div className="card-head">
              <span className="ic"><Icon name="file" /></span>
              <h3>Documentos de la causa</h3>
              <span className="count">{causa.docs.length}</span>
            </div>
            {causa.docs.map((d) => (
              <div className="queue-row" key={d.name}>
                <span className="ic" style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--paper)', color: 'var(--red)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name="file" size={17} />
                </span>
                <div className="qbody">
                  <div className="qt">{d.name}</div>
                  <div className="qs">{d.type} · {d.date} · Cuaderno {d.cuaderno}</div>
                </div>
                <div className="qactions">
                  <button className="btn btn-ghost btn-sm" onClick={() => setDoc({ title: d.name })}><Icon name="eye" />Ver</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'Hitos de cobro' && (
        <div className="section">
          <div className="card">
            <div className="card-head">
              <span className="ic"><Icon name="chart" /></span>
              <h3>Hitos de cobro</h3>
            </div>
            <div className="note" style={{ margin: '0 0 4px' }}>
              <Icon name="info" />
              <span>No es el % de avance del juicio: es el <b>hito por el que el estudio le cobra a la financiera</b>. Cada uno se factura con fecha y documento fundante.</span>
            </div>
            {causa.billing.map((b) => (
              <div className="queue-row" key={b.label}>
                <span className="metric-num" style={{ minWidth: 52, fontSize: 20 }}>{b.pct}%</span>
                <div className="qbody">
                  <div className="qt">{b.label}</div>
                  <div className="qs">{b.date ? `${b.date} · ${b.doc}` : 'Aún no alcanzado'}</div>
                </div>
                <div className="qactions">
                  <span className={`status-tag ${b.billed ? 'ready' : b.date ? 'wait' : 'neutral'}`}>
                    {b.billed ? 'Facturado' : b.date ? 'Facturable' : 'Pendiente'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {doc && (
        <Modal title={doc.title} icon={doc.body ? 'mail' : 'file'} onClose={() => setDoc(null)}
          footer={<>
            <button className="btn btn-ghost" onClick={() => setDoc(null)}>Cerrar</button>
            <button className="btn btn-primary" onClick={() => { pushToast('ok', 'Documento descargado'); setDoc(null); }}><Icon name="file" />Descargar</button>
          </>}>
          <div className="doc-preview">{doc.body ?? `Vista previa simulada — ${doc.title}\n\nEn el front real este panel embebe el visor de PDF con el\nrecorte OCR resaltado y el enlace directo a la OJV.`}</div>
        </Modal>
      )}

      {escrito && (
        <EscritoEditor
          escritoId={`${causa.id}:${escrito.id}`}
          title={escrito.title}
          body={escrito.body}
          onClose={() => setEscrito(null)}
        />
      )}

      {mgmtAction && (
        <Modal
          title={mgmtAction === 'suspend' ? 'Suspender causa' : 'Eliminar causa'}
          icon={mgmtAction === 'suspend' ? 'pause' : 'trash'}
          onClose={() => { setMgmtAction(null); setReason(''); }}
          footer={<>
            <button className="btn btn-ghost" onClick={() => { setMgmtAction(null); setReason(''); }}>Cancelar</button>
            <button className={`btn ${mgmtAction === 'delete' ? 'btn-danger' : 'btn-primary'}`} onClick={confirmMgmt}>
              <Icon name={mgmtAction === 'suspend' ? 'pause' : 'trash'} />
              {mgmtAction === 'suspend' ? 'Suspender' : 'Eliminar'}
            </button>
          </>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <p style={{ fontSize: 13.5, color: 'var(--muted)', margin: 0 }}>
              {mgmtAction === 'suspend'
                ? <>La causa <b>{causa.parties}</b> quedará en pausa: sale de las métricas y relojes activos, pero podés reactivarla cuando quieras.</>
                : <>La causa <b>{causa.parties}</b> se quitará del listado. Registrá el motivo para dejar traza.</>}
            </p>
            <label style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--indigo)' }}>Motivo</label>
            <textarea
              className="reason-input"
              autoFocus
              rows={3}
              placeholder={mgmtAction === 'suspend' ? 'Ej: acuerdo de pago en curso; retomar en 30 días' : 'Ej: causa duplicada / asignada por error'}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
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

function InscripcionClock({ day, status, patente }: {
  day: number;
  status: 'tramite' | 'consultar' | 'aceptada' | 'rechazada';
  patente?: string;
}) {
  const pct = Math.min(100, Math.round((day / 30) * 100));
  const map = {
    tramite: { color: 'var(--violeta)', tag: 'En trámite', tagCls: 'neutral', note: 'El comprobante de ingreso arrancó el reloj de 30 días. Consulto la “inscripción aceptada” desde el día 25.' },
    consultar: { color: 'var(--amber)', tag: 'Toca consultar', tagCls: 'wait', note: 'Ya cumplió los 25 días. Consulto el Registro Civil en la próxima corrida en lote.' },
    aceptada: { color: 'var(--green)', tag: 'Inscripción aceptada', tagCls: 'ready', note: 'Registro Civil aceptó la inscripción. Avisé al abogado y mandé el mail a la financiera.' },
    rechazada: { color: 'var(--red)', tag: 'Rechazada', tagCls: 'blocked', note: 'La inscripción fue rechazada — requiere decisión humana.' },
  }[status];
  return (
    <div>
      <div className="sec-label"><h2>Reloj de inscripción</h2></div>
      <div className="side-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--indigo)' }}>
            {status === 'aceptada' ? 'Inscrito' : `Día ${day} de 30`}
          </span>
          {patente && <span className="mono" style={{ fontSize: 12, color: 'var(--muted)' }}>· {patente}</span>}
          <span className={`status-tag ${map.tagCls}`} style={{ marginLeft: 'auto' }}>{map.tag}</span>
        </div>
        <span className="progress-track" style={{ display: 'block' }}>
          <i style={{ width: `${pct}%`, background: map.color }} />
        </span>
        <div className="note" style={{ margin: '12px 0 0', padding: '11px 13px' }}>
          <Icon name="clock" />
          <span>{map.note}</span>
        </div>
      </div>
    </div>
  );
}

function ChatBubble({ m, onRun, onDoc }: {
  m: ChatMessage;
  onRun: (msgId: string, flow: string) => void;
  onDoc: (title: string) => void;
}) {
  return (
    <div className={`msg ${m.role}`}>
      <div className={`msg-avatar ${m.role}`}>
        {m.role === 'agent' ? <Icon name="message" /> : 'CO'}
      </div>
      <div className="msg-content">
        {m.proposal ? (
          <div className={`proposal${m.proposal.done ? ' done' : ''}`}>
            <span className="proposal-tag"><Icon name="bolt" />{m.proposal.tag}</span>
            <div className="proposal-text"><RichText text={m.proposal.text} /></div>
            <div className="proposal-actions">
              <button className="btn btn-primary" onClick={() => onRun(m.id, m.proposal!.flow)}>
                <Icon name="bolt" />{m.proposal.primaryLabel}
              </button>
              {m.proposal.secondaryLabel && (
                <button className="btn btn-ghost" onClick={() => onDoc(m.proposal!.secondaryLabel!)}>
                  {m.proposal.secondaryLabel}
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="msg-bubble">
              {m.typing && !m.text ? (
                <span className="typing"><span /><span /><span /></span>
              ) : m.typing ? (
                <span style={{ color: 'var(--muted)' }}>{m.text}</span>
              ) : (
                <RichText text={m.text} />
              )}
              {m.doc && (
                <button className="msg-doc" onClick={() => onDoc(m.doc!)}>
                  <Icon name="file" />{m.doc}
                </button>
              )}
            </div>
            {m.time && <div className="msg-time">{m.time}</div>}
          </>
        )}
      </div>
    </div>
  );
}
