import { useEffect, useRef, useState } from 'react';
import { Check, PenLine } from 'lucide-react';
import { procurador } from '../content';
import Sheet from '../ui/Sheet';
import { cn } from '../lib/cn';

const TICK = 1400;

/**
 * El procurador en el hero: la resolución que llegó del tribunal, lo que el
 * agente entendió de ella y el borrador de respuesta ya armado.
 *
 * Se renderiza con la lectura completa, así que sin JavaScript se lee un caso
 * resuelto en vez de un panel vacío. El realce por filas solo arranca si hay JS,
 * el bloque está en pantalla y el usuario no pidió menos movimiento.
 */
export default function ProcuradorVivo() {
  const caso = procurador.casos[0];
  const total: number = caso.lectura.filas.length;
  const [fila, setFila] = useState(total);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let timer: ReturnType<typeof setInterval> | undefined;

    const start = () => {
      if (timer) return;
      setFila(0);
      timer = setInterval(() => setFila((f) => (f >= total ? 0 : f + 1)), TICK);
    };

    const stop = () => {
      if (!timer) return;
      clearInterval(timer);
      timer = undefined;
    };

    const observer = new IntersectionObserver(
      (entries) => (entries[0]?.isIntersecting ? start() : stop()),
      { threshold: 0.25 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      stop();
    };
  }, [total]);

  const listo = fila >= total;

  return (
    <div ref={ref} className="relative">
      <Sheet label={caso.salida.label} folio={caso.salida.folio} className="rotate-[-0.6deg]">
        <p className="font-semibold uppercase">{caso.salida.encabezado}</p>
        {caso.salida.lineas.map((linea) => (
          <p key={linea} className="mt-4 text-justify">
            {linea}
          </p>
        ))}
        <p className="mt-6 text-[0.8125rem] text-ink-on-paper/60 italic">{caso.salida.pie}</p>
        {/* Aire al pie: el panel del agente se apoya encima y no debe tapar texto. */}
        <div aria-hidden="true" className="h-28 sm:h-32" />
      </Sheet>

      <div className="glass relative mt-[-6.5rem] ml-auto w-[min(100%,27rem)] rounded-2xl p-5 shadow-[0_40px_120px_-60px_rgba(0,0,0,0.9)] sm:mt-[-7.5rem] sm:mr-[-1rem]">
        <div className="flex items-center gap-3 border-b border-line pb-3">
          <span
            aria-hidden="true"
            className="h-2 w-2 shrink-0 animate-pulse-dot rounded-full bg-brass-hi"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-cream">Resolución interpretada</p>
            <p className="truncate font-mono text-[0.6875rem] text-muted">{caso.etapa}</p>
          </div>
          <span className="ml-auto shrink-0 rounded-full border border-brass-hi/50 px-2.5 py-1 font-mono text-[0.625rem] text-brass-hi uppercase">
            {caso.autonomia}
          </span>
        </div>

        {/* El título del PJUD miente ~70% de las veces: se lee el documento. */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-line bg-ink/40 p-3">
            <p className="text-[0.625rem] tracking-wide text-muted/70 uppercase">
              {caso.lectura.titulo}
            </p>
            <p
              className={cn(
                'mt-1.5 font-mono text-[0.8125rem] text-muted',
                caso.lectura.tachaPrimero && 'line-through',
              )}
            >
              {caso.lectura.tituloValor}
            </p>
          </div>
          <div className="rounded-xl border border-brass-hi/30 bg-surface/40 p-3">
            <p className="text-[0.625rem] tracking-wide text-brass uppercase">
              {caso.lectura.contenido}
            </p>
            <p className="mt-1.5 text-[0.8125rem] text-cream">{caso.lectura.contenidoValor}</p>
          </div>
        </div>

        <dl className="mt-4 flex flex-col gap-2.5">
          {caso.lectura.filas.map((f, i) => (
            <div
              key={f.campo}
              data-state={i < fila ? 'done' : 'pending'}
              className="flex gap-3 text-[0.8125rem] transition-opacity duration-300 data-[state=pending]:opacity-35"
            >
              <dt className="w-[6.5rem] shrink-0 font-mono text-[0.6875rem] text-muted uppercase">
                {f.campo}
              </dt>
              <dd className="min-w-0 flex-1 text-cream">{f.valor}</dd>
            </div>
          ))}
        </dl>

        {/* Barra humana: el agente entrega, la persona corrige o firma. */}
        <div
          className={cn(
            'mt-4 border-t border-line pt-4 transition-opacity duration-300',
            listo ? 'opacity-100' : 'opacity-35',
          )}
        >
          <p className="font-mono text-[0.6875rem] tracking-wide text-brass-hi uppercase">
            {procurador.barra.estado}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line-hi px-3 py-1.5 text-[0.8125rem] text-cream">
              <PenLine size={13} aria-hidden="true" />
              {procurador.barra.corregir}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brass px-3 py-1.5 text-[0.8125rem] font-semibold text-ink">
              <Check size={13} aria-hidden="true" />
              {procurador.barra.aprobar}
            </span>
          </div>
          <p className="mt-3 text-[0.75rem] text-muted">{procurador.barra.nota}</p>
        </div>
      </div>
    </div>
  );
}
