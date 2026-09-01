import { causa } from '../content';
import Section from '../ui/Section';
import Reveal from '../ui/Reveal';
import MovementHeader from '../ui/MovementHeader';
import ArtefactoTabs from './ArtefactoTabs';
import { cn } from '../lib/cn';

/** Etiqueta de autonomía. Nunca comunica solo por color: siempre lleva el texto. */
function Autonomia({ valor }: { valor: string }) {
  const soloHumano = valor === 'SOLO HUMANO';
  const conAprobacion = valor.startsWith('CON APROBACIÓN');
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 font-mono text-[0.625rem] tracking-wide uppercase',
        soloHumano || conAprobacion
          ? 'border-brass-hi/50 text-brass-hi'
          : 'border-line-hi text-muted',
      )}
    >
      {valor}
    </span>
  );
}

export default function CausaDeEjemplo() {
  return (
    <Section id="causa" folio="04" rhythm="evidence">
      <MovementHeader
        eyebrow={causa.eyebrow}
        title={causa.title}
        titleTail={causa.titleTail}
        lead={causa.lead}
      />

      <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-16">
        {/* Timeline: la secuencia legal del juicio ejecutivo, hito por hito. */}
        <ol className="relative">
          <span
            aria-hidden="true"
            className="absolute top-2 bottom-2 left-[0.9375rem] w-px bg-gradient-to-b from-brass-hi/40 via-line-hi to-transparent"
          />
          {causa.hitos.map((hito, i) => (
            <Reveal key={hito.folio} delay={Math.min(i, 5) * 60} as="li" className="relative block">
              <div className="flex gap-5 pb-9">
                <span
                  aria-hidden="true"
                  className="relative z-1 mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-line-hi bg-ink font-mono text-[0.6875rem] text-brass-hi tabular-nums"
                >
                  {hito.folio}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <p className="font-mono text-[0.625rem] tracking-[0.14em] text-muted/70 uppercase">
                      {hito.etapa}
                    </p>
                    <Autonomia valor={hito.autonomia} />
                  </div>
                  <h3 className="mt-2 text-[1.0625rem] font-semibold text-cream">{hito.titulo}</h3>
                  <p className="mt-2 max-w-xl text-[0.9375rem] text-muted">{hito.detalle}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>

        {/* Los artefactos acompañan el recorrido, fijos en pantalla en desktop. */}
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Reveal>
            <p className="font-mono text-[0.6875rem] tracking-[0.18em] text-brass uppercase">
              {causa.artefactos.titulo}
            </p>
          </Reveal>
          <Reveal delay={60}>
            <div className="mt-5">
              <ArtefactoTabs />
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="mt-8 rounded-2xl border border-line bg-ink-2/60 p-6">
              <p className="text-sm font-semibold text-cream">{causa.resumen.titulo}</p>
              <ul className="mt-4 flex flex-col gap-2.5">
                {causa.resumen.items.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-muted">
                    <span
                      aria-hidden="true"
                      className="mt-[0.4375rem] h-1 w-1 shrink-0 rounded-full bg-brass-hi"
                    />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-5 border-t border-line pt-4 font-mono text-[0.6875rem] text-brass-hi">
                {causa.resumen.nota}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
