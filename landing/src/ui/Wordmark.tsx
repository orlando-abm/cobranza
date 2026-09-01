import { marca } from '../content';

/** Marca: la "K" en latón sobre navy, con el wordmark en display. */
export default function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <span
        aria-hidden="true"
        className="grid h-9 w-9 place-items-center rounded-[10px] bg-gradient-to-br from-brass to-brass-hi font-display text-lg font-semibold text-ink shadow-[0_4px_14px_rgba(176,132,63,0.35)]"
      >
        K
      </span>
      {compact ? null : (
        <span className="font-display text-[1.0625rem] font-semibold tracking-tight text-cream">
          {marca.nombre}
        </span>
      )}
    </span>
  );
}
