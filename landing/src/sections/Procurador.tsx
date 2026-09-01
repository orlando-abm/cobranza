import { useEffect, useId, useRef, useState } from 'react';
import { ArrowRight, Check, PenLine } from 'lucide-react';
import { procurador } from '../content';
import Section from '../ui/Section';
import Reveal from '../ui/Reveal';
import Sheet from '../ui/Sheet';
import MovementHeader from '../ui/MovementHeader';
import { cn } from '../lib/cn';

const TICK = 1800;
const TIEMPOS = 3;

/** Rótulo de tiempo: ① Llega · ② El agente lee · ③ Sale. */
function Tiempo({ n, label, activo }: { n: number; label: string; activo: boolean }) {
  return (
    <p
      className={cn(
        'flex items-center gap-2 font-mono text-[0.6875rem] tracking-[0.16em] uppercase transition-colors duration-300',
        activo ? 'text-brass-hi' : 'text-muted/60',
      )}
    >
      <span
        className={cn(
          'grid h-5 w-5 place-items-center rounded-full border text-[0.625rem] tabular-nums transition-colors duration-300',
          activo ? 'border-brass-hi/60 text-brass-hi' : 'border-line-hi text-muted/60',
        )}
      >
        {n}
      </span>
      {label}
    </p>
  );
}

/**
 * El ciclo del procurador: llega una resolución del tribunal, el agente la lee y
 * sale un borrador de respuesta que la persona corrige o firma.
 *
 * Los tres tiempos se renderizan completos siempre; el ciclo solo mueve el
 * realce. Sin JavaScript se leen la resolución, la lectura y el borrador.
 */
