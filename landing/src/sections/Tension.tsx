import { tension } from '../content';
import Section from '../ui/Section';
import Reveal from '../ui/Reveal';
import Counter from '../ui/Counter';
import Spotlight from '../ui/Spotlight';
import MovementHeader from '../ui/MovementHeader';

export default function Tension() {
  return (
    <Section id="tension" folio="02" rhythm="statement">
      <MovementHeader
        eyebrow={tension.eyebrow}
        title={tension.title}
        titleTail={tension.titleTail}
        lead={tension.lead}
      />

      {/* Hairline grid: los separadores son el fondo asomando por los gaps. */}
      <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
        {tension.datos.map((dato, i) => (
          <Reveal key={dato.titulo} delay={i * 60}>
            <Spotlight className="h-full bg-ink">
              <div className="flex h-full flex-col p-6 sm:p-7">
                <p className="font-display text-[2.75rem] leading-none font-semibold text-brass-hi">
                  <Counter value={dato.cifra} suffix={dato.sufijo} />
                </p>
                <p className="mt-4 text-[0.9375rem] font-semibold text-cream">{dato.titulo}</p>
                <p className="mt-2.5 text-sm text-muted">{dato.detalle}</p>
              </div>
            </Spotlight>
          </Reveal>
        ))}
      </div>

      <Reveal delay={180}>
        <p className="mt-14 max-w-3xl font-display text-[clamp(1.35rem,1rem+1.4vw,2rem)] leading-snug text-cream">
          {tension.remate}
        </p>
      </Reveal>
    </Section>
  );
}
