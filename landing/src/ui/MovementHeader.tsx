import Reveal from './Reveal';
import { cn } from '../lib/cn';

interface MovementHeaderProps {
  eyebrow: string;
  title: string;
  /** Se resalta en latón el remate de la frase. */
  titleTail?: string;
  lead?: string;
  align?: 'left' | 'center';
  className?: string;
}

export default function MovementHeader({
  eyebrow,
  title,
  titleTail,
  lead,
  align = 'left',
  className,
}: MovementHeaderProps) {
  return (
    <header className={cn(align === 'center' && 'mx-auto max-w-3xl text-center', className)}>
      <Reveal>
        <p className="font-mono text-[0.6875rem] tracking-[0.18em] text-brass uppercase">
          {eyebrow}
        </p>
      </Reveal>
      <Reveal delay={60}>
        <h2 className="mt-4 font-display text-title font-semibold">
          {title}
          {titleTail ? <span className="text-gradient-brass"> {titleTail}</span> : null}
        </h2>
      </Reveal>
      {lead ? (
        <Reveal delay={120}>
          <p
            className={cn(
              'mt-5 text-lead text-muted',
              align === 'center' ? 'mx-auto max-w-2xl' : 'max-w-2xl',
            )}
          >
            {lead}
          </p>
        </Reveal>
      ) : null}
    </header>
  );
}
