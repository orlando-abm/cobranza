import { cn } from '../lib/cn';

/** Retícula de 72px con máscara radial. Evoca el pautado de un formulario judicial. */
export default function GridBackdrop({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 grid-lines',
        '[mask-image:radial-gradient(70%_55%_at_50%_0%,#000,transparent)]',
        className,
      )}
    />
  );
}
