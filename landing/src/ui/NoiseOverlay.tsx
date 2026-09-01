/** Grano tenue sobre el navy: le da textura de papel a la sala. */
export default function NoiseOverlay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 noise opacity-[0.035] mix-blend-overlay"
    />
  );
}
