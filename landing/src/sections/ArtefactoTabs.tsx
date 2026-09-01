import { useId, useState } from 'react';
import { causa } from '../content';
import Sheet from '../ui/Sheet';
import { cn } from '../lib/cn';

/**
 * Los documentos del hito, en pestañas: el correo de encargo, el estampado del
 * receptor y el escrito que genera el agente.
 *
 * Los tres paneles existen en el DOM; el inactivo se oculta con `hidden`, así
 * que sin JavaScript el primero sigue siendo legible. El cambio es un crossfade
 * en CSS, sin librería.
 */
export default function ArtefactoTabs() {
  const [activo, setActivo] = useState<string>(causa.artefactos.tabs[0].id);
  const base = useId();

  return (
    <div>
      <div role="tablist" aria-label={causa.artefactos.titulo} className="flex flex-wrap gap-2">
        {causa.artefactos.tabs.map((tab) => {
          const seleccionado = tab.id === activo;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`${base}-tab-${tab.id}`}
              aria-selected={seleccionado}
              aria-controls={`${base}-panel-${tab.id}`}
              onClick={() => setActivo(tab.id)}
              className={cn(
                'inline-flex min-h-11 cursor-pointer items-center rounded-full border px-4 text-sm transition-colors duration-200',
                seleccionado
                  ? 'border-brass-hi/60 bg-surface/70 text-cream'
                  : 'border-line text-muted hover:border-line-hi hover:text-cream',
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="relative mt-6">
        {causa.artefactos.tabs.map((tab) => {
          const seleccionado = tab.id === activo;
          return (
            <div
              key={tab.id}
              role="tabpanel"
              id={`${base}-panel-${tab.id}`}
              aria-labelledby={`${base}-tab-${tab.id}`}
              hidden={!seleccionado}
              className={cn(
                'transition-opacity duration-200 ease-[var(--ease-brand)]',
                seleccionado ? 'opacity-100' : 'opacity-0',
              )}
            >
              <Sheet label={tab.sheetLabel} folio={tab.folio}>
                {tab.lineas.map((linea, i) => (
                  <p
                    key={linea}
                    className={cn(
                      i > 0 && 'mt-4',
                      // La última línea de cada artefacto es la lectura del agente.
                      i === tab.lineas.length - 1 &&
                        'border-t border-paper-edge pt-4 text-[0.8125rem] text-ink-on-paper/70 italic',
                    )}
                  >
                    {linea}
                  </p>
                ))}
              </Sheet>
            </div>
          );
        })}
      </div>
    </div>
  );
}
