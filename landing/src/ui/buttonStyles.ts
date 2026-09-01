import { cn } from '../lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'md' | 'lg';

/* Función pura en vez de CVA: permite aplicar estilos de botón a un <a> sin
   renderizar el componente. cursor-pointer explícito porque Tailwind 4 ya no
   lo aplica a <button>. */

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold ' +
  'cursor-pointer transition-[background-color,color,box-shadow,transform] duration-200 ' +
  'ease-[var(--ease-brand)] focus-visible:outline-2 focus-visible:outline-offset-3 ' +
  'focus-visible:outline-brass-hi disabled:cursor-not-allowed disabled:opacity-55';

const variants: Record<Variant, string> = {
  primary:
    'bg-brass text-ink shadow-[0_10px_30px_-14px_rgba(176,132,63,0.9)] ' +
    'hover:bg-brass-hi hover:shadow-[0_14px_36px_-14px_rgba(212,172,106,0.95)]',
  secondary: 'border border-line-hi text-cream hover:border-brass-hi hover:text-brass-hi',
  ghost: 'text-muted hover:text-cream',
};

const sizes: Record<Size, string> = {
  // min-h 44px: objetivo táctil mínimo.
  md: 'min-h-11 px-5 text-sm',
  lg: 'min-h-12 px-7 text-[0.9375rem]',
};

export function buttonStyles({
  variant = 'primary',
  size = 'md',
  className,
}: { variant?: Variant; size?: Size; className?: string } = {}) {
  return cn(base, variants[variant], sizes[size], className);
}
