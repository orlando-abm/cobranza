/**
 * Número de folio del movimiento — elemento estructural de la landing.
 * Numerar solo se justifica cuando el contenido es una secuencia real, y aquí
 * lo es: el juicio ejecutivo tiene un orden legal obligatorio. Se rotula
 * "folio" porque es la palabra del oficio, no un adorno.
 *
 * En lg+ acompaña el scroll desde el margen izquierdo; en móvil va inline.
 */
export default function Folio({ value }: { value: string }) {
  return (
    <div className="mb-6 lg:sticky lg:top-32 lg:mb-0 lg:self-start">
      <div className="flex items-center gap-3 lg:flex-col lg:items-start lg:gap-2">
        <span className="font-mono text-[0.6875rem] tracking-[0.18em] text-muted/70 uppercase">
          Folio
        </span>
        <span
          className="font-mono text-lg text-brass-hi tabular-nums lg:text-2xl"
          aria-label={`Folio ${value}`}
        >
          {value}
        </span>
        <span aria-hidden="true" className="h-px w-8 bg-line-hi lg:mt-1 lg:w-6" />
      </div>
    </div>
  );
}
