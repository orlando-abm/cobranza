import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import EscritoEditor from '../components/EscritoEditor';
import { useAppStore } from '../store/useAppStore';
import { escritoFor, escritos, type EscritoTemplate } from '../data/escritos';
import type { HumanTask, MandamientoReview, ReviewItem } from '../types';

const PAGE_SIZE = 8;

type Tab = 'human' | 'mand' | 'ocr';
type HumanFilter = 'pending' | 'prepared' | 'all';
type MandFilter = 'pending' | 'prepared' | 'all';
type OcrFilter = 'critical' | 'doubtful' | 'all';

const TAB_DESC: Record<Tab, string> = {
  human: 'Escritos que decides y firmas tú (traslados, reposiciones, rechazos del tribunal).',
  mand: 'Comparo el mandamiento del tribunal campo a campo contra la demanda. Si no calza, apruebas el “rectifíquese”.',
  ocr: 'Campos que no pude leer con certeza. Bajo umbral, la promoción de la causa queda bloqueada hasta que confirmes.',
};

const confColor = (c: number) => (c >= 85 ? 'var(--green)' : c >= 75 ? 'var(--amber)' : 'var(--red)');

function minConfidence(fields: ReviewItem['fields']) {
  return Math.min(...fields.map((f) => f.confidence));
}

function matchesQuery(text: string, q: string) {
  return text.toLowerCase().includes(q);
}

