import { useCallback, useRef, type ReactNode } from 'react';
import { cn } from '../lib/cn';

/**
 * Tarjeta con halo que sigue al cursor. El gradiente vive en CSS (.spotlight);
 * aquí solo se escriben las coordenadas en --mx/--my.
 *
 * El listener es pasivo y throttleado a un frame: escribir estilos en cada
 * pointermove sin rAF provoca layout thrashing.
 */
export default function Spotlight({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  const onPointerMove = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || frame.current) return;
    const { clientX, clientY } = event;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const rect = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${clientX - rect.left}px`);
      el.style.setProperty('--my', `${clientY - rect.top}px`);
    });
  }, []);

  return (
    <div ref={ref} onPointerMove={onPointerMove} className={cn('spotlight relative', className)}>
      <div className="relative z-1">{children}</div>
    </div>
  );
}
