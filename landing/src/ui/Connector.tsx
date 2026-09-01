/** Línea vertical que cose un movimiento con el siguiente. Decorativa. */
export default function Connector() {
  return (
    <div aria-hidden="true" className="flex justify-center">
      <div className="relative h-24 w-px bg-gradient-to-b from-transparent to-brass-hi/45">
        <span className="absolute -bottom-[3px] left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-brass-hi shadow-[0_0_12px_2px_rgba(212,172,106,0.35)]" />
      </div>
    </div>
  );
}
