import { cn } from '../lib/cn';

/** Halo difuso fuera del viewport. Latón o navy, nunca saturado. */
export default function GlowBlob({
  tone = 'brass',
  className,
}: {
  tone?: 'brass' | 'navy';
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute rounded-full blur-[120px]',
        tone === 'brass' ? 'bg-brass/18' : 'bg-surface/40',
        className,
      )}
    />
  );
}
