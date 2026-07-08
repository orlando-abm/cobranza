import { useEffect, useRef } from 'react';
import Icon, { type IconName } from './Icon';
import { useAppStore } from '../store/useAppStore';

interface Props {
  escritoId: string;
  title: string;
  /** HTML inicial de la plantilla (se ignora si ya hay un borrador guardado). */
  body: string;
  onClose: () => void;
}

const fonts = ['Times New Roman', 'Arial'];
// execCommand('fontSize') usa la escala 1–7; mapeamos etiquetas legales a esa escala (mock).
const sizes = [
  { label: '10', v: '2' },
  { label: '11', v: '3' },
  { label: '12', v: '4' },
  { label: '14', v: '5' },
];

export default function EscritoEditor({ escritoId, title, body, onClose }: Props) {
  const saveEscritoDraft = useAppStore((s) => s.saveEscritoDraft);
  const savedDraft = useAppStore((s) => s.escritosDrafts[escritoId]);
  const pushToast = useAppStore((s) => s.pushToast);
  const editorRef = useRef<HTMLDivElement>(null);

  // Carga el contenido una sola vez al montar (borrador guardado o plantilla).
  useEffect(() => {
    if (editorRef.current) editorRef.current.innerHTML = savedDraft ?? body;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function cmd(command: string, value?: string) {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
  }

  function save() {
    const html = editorRef.current?.innerHTML ?? '';
    saveEscritoDraft(escritoId, html);
    pushToast('ok', 'Escrito guardado');
  }

  const ToolBtn = ({ command, value, icon, label }: { command: string; value?: string; icon: IconName; label: string }) => (
    <button
      className="tool-btn"
      title={label}
      aria-label={label}
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => cmd(command, value)}
    >
      <Icon name={icon} size={16} />
    </button>
  );

  return (
    <div className="escrito-back" onClick={onClose}>
      <div className="escrito-panel" onClick={(e) => e.stopPropagation()}>
        <div className="escrito-topbar">
          <div className="escrito-title"><Icon name="file" size={17} />{title}</div>
          <div className="escrito-top-actions">
            <button className="btn btn-primary btn-sm" onClick={save}><Icon name="check" />Guardar</button>
            <button className="btn btn-ghost btn-sm" onClick={() => pushToast('ok', 'Descargando Word… (.docx)')}><Icon name="file" />Word</button>
            <button className="btn btn-ghost btn-sm" onClick={() => pushToast('ok', 'Descargando PDF…')}><Icon name="file" />PDF</button>
            <button className="btn btn-ghost btn-sm" onClick={onClose}><Icon name="x" />Cerrar</button>
          </div>
        </div>

        <div className="escrito-ribbon" onMouseDown={(e) => { if ((e.target as HTMLElement).tagName !== 'SELECT') e.preventDefault(); }}>
          <select className="tool-select" defaultValue={fonts[0]} onChange={(e) => cmd('fontName', e.target.value)} title="Fuente">
            {fonts.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
          <select className="tool-select sm" defaultValue="4" onChange={(e) => cmd('fontSize', e.target.value)} title="Tamaño">
            {sizes.map((s) => <option key={s.v} value={s.v}>{s.label}</option>)}
          </select>
          <span className="tool-sep" />
          <ToolBtn command="bold" icon="bold" label="Negrita" />
          <ToolBtn command="italic" icon="italic" label="Cursiva" />
          <ToolBtn command="underline" icon="underline" label="Subrayado" />
          <span className="tool-sep" />
          <ToolBtn command="justifyLeft" icon="alignLeft" label="Alinear izquierda" />
          <ToolBtn command="justifyCenter" icon="alignCenter" label="Centrar" />
          <ToolBtn command="justifyRight" icon="alignRight" label="Alinear derecha" />
          <ToolBtn command="justifyFull" icon="alignJustify" label="Justificar" />
          <span className="tool-sep" />
          <ToolBtn command="insertOrderedList" icon="listOrdered" label="Lista numerada" />
          <ToolBtn command="insertUnorderedList" icon="listBullet" label="Viñetas" />
        </div>

        <div className="escrito-scroll">
          <div
            className="escrito-sheet"
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
