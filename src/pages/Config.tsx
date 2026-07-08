import { useState } from 'react';
import Icon from '../components/Icon';
import { useAppStore } from '../store/useAppStore';
import { financieras as seedFinancieras, receptores as seedReceptores } from '../data/mock';

export default function Config() {
  const pushToast = useAppStore((s) => s.pushToast);
  const [financieras, setFinancieras] = useState(seedFinancieras);
  const [receptores, setReceptores] = useState(seedReceptores);

  const toggleFin = (id: string) =>
    setFinancieras((f) => f.map((x) => (x.id === id ? { ...x, active: !x.active } : x)));
  const toggleRec = (id: string) =>
    setReceptores((r) => r.map((x) => (x.id === id ? { ...x, active: !x.active } : x)));

  return (
    <>
      <div className="head">
        <div className="brand-row"><span className="dot"><Icon name="settings" /></span>Configuración</div>
        <h1>Pautas y receptores</h1>
        <div className="sub">Cada financiera define su modalidad, intentos, política CAV y umbral de OCR.</div>
      </div>

      <div className="section">
        <div className="card">
          <div className="card-head">
            <span className="ic"><Icon name="building" /></span>
            <h3>Pautas por financiera</h3>
            <button className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }} onClick={() => pushToast('info', 'Formulario de nueva financiera (demo)')}><Icon name="plus" />Nueva</button>
          </div>
          {financieras.map((f) => (
            <div className="card" key={f.id} style={{ boxShadow: 'none', marginBottom: 12, background: 'var(--paper)' }}>
              <div className="form-row">
                <div>
                  <div className="fl" style={{ fontSize: 15, fontWeight: 700, color: 'var(--indigo)' }}>{f.name}</div>
                  <div className="fd">{f.modalidad}</div>
                </div>
                <div className="toggle-wrap" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span className={`status-tag ${f.active ? 'ready' : 'blocked'}`}>{f.active ? 'Activa' : 'Inactiva'}</span>
                  <button className={`toggle${f.active ? ' on' : ''}`} onClick={() => toggleFin(f.id)} aria-label="Activar" />
                </div>
              </div>
              <div className="form-row">
                <div><div className="fl">Intentos de notificación</div><div className="fd">Alerta al acercarse al límite</div></div>
                <input className="input" type="number" defaultValue={f.intentos} style={{ width: 80 }} />
              </div>
              <div className="form-row">
                <div><div className="fl">Política CAV</div></div>
                <input className="input" defaultValue={f.cavPolicy} style={{ minWidth: 260 }} />
              </div>
              <div className="form-row">
                <div><div className="fl">Umbral OCR</div><div className="fd">Bajo este %, va a revisión manual</div></div>
                <input className="input" type="number" defaultValue={f.umbral} style={{ width: 80 }} />
              </div>
            </div>
          ))}
          <button className="btn btn-primary" onClick={() => pushToast('ok', 'Pautas guardadas')}><Icon name="check" />Guardar pautas</button>
        </div>

        <div className="card">
          <div className="card-head">
            <span className="ic"><Icon name="users" /></span>
            <h3>Base de receptores</h3>
            <button className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }} onClick={() => pushToast('info', 'Alta de receptor (demo)')}><Icon name="plus" />Alta</button>
          </div>
          {receptores.map((r) => (
            <div className="queue-row" key={r.id}>
              <span className="rail-avatar" style={{ borderRadius: 10, background: 'var(--violeta-ghost)', color: 'var(--violeta)' }}>
                {r.name.split(' ').map((p) => p[0]).join('').slice(0, 2)}
              </span>
              <div className="qbody">
                <div className="qt">{r.name}</div>
                <div className="qs">{r.zone} · Tarifa {r.fee}</div>
              </div>
              <div className="qactions" style={{ alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className="conf-bar" style={{ width: 56 }}><i style={{ width: `${r.performance}%`, background: 'var(--green)' }} /></span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--green)' }}>{r.performance}%</span>
                </span>
                <button className={`toggle${r.active ? ' on' : ''}`} onClick={() => toggleRec(r.id)} aria-label="Activar" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
