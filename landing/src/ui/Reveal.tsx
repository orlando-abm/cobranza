import { useEffect, useRef, type ElementType, type ReactNode } from 'react';
import { cn } from '../lib/cn';

interface RevealProps {
  children: ReactNode;
  /** Retardo del stagger en ms. 60 por ítem es el ritmo de la página. */
  delay?: number;
  as?: ElementType;
  className?: string;
}

/**
 * Aparición al hacer scroll, por mejora progresiva.
 *
 * El elemento se renderiza siempre visible; solo la regla `.js .reveal:not([data-revealed])`
 * lo oculta, y esa clase `js` entra desde un script inline en <head>. Sin JavaScript
 * el contenido queda legible — que es exactamente el bug que produce `whileInView`
 * de framer-motion y por el que no se usa aquí.
 */
export default function Reveal({ children, delay = 0, as: Tag = 'div', className }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Lo que ya está sobre el pliegue se muestra de inmediato. Dejarlo esperando
    // al observer hace que el contenido más importante de la página dependa de
    // un callback que quizá no llegue si el usuario nunca hace scroll.
    if (el.getBoundingClientRect().top < window.innerHeight) {
      el.setAttribute('data-revealed', '');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute('data-revealed', '');
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -12% 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={cn('reveal', className)}
      style={{ '--reveal-delay': `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}