export default function Revisiones() {
  const navigate = useNavigate();
  const humanTasks = useAppStore((s) => s.humanTasks);
  const mandamientos = useAppStore((s) => s.mandamientos);
  const review = useAppStore((s) => s.review);
  const resolveHumanTask = useAppStore((s) => s.resolveHumanTask);
  const approve = useAppStore((s) => s.approveRectificacion);
  const resolveReview = useAppStore((s) => s.resolveReview);
  const pushToast = useAppStore((s) => s.pushToast);

  const pendingHuman = humanTasks.filter((t) => !t.resolved).length;
  const pendingMand = mandamientos.filter((m) => m.status === 'diff' && !m.resolved).length;
  const pendingOcr = review.length;
  const total = pendingHuman + pendingMand + pendingOcr;

  const defaultTab: Tab = pendingHuman > 0 ? 'human' : pendingMand > 0 ? 'mand' : 'ocr';
  const [tab, setTab] = useState<Tab>(defaultTab);
  const [query, setQuery] = useState('');
  const [humanFilter, setHumanFilter] = useState<HumanFilter>('pending');
  const [mandFilter, setMandFilter] = useState<MandFilter>('pending');
  const [ocrFilter, setOcrFilter] = useState<OcrFilter>('all');
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [escrito, setEscrito] = useState<{ template: EscritoTemplate; causa: string } | null>(null);

  // FB-04: preparar borrador abre el editor tipo Word con la plantilla pre-cargada.
  function prepareBorrador(t: HumanTask) {
    resolveHumanTask(t.id);
    setEscrito({ template: escritoFor(t.kind) ?? escritos.blank, causa: t.causa });
    pushToast('ok', `Borrador de CRÉD·${t.causa} listo — la firma va por PJUD`);
  }

  function aprobarRectificacion(m: MandamientoReview) {
    approve(m.id);
    setEscrito({ template: escritos.rectifiquese, causa: m.causa });
    pushToast('ok', `“Rectifíquese” de CRÉD·${m.causa} preparado — la firma va por PJUD`);
  }

  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [tab, query, humanFilter, mandFilter, ocrFilter]);

  const q = query.trim().toLowerCase();

  const filteredHuman = useMemo(() => {
    return humanTasks.filter((t) => {
      if (humanFilter === 'pending' && t.resolved) return false;
      if (humanFilter === 'prepared' && !t.resolved) return false;
      if (!q) return true;
      return matchesQuery(t.causa, q) || matchesQuery(t.parties, q) || matchesQuery(t.kind, q);
    });
  }, [humanTasks, humanFilter, q]);

  const filteredMand = useMemo(() => {
    return mandamientos.filter((m) => {
      if (m.status !== 'diff') return false;
      if (mandFilter === 'pending' && m.resolved) return false;
      if (mandFilter === 'prepared' && !m.resolved) return false;
      if (!q) return true;
      return matchesQuery(m.causa, q) || matchesQuery(m.parties, q) || matchesQuery(m.financiera, q);
    });
  }, [mandamientos, mandFilter, q]);

  const filteredOcr = useMemo(() => {
    return review.filter((r) => {
      const min = minConfidence(r.fields);
      if (ocrFilter === 'critical' && min >= 75) return false;
      if (ocrFilter === 'doubtful' && (min < 75 || min >= 85)) return false;
      if (!q) return true;
      const fieldText = r.fields.map((f) => `${f.key} ${f.value}`).join(' ');
      return matchesQuery(r.causa, q) || matchesQuery(fieldText, q);
    });
  }, [review, ocrFilter, q]);

  const activeList = tab === 'human' ? filteredHuman : tab === 'mand' ? filteredMand : filteredOcr;
  const activeCount = activeList.length;
  const hasMore = visible < activeCount;

  const tabCounts = { human: pendingHuman, mand: pendingMand, ocr: pendingOcr };

  return (
    <>
      <div className="head">
        <div className="brand-row"><span className="dot"><Icon name="clipboard" /></span>Human-in-the-loop</div>
        <h1>Necesita tu revisión</h1>
        <div className="sub">
          {total > 0
            ? <>Hay <b>{total}</b> tareas pendientes. Usá las pestañas para filtrar por tipo — con ~3000 causas activas, buscá por crédito o nombre.</>
            : 'Ahora mismo no hay nada pendiente de tu revisión.'}
        </div>
      </div>

      <div className="tabs">
        {([
          ['human', 'Decisiones tuyas', tabCounts.human],
          ['mand', 'Mandamientos', tabCounts.mand],
          ['ocr', 'OCR', tabCounts.ocr],
        ] as const).map(([id, label, count]) => (
          <button
            key={id}
            className={`tab${tab === id ? ' active' : ''}`}
            onClick={() => setTab(id)}
          >
            {label} · {count}
          </button>
        ))}
      </div>

      <div className="ops-toolbar">
        {tab === 'human' && (
          <select className="filter-select" value={humanFilter} onChange={(e) => setHumanFilter(e.target.value as HumanFilter)}>
            <option value="pending">Pendientes · {humanTasks.filter((t) => !t.resolved).length}</option>
            <option value="prepared">Preparadas · {humanTasks.filter((t) => t.resolved).length}</option>
            <option value="all">Todas · {humanTasks.length}</option>
          </select>
        )}
        {tab === 'mand' && (
          <select className="filter-select" value={mandFilter} onChange={(e) => setMandFilter(e.target.value as MandFilter)}>
            <option value="pending">Con diferencias · {mandamientos.filter((m) => m.status === 'diff' && !m.resolved).length}</option>
            <option value="prepared">Rectificación preparada · {mandamientos.filter((m) => m.status === 'diff' && m.resolved).length}</option>
            <option value="all">Todas · {mandamientos.filter((m) => m.status === 'diff').length}</option>
          </select>
        )}
        {tab === 'ocr' && (
          <select className="filter-select" value={ocrFilter} onChange={(e) => setOcrFilter(e.target.value as OcrFilter)}>
            <option value="critical">Crítico (&lt;75%) · {review.filter((r) => minConfidence(r.fields) < 75).length}</option>
            <option value="doubtful">Dudoso (75–84%) · {review.filter((r) => { const m = minConfidence(r.fields); return m >= 75 && m < 85; }).length}</option>
            <option value="all">Todos · {review.length}</option>
          </select>
        )}
        <div className="search-box">
          <Icon name="search" />
          <input
            placeholder="Buscar por crédito, partes o campo…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="section" style={{ paddingTop: 8 }}>
        <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>{TAB_DESC[tab]}</div>

        {activeCount === 0 && (
          <Empty text={
            tab === 'human' ? 'Sin decisiones que calzen con el filtro.'
            : tab === 'mand' ? 'Sin mandamientos que calzen con el filtro.'
            : 'Sin campos OCR que calzen con el filtro.'
          } />
        )}

        {tab === 'human' && filteredHuman.slice(0, visible).map((t) => (
          <HumanCard key={t.id} t={t} onOpen={() => navigate(`/causas/${t.causa}`)}
            onResolve={() => prepareBorrador(t)} />
        ))}

        {tab === 'mand' && filteredMand.slice(0, visible).map((m) => (
          <MandCard key={m.id} m={m} onOpen={() => navigate(`/causas/${m.causa}`)}
            onApprove={() => aprobarRectificacion(m)} />
        ))}

        {tab === 'ocr' && filteredOcr.slice(0, visible).map((r) => (
          <OcrCard key={r.id} r={r} onOpen={() => navigate(`/causas/${r.causa}`)}
            onConfirm={() => { resolveReview(r.id); pushToast('ok', `CRÉD·${r.causa} confirmada · lista para promover`); }} />
        ))}

        {hasMore && (
          <div style={{ textAlign: 'center', padding: '18px 0 8px' }}>
            <button className="btn btn-ghost" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
              Cargar más ({activeCount - visible} restantes)
            </button>
          </div>
        )}

        {activeCount > 0 && (
          <div style={{ fontSize: 12.5, color: 'var(--muted-2)', textAlign: 'center', paddingTop: 8 }}>
            Mostrando {Math.min(visible, activeCount)} de {activeCount} en esta pestaña
          </div>
        )}
      </div>

      {escrito && (
        <EscritoEditor
          escritoId={`${escrito.causa}:${escrito.template.id}`}
          title={escrito.template.title}
          body={escrito.template.body}
          onClose={() => setEscrito(null)}
        />
      )}
    </>
  );
}

