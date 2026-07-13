import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import { useAppStore } from '../store/useAppStore';

const chips = [
  { icon: 'image' as const, label: 'Cargar lote de Tanner (ZIP)', action: 'lote' },
  { icon: 'folders' as const, label: 'Cargar carpetas por deudor', action: 'lote' },
  { icon: 'plus' as const, label: 'Conectar con PROFIN', action: 'config' },
  { icon: 'info' as const, label: 'Configurar una financiera', action: 'config' },
];

export default function Welcome() {
  const navigate = useNavigate();
  const pushToast = useAppStore((s) => s.pushToast);
  const [value, setValue] = useState('');
  const [drag, setDrag] = useState(false);

  function submit() {
    const v = value.trim();
    if (!v) return navigate('/demandas');
    pushToast('info', `Procurador: "${v}" — abriendo tus causas para trabajarlo`);
    setValue('');
    setTimeout(() => navigate('/causas'), 700);
  }

  return (
    <div className="welcome">
      <div className="welcome-agent">
        <Icon name="message" />
      </div>
      <h1>Hola Cristóbal, soy tu procurador</h1>
      <p>
        Carga el lote de causas que te asignó la financiera y yo las leo, valido los
        documentos y te armo las demandas. ¿Con qué empezamos?
      </p>

      <div
        className={`welcome-input${drag ? ' drag' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); navigate('/demandas'); }}
      >
        <Icon name="message" size={20} style={{ color: 'var(--muted-2)' }} />
        <input
          placeholder="Pídeme algo, o arrastra aquí un ZIP con las causas…"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
        />
        <button className="btn btn-primary" onClick={submit}>
          <Icon name="arrowRight" />
        </button>
      </div>

      <div className="welcome-chips">
        {chips.map((c) => (
          <button
            key={c.label}
            className="chip"
            onClick={() => (c.action === 'lote' ? navigate('/demandas') : navigate('/config'))}
          >
            <Icon name={c.icon} />
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}
