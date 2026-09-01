import { Clock } from 'lucide-react';
import { flujo } from '../content';
import Section from '../ui/Section';
import Reveal from '../ui/Reveal';
import Spotlight from '../ui/Spotlight';
import MovementHeader from '../ui/MovementHeader';

/**
 * Único lugar donde se usa el bento del MASTER: aquí el contenido sí es una
 * grilla de piezas comparables (tres etapas y cuatro relojes), no un argumento.
 */
export default function FlujoCompleto() {
  return (
    <Section id="flujo" folio="05" rhythm="evidence">
      <MovementHeader
        eyebrow={flujo.eyebrow}
        title={flujo.title}
        titleTail={flujo.titleTail}
        lead={flujo.lead}
      />

      <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-3">
        {flujo.etapas.map((etapa, i) => (
          <Reveal key={etapa.nombre} delay={i * 60}>
            <Spotlight className="h-full bg-ink">
              <div className="flex h-full flex-col p-7">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[0.6875rem] text-brass-hi tabular-nums">
                    {`0${i + 1}`}
                  </span>
                  <h3 className="font-display text-xl font-semibold text-cream">{etapa.nombre}</h3>
                </div>
                <p className="mt-4 flex-1 text-[0.9375rem] text-muted">{etapa.resumen}</p>
                <p className="mt-6 border-t border-line pt-4 font-mono text-[0.6875rem] tracking-wide text-brass-hi">
                  {etapa.gatillante}
                </p>
              </div>
            </Spotlight>
          </Reveal>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <Reveal>
          <div className="h-full rounded-2xl border border-line bg-ink-2/60 p-7">
            <div className="flex items-center gap-2.5">
              <Clock size={15} className="text-brass-hi" aria-hidden="true" />
              <p className="font-mono text-[0.6875rem] tracking-[0.18em] text-brass uppercase">
                Relojes de plazo
              </p>
            </div>
            <dl className="mt-6 grid gap-px overflow-hidden rounded-xl bg-line sm:grid-cols-2">
              {flujo.relojes.map((reloj) => (
                <div key={reloj.plazo} className="bg-ink-2 p-4">
                  <dt className="font-mono text-lg text-cream tabular-nums">{reloj.plazo}</dt>
                  <dd className="mt-1 text-[0.8125rem] text-muted">{reloj.desde}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>

        <Reveal delay={60}>
          <div className="h-full rounded-2xl border border-brass-hi/25 bg-surface/30 p-7">
            <h3 className="font-display text-lg font-semibold text-cream">
              {flujo.paralelo.titulo}
            </h3>
            <p className="mt-3 text-[0.9375rem] text-muted">{flujo.paralelo.detalle}</p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
