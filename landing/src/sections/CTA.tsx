import { useId, useState } from 'react';
import { cta, marca } from '../content';
import Section from '../ui/Section';
import Reveal from '../ui/Reveal';
import GlowBlob from '../ui/GlowBlob';
import GridBackdrop from '../ui/GridBackdrop';
import MovementHeader from '../ui/MovementHeader';
import { buttonStyles } from '../ui/buttonStyles';
import { cn } from '../lib/cn';

const inputBase =
  'min-h-11 w-full rounded-xl border border-line bg-ink px-4 text-[0.9375rem] text-cream ' +
  'placeholder:text-muted/60 transition-colors duration-200 focus:border-brass-hi focus:outline-none';

export default function CTA() {
  const id = useId();
  const [error, setError] = useState<string | null>(null);
  const [enviado, setEnviado] = useState(false);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const datos = new FormData(event.currentTarget);
    const faltante = ['nombre', 'estudio', 'email'].some(
      (campo) => !String(datos.get(campo) ?? '').trim(),
    );
    // Sin backend todavía: se valida y se dice la verdad, no se finge un envío.
    setError(faltante ? cta.early.requerido : null);
    setEnviado(!faltante);
  }

  return (
    <Section id="demo" folio="07" rhythm="statement" className="overflow-hidden">
      <GridBackdrop className="[mask-image:radial-gradient(70%_60%_at_50%_100%,#000,transparent)]" />
      <GlowBlob className="bottom-[-16rem] left-1/2 h-[30rem] w-[56rem] -translate-x-1/2" />

      <div className="relative">
        <MovementHeader
          eyebrow={cta.eyebrow}
          title={cta.title}
          titleTail={cta.titleTail}
          lead={cta.lead}
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <Reveal>
            <div className="flex h-full flex-col rounded-3xl border border-line bg-ink-2/60 p-7 sm:p-8">
              <h3 className="font-display text-2xl font-semibold text-cream">{cta.demo.titulo}</h3>
              <p className="mt-4 flex-1 text-[0.9375rem] text-muted">{cta.demo.detalle}</p>
              {/* Sin correo de contacto todavía: el botón lleva al formulario en
                  vez de apuntar a un mailto inventado. */}
              <a
                href={marca.contacto ? `mailto:${marca.contacto}` : `#${id}-nombre`}
                className={cn(buttonStyles({ size: 'lg' }), 'mt-7 w-full')}
              >
                {cta.demo.boton}
              </a>
            </div>
          </Reveal>

          <Reveal delay={60}>
            <div className="glass h-full rounded-3xl p-7 shadow-[0_40px_120px_-60px_rgba(0,0,0,0.9)] sm:p-8">
              <h3 className="font-display text-2xl font-semibold text-cream">{cta.early.titulo}</h3>
              <p className="mt-3 text-[0.9375rem] text-muted">{cta.early.detalle}</p>

              <form noValidate onSubmit={onSubmit} className="mt-7 grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor={`${id}-nombre`} className="text-[0.8125rem] text-muted">
                    {cta.early.campos.nombre}
                  </label>
                  <input id={`${id}-nombre`} name="nombre" className={cn(inputBase, 'mt-2')} />
                </div>
                <div>
                  <label htmlFor={`${id}-estudio`} className="text-[0.8125rem] text-muted">
                    {cta.early.campos.estudio}
                  </label>
                  <input id={`${id}-estudio`} name="estudio" className={cn(inputBase, 'mt-2')} />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor={`${id}-email`} className="text-[0.8125rem] text-muted">
                    {cta.early.campos.email}
                  </label>
                  <input
                    id={`${id}-email`}
                    name="email"
                    type="email"
                    className={cn(inputBase, 'mt-2')}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor={`${id}-cartera`} className="text-[0.8125rem] text-muted">
                    {cta.early.campos.cartera}
                  </label>
                  <select
                    id={`${id}-cartera`}
                    name="cartera"
                    className={cn(inputBase, 'mt-2 cursor-pointer')}
                  >
                    {cta.early.campos.carteraOpciones.map((opcion) => (
                      <option key={opcion} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <button type="submit" className={cn(buttonStyles({ size: 'lg' }), 'w-full')}>
                    {cta.early.boton}
                  </button>
                </div>
              </form>

              <p
                role="status"
                aria-live="polite"
                className={cn(
                  'mt-4 min-h-[1.25rem] text-[0.8125rem]',
                  error ? 'text-brass-hi' : 'text-muted',
                )}
              >
                {error ?? (enviado ? cta.early.pendiente : '')}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
