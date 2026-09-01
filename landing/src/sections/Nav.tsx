import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { marca, nav } from '../content';
import { buttonStyles } from '../ui/buttonStyles';
import Wordmark from '../ui/Wordmark';
import { cn } from '../lib/cn';

/**
 * Nav flotante con píldora deslizante.
 *
 * La píldora se posiciona midiendo el <li> activo contra el <ul>, no con una
 * librería de animación: framer-motion costaba ~100 KB gzip para este único
 * efecto. Se mide contra el <ul> y no con offsetLeft porque el <a> vive dentro
 * del <li>. Se resincroniza al cambiar de sección, al redimensionar y cuando
 * terminan de cargar las fuentes (el ancho del texto cambia).
 */
export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);
  const [pill, setPill] = useState<{ x: number; w: number } | null>(null);

  const syncPill = useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    const item = list.querySelector<HTMLElement>('[data-active="true"]');
    if (!item) return setPill(null);
    const listBox = list.getBoundingClientRect();
    const itemBox = item.getBoundingClientRect();
    setPill({ x: itemBox.left - listBox.left, w: itemBox.width });
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sections = nav.links
      .map((l) => document.getElementById(l.href.slice(1)))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );

    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(syncPill, [active, syncPill]);

  useEffect(() => {
    window.addEventListener('resize', syncPill, { passive: true });
    document.fonts?.ready.then(syncPill);
    return () => window.removeEventListener('resize', syncPill);
  }, [syncPill]);

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-4 pt-4 sm:px-6">
      <nav
        aria-label="Principal"
        data-scrolled={scrolled ? '' : undefined}
        className={cn(
          'mx-auto flex max-w-[76rem] items-center gap-4 rounded-2xl px-4 py-2.5 transition-shadow duration-300',
          'data-scrolled:glass data-scrolled:shadow-[0_18px_50px_-24px_rgba(0,0,0,0.9)]',
        )}
      >
        <a href="#hero" className="shrink-0 rounded-lg" aria-label={marca.nombre}>
          <Wordmark />
        </a>

        {/* Con cinco enlaces el conjunto no cabe a 768: se muestran desde lg. */}
        <ul ref={listRef} className="relative ml-auto hidden items-center gap-1 lg:flex">
          <span
            aria-hidden="true"
            className={cn(
              'absolute inset-y-1 left-0 rounded-full border border-line-hi bg-surface/60',
              'transition-[transform,width,opacity] duration-300 ease-[var(--ease-brand)]',
              pill ? 'opacity-100' : 'opacity-0',
            )}
            style={pill ? { transform: `translateX(${pill.x}px)`, width: pill.w } : undefined}
          />
          {nav.links.map((link) => {
            const isActive = active === link.href.slice(1);
            return (
              <li key={link.href} data-active={isActive}>
                <a
                  href={link.href}
                  aria-current={isActive ? 'true' : undefined}
                  className={cn(
                    'relative inline-flex min-h-11 items-center rounded-full px-4 text-sm transition-colors duration-200',
                    isActive ? 'text-cream' : 'text-muted hover:text-cream',
                  )}
                >
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>

        <a
          href="#demo"
          className={cn(buttonStyles({ size: 'md' }), 'ml-auto hidden lg:ml-0 lg:inline-flex')}
        >
          {nav.cta}
        </a>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="nav-movil"
          aria-label={open ? nav.cerrarMenu : nav.abrirMenu}
          className="ml-auto inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl text-cream transition-colors duration-200 hover:bg-surface/60 lg:hidden"
        >
          {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        </button>
      </nav>

      {open ? (
        <div id="nav-movil" className="glass mx-auto mt-2 max-w-[76rem] rounded-2xl p-3 lg:hidden">
          <ul className="flex flex-col">
            {nav.links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-12 items-center rounded-xl px-4 text-sm text-muted transition-colors duration-200 hover:bg-surface/60 hover:text-cream"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#demo"
            onClick={() => setOpen(false)}
            className={cn(buttonStyles({ size: 'lg' }), 'mt-2 w-full')}
          >
            {nav.cta}
          </a>
        </div>
      ) : null}
    </header>
  );
}
