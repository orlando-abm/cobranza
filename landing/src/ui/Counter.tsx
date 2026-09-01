import { useEffect, useRef, useState } from 'react';

/**
 * Conteo animado. El valor final se renderiza de entrada y solo se anima si hay
 * JS y el usuario no pidió menos movimiento: nunca hay una cifra falsa en pantalla.
 */
export default function Counter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Si ya está en pantalla, se deja la cifra final: animarla obligaría a
    // mostrar primero el número correcto, saltar a cero y volver a subir.
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        observer.disconnect();

        const duration = 900;
        const start = performance.now();
        let raf = 0;

        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          // ease-out: rápido al entrar, se asienta al final.
          setShown(Math.round(value * (1 - (1 - t) ** 3)));
          if (t < 1) raf = requestAnimationFrame(tick);
        };

        setShown(0);
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
      },
      { rootMargin: '0px 0px -20% 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref} className="tabular-nums">
      {shown}
      {suffix}
    </span>
  );
}
