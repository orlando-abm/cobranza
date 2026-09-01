import { hero } from '../content';
import Section from '../ui/Section';
import Reveal from '../ui/Reveal';
import GridBackdrop from '../ui/GridBackdrop';
import GlowBlob from '../ui/GlowBlob';
import ProcuradorVivo from './ProcuradorVivo';
import { buttonStyles } from '../ui/buttonStyles';
import { cn } from '../lib/cn';

export default function Hero() {
  return (
    <Section
      id="hero"
      rhythm="statement"
      className="overflow-hidden pt-28 pb-16 md:pt-32 md:pb-24"
    >
      <GridBackdrop />
      <GlowBlob className="top-[-18rem] left-1/2 h-[34rem] w-[64rem] -translate-x-1/2" />
      <GlowBlob tone="navy" className="top-[6rem] right-[-12rem] h-[28rem] w-[28rem]" />

      <div className="relative grid items-center gap-14 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:gap-16">
        <div>
          <Reveal>
            <p className="font-mono text-[0.6875rem] tracking-[0.18em] text-brass uppercase">
              {hero.eyebrow}
            </p>
          </Reveal>

          <Reveal delay={60}>
            <h1 className="mt-5 font-display text-display font-normal">
              {hero.title}{' '}
              <span className="font-semibold text-gradient-brass">{hero.titleTail}</span>
            </h1>
          </Reveal>

          <Reveal delay={120}>
            <p className="mt-7 max-w-xl text-lead text-muted">{hero.lead}</p>
          </Reveal>

          <Reveal delay={180}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a href="#demo" className={buttonStyles({ size: 'lg' })}>
                {hero.ctaPrimario}
              </a>
              <a href="#demo" className={buttonStyles({ variant: 'secondary', size: 'lg' })}>
                {hero.ctaSecundario}
              </a>
            </div>
          </Reveal>

          <Reveal delay={240}>
            <p className={cn('mt-6 max-w-md text-[0.8125rem] text-muted/80')}>{hero.nota}</p>
          </Reveal>
        </div>

        <Reveal delay={160}>
          <ProcuradorVivo />
        </Reveal>
      </div>
    </Section>
  );
}
