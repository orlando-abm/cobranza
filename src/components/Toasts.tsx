import Icon from './Icon';
import { useAppStore } from '../store/useAppStore';

export default function Toasts() {
  const toasts = useAppStore((s) => s.toasts);
  const dismiss = useAppStore((s) => s.dismissToast);
  if (!toasts.length) return null;
  return (
    <div className="toast-wrap">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.kind}`}>
          <Icon name={t.kind === 'ok' ? 'check' : 'info'} />
          <span>{t.text}</span>
          <button className="tclose" onClick={() => dismiss(t.id)} aria-label="Cerrar">
            <Icon name="x" size={15} />
          </button>
        </div>
      ))}
    </div>
  );
}
