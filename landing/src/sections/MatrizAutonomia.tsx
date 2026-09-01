import { Ban, Check, PenLine } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { autonomia } from '../content';
import Section from '../ui/Section';
import Reveal from '../ui/Reveal';
import MovementHeader from '../ui/MovementHeader';
import { cn } from '../lib/cn';

// El icono acompaña al rótulo: el nivel nunca se comunica solo por color.
const iconos: LucideIcon[] = [Check, PenLine, Ban];

export default function MatrizAutonomia() {
  return (
    <Section id="autonomia" folio="06" rhythm="statement">
      <MovementHeader
        eyebrow={autonomia.eyebrow}
        title={autonomia.title}
        titleTail={autonomia.titleTail}
        lead={autonomia.lead}
      />

      <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-3">
        {autonomia.columnas.map((columna, i) => {
          const Icono = iconos[i] ?? Check;
          const esLimite = i === 2;
          return (
            <Reveal key={columna.nivel} delay={i * 60}>
              <div className={cn('flex h-full flex-col p-7', esLimite ? 'bg-ink-2' : 'bg-ink')}>
                <div className="flex items-center gap-2.5">
                  <Icono
                    size={15}
                    aria-hidden="true"
                    className={esLimite ? 'text-brass-hi' : 'text-muted'}
                  />
                  <p
                    className={cn(
                      'font-mono text-[0.6875rem] tracking-[0.16em] uppercase',
                      esLimite ? 'text-brass-hi' : 'text-muted',
                    )}
                  >
                    {columna.nivel}
                  </p>
                </div>
                <p className="mt-4 text-[0.9375rem] font-semibold text-cream">{columna.resumen}</p>
                <ul className="mt-5 flex flex-col gap-3">
                  {columna.items.map((item) => (
                    <li key={item} className="flex gap-3 text-sm text-muted">
                      <span
                        aria-hidden="true"
                        className={cn(
                          'mt-[0.4375rem] h-1 w-1 shrink-0 rounded-full',
                          esLimite ? 'bg-brass-hi' : 'bg-muted/50',
                        )}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          );
        })}
      </div>

      <Reveal delay={180}>
        <div className="mt-12 border-l-2 border-brass-hi pl-6 sm:pl-8">
          <p className="font-display text-[clamp(1.5rem,1.1rem+1.7vw,2.4rem)] leading-tight font-semibold text-cream">
            {autonomia.lineaRoja}
          </p>
          <p className="mt-4 max-w-2xl text-lead text-muted">{autonomia.lineaRojaDetalle}</p>
        </div>
      </Reveal>
    </Section>
  );
}
