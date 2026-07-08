import type { ReactNode } from 'react';
import Icon, { type IconName } from './Icon';

interface Props {
  title: string;
  icon?: IconName;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

export default function Modal({ title, icon = 'file', onClose, children, footer }: Props) {
  return (
    <div className="modal-back" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <span className="ic" style={{ width: 32, height: 32, borderRadius: 9, background: 'var(--violeta-ghost)', color: 'var(--violeta)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name={icon} size={17} />
          </span>
          <h3>{title}</h3>
          <button className="x" onClick={onClose} aria-label="Cerrar"><Icon name="x" size={18} /></button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  );
}