export default function Procurador() {
  const base = useId();
  const [casoId, setCasoId] = useState<string>(procurador.casos[0].id);
  const [tiempo, setTiempo] = useState(TIEMPOS);
  const ref = useRef<HTMLDivElement>(null);

  const caso = procurador.casos.find((c) => c.id === casoId) ?? procurador.casos[0];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let timer: ReturnType<typeof setInterval> | undefined;

    const start = () => {
      if (timer) return;
      setTiempo(1);
      timer = setInterval(() => setTiempo((t) => (t >= TIEMPOS ? 1 : t + 1)), TICK);
    };

    const stop = () => {
      if (!timer) return;
      clearInterval(timer);
      timer = undefined;
    };

    const observer = new IntersectionObserver(
      (entries) => (entries[0]?.isIntersecting ? start() : stop()),
      { threshold: 0.2 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      stop();
    };
    // Al cambiar de caso el ciclo se reinicia desde el primer tiempo.
  }, [casoId]);

  return (
    <Section id="procurador" folio="03" rhythm="statement">
      <MovementHeader
        eyebrow={procurador.eyebrow}
        title={procurador.title}
        titleTail={procurador.titleTail}
        lead={procurador.lead}
      />

      <Reveal delay={60}>
        <div
          role="tablist"
          aria-label="Casos del procurador"
          className="mt-10 flex flex-wrap gap-2"
        >
          {procurador.casos.map((c) => {
            const seleccionado = c.id === casoId;
            return (
              <button
                key={c.id}
                type="button"
                role="tab"
                id={`${base}-tab-${c.id}`}
                aria-selected={seleccionado}
                aria-controls={`${base}-panel-${c.id}`}
                onClick={() => setCasoId(c.id)}
                className={cn(
                  'inline-flex min-h-11 cursor-pointer items-center rounded-full border px-5 text-sm transition-colors duration-200',
                  seleccionado
                    ? 'border-brass-hi/60 bg-surface/70 text-cream'
                    : 'border-line text-muted hover:border-line-hi hover:text-cream',
                )}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </Reveal>

      <div
        ref={ref}
        role="tabpanel"
        id={`${base}-panel-${caso.id}`}
        aria-labelledby={`${base}-tab-${caso.id}`}
        className="mt-8"
      >
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-start lg:gap-5">
          {/* ① Llega la resolución del tribunal.
              Las hojas nunca se atenúan: el papel apagado sobre navy se lee como
              un rectángulo sucio. El realce va en el rótulo y en el anillo. */}
          <Reveal>
            <div>
              <Tiempo n={1} label={procurador.tiempos[0]} activo={tiempo === 1} />
              <Sheet
                label={caso.entrada.label}
                folio={caso.entrada.folio}
                className={cn(
                  'mt-4 rotate-[-0.5deg] transition-shadow duration-500',
                  tiempo === 1 && 'ring-2 ring-brass-hi/45',
                )}
              >
                <p className="font-semibold uppercase">{caso.entrada.titulo}</p>
                {caso.entrada.lineas.map((linea) => (
                  <p key={linea} className="mt-4 text-justify">
                    {linea}
                  </p>
                ))}
              </Sheet>
            </div>
          </Reveal>

          <div aria-hidden="true" className="hidden self-center lg:block lg:pt-16">
            <ArrowRight
              size={20}
              className={cn(
                'transition-colors duration-500',
                tiempo >= 3 ? 'text-brass-hi' : 'text-muted/40',
              )}
            />
          </div>

          {/* ③ Sale el borrador ya armado */}
          <Reveal delay={120}>
            <div>
              <Tiempo n={3} label={procurador.tiempos[2]} activo={tiempo === 3} />
              <Sheet
                label={caso.salida.label}
                folio={caso.salida.folio}
                className={cn(
                  'mt-4 rotate-[0.4deg] transition-shadow duration-500',
                  tiempo === 3 && 'ring-2 ring-brass-hi/45',
                )}
              >
                <p className="font-semibold uppercase">{caso.salida.encabezado}</p>
                {caso.salida.lineas.map((linea) => (
                  <p key={linea} className="mt-4 text-justify">
                    {linea}
                  </p>
                ))}
                <p className="mt-6 text-[0.8125rem] text-ink-on-paper/60 italic">
                  {caso.salida.pie}
                </p>
              </Sheet>
            </div>
          </Reveal>
        </div>

        {/* ② La lectura del agente, entre el documento que entra y el que sale */}
        <Reveal delay={60}>
          <div
            className={cn(
              'mt-6 rounded-2xl border p-6 transition-colors duration-500 sm:p-7',
              tiempo === 2 ? 'border-brass-hi/30 bg-surface/30' : 'border-line bg-ink-2/60',
            )}
          >
            <Tiempo n={2} label={procurador.tiempos[1]} activo={tiempo === 2} />

            {/* La contraposición va en fila: el título del PJUD miente cerca del
                70% de las veces, y verlo al lado del contenido real es el punto. */}
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-line bg-ink/40 p-4">
                <p className="text-[0.625rem] tracking-wide text-muted/70 uppercase">
                  {caso.lectura.titulo}
                </p>
                <p
                  className={cn(
                    'mt-1.5 font-mono text-sm text-muted',
                    caso.lectura.tachaPrimero && 'line-through',
                  )}
                >
                  {caso.lectura.tituloValor}
                </p>
              </div>
              <div className="rounded-xl border border-brass-hi/30 bg-surface/40 p-4">
                <p className="text-[0.625rem] tracking-wide text-brass uppercase">
                  {caso.lectura.contenido}
                </p>
                <p className="mt-1.5 text-sm text-cream">{caso.lectura.contenidoValor}</p>
              </div>
            </div>

            <dl className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {caso.lectura.filas.map((f) => (
                <div key={f.campo}>
                  <dt className="font-mono text-[0.6875rem] tracking-wide text-muted uppercase">
                    {f.campo}
                  </dt>
                  <dd className="mt-1.5 text-[0.9375rem] text-cream">{f.valor}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-6 border-t border-line pt-5 text-[0.875rem] text-muted">
              {caso.lectura.alterno}
            </p>
          </div>
        </Reveal>

        {/* La barra humana: corregir o firmar. El agente no presenta solo. */}
        <Reveal delay={120}>
          <div className="mt-6 flex flex-col gap-5 rounded-2xl border border-brass-hi/25 bg-ink-2/60 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <div>
              <p className="font-mono text-[0.6875rem] tracking-[0.16em] text-brass-hi uppercase">
                {procurador.barra.estado}
              </p>
              <p className="mt-2 text-[0.9375rem] text-muted">{procurador.barra.nota}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <span className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line-hi px-5 text-sm text-cream">
                <PenLine size={14} aria-hidden="true" />
                {procurador.barra.corregir}
              </span>
              <span className="inline-flex min-h-11 items-center gap-2 rounded-full bg-brass px-5 text-sm font-semibold text-ink">
                <Check size={14} aria-hidden="true" />
                {procurador.barra.aprobar}
              </span>
            </div>
          </div>
        </Reveal>
      </div>

      <Reveal delay={180}>
        <p className="mt-12 max-w-3xl font-display text-[clamp(1.25rem,1rem+1.2vw,1.8rem)] leading-snug text-cream">
          {procurador.remate}
        </p>
      </Reveal>
    </Section>
  );
}
