import type { ReactNode } from 'react';
import { cn } from '../lib/cn';
import Folio from './Folio';

type Rhythm = 'statement' | 'evidence';

const rhythm: Record<Rhythm, string> = {
  statement: 'py-24 md:py-36',
  evidence: 'py-16 md:py-24',
};

interface SectionProps {
  id: string;
  /** Número de folio del movimiento. Se omite en nav y footer. */
  folio?: string;
  rhythm?: Rhythm;
  className?: string;
  /** Contenedor a ancho completo, sin el margen de foliación. */
  bleed?: boolean;
  children: ReactNode;
}

/**
 * Envoltorio de movimiento. Aporta el único contenedor de la página
 * (max-w-[76rem]) y el margen de foliación en lg+.
 */
export default function Section({
  id,
  folio,
  rhythm: r = 'evidence',
  className,
  bleed = false,
  children,
}: SectionProps) {
  return (
    <section id={id} className={cn('relative', rhythm[r], className)}>
      <div className={cn('mx-auto w-full px-6 sm:px-8 lg:px-10', bleed ? '' : 'max-w-[76rem]')}>
        {folio ? (
          <div className="lg:grid lg:grid-cols-[4rem_minmax(0,1fr)] lg:gap-8">
            <Folio value={folio} />
            <div className="min-w-0">{children}</div>
          </div>
        ) : (
          children
        )}
      </div>
    </section>
  );
}
