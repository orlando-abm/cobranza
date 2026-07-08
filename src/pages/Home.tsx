import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import Modal from '../components/Modal';
import BatchFlowModal from '../components/BatchFlowModal';
import { useAppStore } from '../store/useAppStore';
import { pulse, urgentItems, batchMetrics, recentItems, TODAY, agentBriefing, agentPlan } from '../data/mock';
import type { BatchMetric } from '../types';

export default function Home() {
  const navigate = useNavigate();
  const pushToast = useAppStore((s) => s.pushToast);
  const causas = useAppStore((s) => s.causas);
  const reminders = useAppStore((s) => s.reminders);
  const dueReminders = useMemo(() => reminders.filter((r) => !r.done && r.due <= TODAY), [reminders]);
  const pendingHuman = useAppStore((s) => s.pendingHumanTasks());
  const pendingMand = useAppStore((s) => s.pendingMandamientos());
  const pendingOcr = useAppStore((s) => s.pendingReview());
  const pendingRevisiones = pendingHuman + pendingMand + pendingOcr;

  // Excluir causas suspendidas o eliminadas de "Vence pronto" y de las métricas en lote.
  const inactiveIds = useMemo(
    () => new Set(causas.filter((c) => c.managementStatus === 'suspended' || c.managementStatus === 'deleted').map((c) => c.id)),
    [causas],
  );
  const visibleUrgent = useMemo(
    () => urgentItems.filter((u) => !inactiveIds.has(u.causaId)),
    [inactiveIds],
  );
  const visibleBatch = useMemo<BatchMetric[]>(
    () => batchMetrics.map((m) => {
      const items = m.items.filter((it) => !it.causaId || !inactiveIds.has(it.causaId));
      return { ...m, items, num: m.num - (m.items.length - items.length) };
    }),
    [inactiveIds],
  );
  const [batch, setBatch] = useState<BatchMetric | null>(null);
  const [docItem, setDocItem] = useState<{ title: string } | null>(null);

  function openMetric(m: BatchMetric) {
    setBatch(m);
  }

  return (
    <>
      <div className="pulse">
        <div className="pulse-dot" />
        {pulse.map((p, i) => (
          <div key={i} style={{ display: 'contents' }}>
            <div className={`pulse-item${p.alert ? ' alert' : ''}`}><b>{p.b}</b> {p.t}</div>
            {i < pulse.length - 1 && <div className="pulse-sep" />}
          </div>
        ))}
      </div>

      <div className="head">
        <div className="brand-row">
          <span className="dot"><Icon name="message" /></span>
          Estudio Cid &amp; Asociados
        </div>
        <h1>Buenas tardes, Cristóbal</h1>
        <div className="sub">Esto es lo que urge y lo que puedo avanzar por ti hoy.</div>
      </div>

      {/* FB-02 · Agente global: briefing del día + plan de trabajo priorizado */}
      <div className="agent-brief">
        <div className="ab-head">
          <div className="ab-avatar"><Icon name="message" /></div>
          <div className="ab-headtext">
            <div className="ab-title">Tu resumen del día</div>
            <div className="ab-sub">Se movieron <b>{agentBriefing.total}</b> causas hoy en el PJUD. Leí cada documento y te propongo por dónde empezar.</div>
          </div>
          <button className="btn btn-ghost btn-sm ab-pjud" onClick={() => navigate('/estado-diario')}><Icon name="table" />Ver estado diario PJUD</button>
        </div>
        <div className="ab-groups">
          {agentBriefing.groups.map((g) => (
            <div className="ab-chip" key={g.label}>
              <span className="ab-count">{g.count}</span>
              <span className="ab-chip-body"><b>{g.label}</b><span>{g.detail}</span></span>
            </div>
          ))}
        </div>
        <div className="ab-plan">
          <div className="ab-plan-label">Plan de trabajo propuesto</div>
          {agentPlan.map((p, i) => (
            <button className="ab-plan-item" key={p.id} onClick={() => navigate(p.to)}>
              <span className="ab-num">{i + 1}</span>
              <span className="ab-plan-text"><span className="t">{p.title}</span><span className="s">{p.detail}</span></span>
              <Icon name="chevronRight" />
            </button>
          ))}
          <button className="btn btn-primary ab-cta" onClick={() => pushToast('ok', 'Ejecutando el plan del día en lote — te aviso a medida que cierro cada acción')}>
            <Icon name="bolt" />Lanzar el plan del día en lote
          </button>
        </div>
      </div>

      <div className="grid">
        <div className="col-main">
          <div className="sec-label">
            <h2>⏱ Vence pronto — decides tú</h2>
            <a className="see" onClick={() => navigate('/causas')}>Ver todo</a>
          </div>

          {visibleUrgent.length === 0 && (
            <div className="empty" style={{ padding: '28px 20px' }}>
              <Icon name="check" />
              <div>No hay plazos que venzan pronto en las causas activas.</div>
            </div>
          )}
          {visibleUrgent.map((u) => (
            <div key={u.id} className={`urgent-card${u.tone === 'amber' ? ' amber' : ''}`}>
              <div className="uc-top">
                <span className={`countdown${u.tone === 'amber' ? ' amber' : ''}`}>
                  <Icon name="clock" />{u.days}
                </span>
                <span className="uc-type">{u.type}</span>
                <span className="uc-rol">{u.rol}</span>
              </div>
              <div className="uc-parties">{u.parties}</div>
              <div className="uc-agent">
                <span className="pill"><Icon name={u.pill.icon} />{u.pill.label}</span>
                {u.text}
              </div>
              <div className="uc-actions">
                {u.secondaryLabel && (
                  <button className="btn btn-ghost" onClick={() => setDocItem({ title: u.secondaryLabel! })}>
                    <Icon name="file" />{u.secondaryLabel}
                  </button>
                )}
                <button className="btn btn-primary" onClick={() => navigate(`/causas/${u.causaId}`)}>Abrir causa</button>
              </div>
            </div>
          ))}

          {dueReminders.length > 0 && (
            <>
              <div style={{ height: 26 }} />
              <div className="sec-label">
                <h2>🔔 Recordatorios tuyos</h2>
                <span className="see" style={{ cursor: 'default' }}>No son plazos legales</span>
              </div>
              <div className="side-card" style={{ padding: '6px 16px' }}>
                {dueReminders.map((r) => (
                  <div className="reminder-row" key={r.id}>
                    <span className={`reminder-when${r.due < TODAY ? ' overdue' : ''}`}>
                      <Icon name="bell" size={13} />{r.due < TODAY ? 'Vencido' : 'Hoy'}
                    </span>
                    <span className="reminder-text">{r.text}</span>
                    {r.causaId && (
                      <button className="link-tag" onClick={() => navigate(`/causas/${r.causaId}`)}>{r.causaLabel ?? 'Abrir causa'}</button>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          <div style={{ height: 26 }} />

          <div className="sec-label">
            <h2>⚡ Puedo avanzar esto por ti — en lote</h2>
          </div>

          {visibleBatch.map((m) => (
            <button key={m.id} className="metric-card" onClick={() => openMetric(m)}>
              <div className="metric-num">{m.num}</div>
              <div className="metric-body">
                <div className="t">{m.title}</div>
                <div className="s">{m.sub}</div>
              </div>
              <div className="metric-go"><Icon name="arrowRight" /></div>
            </button>
          ))}

          <div style={{ height: 26 }} />

          <div className="sec-label">
            <h2>🙋 Necesita tu revisión</h2>
            <a className="see" onClick={() => navigate('/revisiones')}>Ver todo</a>
          </div>

          <button className="metric-card" onClick={() => navigate('/revisiones')}>
            <div className="metric-num">{pendingRevisiones}</div>
            <div className="metric-body">
              <div className="t">Tareas esperando tu ojo humano</div>
              <div className="s">
                {pendingHuman} {pendingHuman === 1 ? 'decisión tuya' : 'decisiones tuyas'} · {pendingMand} {pendingMand === 1 ? 'mandamiento' : 'mandamientos'} con diferencias · {pendingOcr} campos OCR bajo umbral
              </div>
            </div>
            <div className="metric-go"><Icon name="chevronRight" /></div>
          </button>
        </div>

        <div className="col-side">
          <div>
            <div className="sec-label"><h2>Cargar lote nuevo</h2></div>
            <div className="side-card" style={{ textAlign: 'center', padding: '24px 18px' }}>
              <div style={{ width: 46, height: 46, borderRadius: 13, background: 'var(--violeta-ghost)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', color: 'var(--violeta)' }}>
                <Icon name="upload" size={22} />
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--indigo)', marginBottom: 4 }}>Cargá un ZIP del lote</div>
              <div style={{ fontSize: 12.5, color: 'var(--muted)', marginBottom: 14 }}>La ingesta y redacción viven en Demandas, con feedback en vivo</div>
              <button className="btn btn-dark" style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate('/demandas')}>
                Ir a Demandas
              </button>
            </div>
          </div>

          <div>
            <div className="sec-label"><h2>Reciente</h2><a className="see" onClick={() => navigate('/informes')}>Ver todo</a></div>
            <div className="side-card">
              {recentItems.map((r) => (
                <button key={r.id} className="recent-item" onClick={() => navigate('/informes')}>
                  <div className="recent-dot" />
                  <div><div className="rt">{r.title}</div><div className="rs">{r.sub}</div></div>
                  <div className="chev"><Icon name="chevronRight" /></div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {batch && <BatchFlowModal metric={batch} onClose={() => setBatch(null)} />}
      {docItem && (
        <Modal title={docItem.title} icon="file" onClose={() => setDocItem(null)}
          footer={<button className="btn btn-primary" onClick={() => setDocItem(null)}>Cerrar</button>}>
          <div className="doc-preview">{`Documento simulado — ${docItem.title}\n\nVista previa del PDF asociado a la actuación.\nEn el front real este panel embebe el visor de documentos\ncon el recorte OCR resaltado y el enlace a la OJV.`}</div>
        </Modal>
      )}
    </>
  );
}
