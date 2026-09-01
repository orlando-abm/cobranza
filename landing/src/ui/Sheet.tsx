import type { ReactNode } from 'react';
import { cn } from '../lib/cn';

interface SheetProps {
  /** Rótulo del documento, en el borde superior de la hoja. */
  label: string;
  /** Foliación del documento dentro del expediente. */
  folio?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Hoja de papel — el elemento firma de la landing.
 *
 * Cada vez que aparece un documento real (demanda, estampado, mail de encargo,
 * escrito) se renderiza como papel marfil sobre el navy. El contraste
 * papel-sobre-tribunal es la identidad de la página: la sala es oscura, el
 * expediente es claro.
 *
 * El cuerpo usa --font-doc (Georgia/Times), que es el tipo real de los escritos
 * del producto: se cita el artefacto, no se lo estiliza.
 */
export default function Sheet({ label, folio, children, className }: SheetProps) {
  return (
    <article className={cn('sheet overflow-hidden', className)}>
      <div className="flex items-center justify-between gap-4 border-b border-paper-edge px-5 py-2.5 sm:px-7">
        <span className="font-mono text-[0.625rem] tracking-[0.16em] text-ink-on-paper/60 uppercase">
          {label}
        </span>
        {folio ? (
          <span className="font-mono text-[0.625rem] text-ink-on-paper/45 tabular-nums">
            f. {folio}
          </span>
        ) : null}
      </div>
      {/* Márgenes de escrito: generosos a los lados, como un documento judicial. */}
      <div className="px-5 py-6 font-[family-name:var(--font-doc)] text-[0.9375rem] leading-[1.75] sm:px-10 sm:py-8">
        {children}
      </div>
    </article>
  );
}
