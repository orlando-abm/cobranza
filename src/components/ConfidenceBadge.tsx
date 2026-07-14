/** Confianza del agente en un documento generado/sugerido: verde ≥85, amarillo ≥75, rojo <75. */
export function confidenceTone(pct: number): 'green' | 'amber' | 'red' {
  return pct >= 85 ? 'green' : pct >= 75 ? 'amber' : 'red';
}

export default function ConfidenceBadge({ pct, label = 'confianza' }: { pct: number; label?: string }) {
  return (
    <span
      className={`conf-badge ${confidenceTone(pct)}`}
      title={`Confianza del agente en el documento generado: ${pct}%`}
    >
      <span className="conf-dot" />{pct}% {label}
    </span>
  );
}
