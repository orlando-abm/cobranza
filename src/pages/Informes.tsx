import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import Modal from '../components/Modal';
import { useAppStore } from '../store/useAppStore';
import { semaforo, recentItems } from '../data/mock';

const detenidas = [
  { causa: '645-233', parties: 'Rojas con OLX', reason: 'Rechazo del tribunal · sin movimiento 9 días', probable: 'Falta decidir reposición' },
  { causa: '450-118', parties: 'Díaz con OLX', reason: 'En admisibilidad · 16 días', probable: 'Esperando distribución de rol' },
];

export default function Informes() {
  const navigate = useNavigate();
  const pushToast = useAppStore((s) => s.pushToast);
  const [report, setReport] = useState(false);

  return (
    <>
      <div className="head">
        <div className="brand-row"><span className="dot"><Icon name="chart" /></span>Informes</div>
        <h1>Informe Semáforo</h1>
        <div className="sub">Métricas para la financiera y bandeja de causas detenidas con causa probable.</div>
      </div>

      <div className="section">
        <div className="card">
          <div className="card-head">
            <span className="ic"><Icon name="chart" /></span>
            <h3>Estado de la cartera</h3>
            <button className="btn btn-primary btn-sm" style={{ marginLeft: 'auto' }} onClick={() => setReport(true)}>
              <Icon name="file" />Generar informe
            </button>
          </div>
          <div className="semaforo">
            {semaforo.map((s) => (
              <div className={`sem-card ${s.k}`} key={s.lbl}>
                <div className="big">{s.big}</div>
                <div className="lbl">{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <span className="ic"><Icon name="alert" /></span>
            <h3>Causas detenidas</h3>
            <span className="count">{detenidas.length}</span>
          </div>
          {detenidas.map((d) => (
            <div className="queue-row" key={d.causa}>
              <div className="qbody">
                <div className="qt">CRÉD·{d.causa} · {d.parties}</div>
                <div className="qs">{d.reason} · <b style={{ color: 'var(--amber)' }}>{d.probable}</b></div>
              </div>
              <div className="qactions">
                <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/causas/${d.causa}`)}><Icon name="eye" />Abrir causa</button>
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-head">
            <span className="ic"><Icon name="activity" /></span>
            <h3>Actividad reciente</h3>
          </div>
          {recentItems.map((r) => (
            <div className="queue-row" key={r.id}>
              <span className="recent-dot" />
              <div className="qbody"><div className="qt">{r.title}</div><div className="qs">{r.sub}</div></div>
            </div>
          ))}
        </div>
      </div>

      {report && (
        <Modal title="Informe Semáforo · Junio 2026" icon="chart" onClose={() => setReport(false)}
          footer={<>
            <button className="btn btn-ghost" onClick={() => setReport(false)}>Cerrar</button>
            <button className="btn btn-primary" onClick={() => { pushToast('ok', 'Informe enviado a la financiera'); setReport(false); }}>
              <Icon name="mail" />Enviar a financiera
            </button>
          </>}>
          <div className="doc-preview">{`INFORME SEMÁFORO — ESTUDIO CID & ASOCIADOS
Período: Junio 2026 · Financiera: Tanner + OLX

Causas activas ............. 236
Embargos inscritos ......... 41%
Con excepciones ............ 5%
Deudores inubicables ....... 8%

Horas ahorradas por el agente: 47 h
Demandas listas para ingreso: 150

Detalle por financiera adjunto en el anexo.`}</div>
        </Modal>
      )}
    </>
  );
}