function HumanCard({ t, onOpen, onResolve }: { t: HumanTask; onOpen: () => void; onResolve: () => void }) {
  return (
    <div className="card">
      <div className="card-head">
        <span className="ic" style={{ background: t.resolved ? 'var(--green-soft)' : 'var(--red-soft)', color: t.resolved ? 'var(--green)' : 'var(--red)' }}>
          <Icon name={t.resolved ? 'check' : 'alert'} />
        </span>
        <div>
          <h3>CRÉD·{t.causa} · {t.parties}</h3>
          <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 2 }}>{t.kind} · {t.stage}</div>
        </div>
        {!t.resolved && (
          <span className="status-tag blocked" style={{ marginLeft: 'auto' }}><Icon name="clock" size={13} />{t.deadline}</span>
        )}
        {t.resolved && <span className="status-tag ready" style={{ marginLeft: 'auto' }}>Borrador preparado</span>}
      </div>
      <p style={{ fontSize: 14, color: 'var(--indigo)', margin: '2px 0 0', lineHeight: 1.5 }}>{t.detail}</p>
      <div className="qactions" style={{ marginTop: 14, justifyContent: 'flex-end' }}>
        <button className="btn btn-ghost btn-sm" onClick={onOpen}><Icon name="eye" />Abrir causa</button>
        {!t.resolved && (
          <button className="btn btn-primary btn-sm" onClick={onResolve}><Icon name="check" />Preparar borrador</button>
        )}
      </div>
    </div>
  );
}

function MandCard({ m, onOpen, onApprove }: { m: MandamientoReview; onOpen: () => void; onApprove: () => void }) {
  const isDiff = !m.resolved;
  return (
    <div className="card">
      <div className="card-head">
        <span className="ic" style={isDiff ? { background: 'var(--red-soft)', color: 'var(--red)' } : { background: 'var(--green-soft)', color: 'var(--green)' }}>
          <Icon name={isDiff ? 'alert' : 'check'} />
        </span>
        <div>
          <h3>CRÉD·{m.causa} · {m.parties}</h3>
          <div style={{ fontSize: 12.5, color: 'var(--muted)', marginTop: 2 }}>Financiera {m.financiera}</div>
        </div>
        <span className={`status-tag ${m.resolved ? 'neutral' : 'blocked'}`} style={{ marginLeft: 'auto' }}>
          {m.resolved ? 'Rectificación preparada' : 'Diferencias detectadas'}
        </span>
      </div>
      <div className="diff-table-head">
        <span>Campo</span><span>Demanda presentada</span><span>Mandamiento del tribunal</span>
      </div>
      {m.fields.map((f) => (
        <div key={f.key} className="diff-table-row">
          <span className="diff-key">{f.key}</span>
          <span className="diff-val">{f.demanda}</span>
          <span className={`diff-val${f.match ? '' : ' mismatch'}`}>
            {!f.match && <Icon name="alert" size={15} />}
            {f.mandamiento}
            {!f.match && <span className="status-tag blocked">no calza</span>}
          </span>
        </div>
      ))}
      <div className="qactions" style={{ marginTop: 14, justifyContent: 'flex-end' }}>
        <button className="btn btn-ghost btn-sm" onClick={onOpen}><Icon name="eye" />Abrir causa</button>
        {m.resolved ? (
          <span className="status-tag ready" style={{ alignSelf: 'center' }}>Lista para firmar por PJUD</span>
        ) : (
          <button className="btn btn-primary btn-sm" onClick={onApprove}><Icon name="check" />Aprobar “rectifíquese”</button>
        )}
      </div>
    </div>
  );
}

function OcrCard({ r, onOpen, onConfirm }: { r: ReviewItem; onOpen: () => void; onConfirm: () => void }) {
  return (
    <div className="card">
      <div className="card-head">
        <span className="ic"><Icon name="clipboard" /></span>
        <h3>CRÉD·{r.causa}</h3>
        <span className="count">{r.fields.filter((f) => f.confidence < 85).length} dudosos</span>
      </div>
      {r.fields.map((f) => (
        <div className="diff-field" key={f.key}>
          <span className="fk">{f.key}</span>
          <input className="input fv" defaultValue={f.value} style={{ width: '100%', color: f.confidence < 75 ? 'var(--amber)' : 'var(--indigo)' }} />
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="conf-bar"><i style={{ width: `${f.confidence}%`, background: confColor(f.confidence) }} /></span>
            <span style={{ fontSize: 12, fontWeight: 700, color: confColor(f.confidence), minWidth: 32 }}>{f.confidence}%</span>
          </span>
        </div>
      ))}
      <div className="qactions" style={{ marginTop: 14, justifyContent: 'flex-end' }}>
        <button className="btn btn-ghost btn-sm" onClick={onOpen}><Icon name="eye" />Ver PDF</button>
        <button className="btn btn-primary btn-sm" onClick={onConfirm}><Icon name="check" />Confirmar campos</button>
      </div>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="empty" style={{ padding: '22px 0' }}>
      <Icon name="check" />
      <div>{text}</div>
    </div>
  );
}
