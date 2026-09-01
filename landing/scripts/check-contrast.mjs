/**
 * Verifica los pares texto/fondo de la landing de Kupera contra WCAG AA (4.5:1).
 * Corre dentro de `npm run build` y lo detiene si un par baja de norma.
 * Los tokens deben coincidir con el bloque @theme de src/styles/landing.css.
 *
 * Uso: node scripts/check-contrast.mjs
 */

const tokens = {
  ink: '#0A1826',
  ink2: '#0E2540',
  surface: '#16344F',
  paper: '#F6F3EC',
  paperEdge: '#E5E0D5',
  inkOnPaper: '#12212E',
  cream: '#F6F3EC',
  muted: '#9FB0C4',
  brass: '#B0843F',
  brassHi: '#D4AC6A',
  white: '#FFFFFF',
};

const channel = (value) => {
  const c = value / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};

const luminance = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
};

const ratio = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

// [etiqueta, texto, fondo, debeCumplir]
const pairs = [
  ['Texto principal sobre fondo', tokens.cream, tokens.ink, true],
  ['Texto principal sobre superficie elevada', tokens.cream, tokens.ink2, true],
  ['Texto principal sobre tarjeta', tokens.cream, tokens.surface, true],
  ['Texto secundario sobre fondo', tokens.muted, tokens.ink, true],
  ['Texto secundario sobre superficie elevada', tokens.muted, tokens.ink2, true],
  ['Texto secundario sobre tarjeta', tokens.muted, tokens.surface, true],
  ['Latón claro sobre fondo', tokens.brassHi, tokens.ink, true],
  ['Latón claro sobre tarjeta', tokens.brassHi, tokens.surface, true],
  ['Latón base sobre fondo', tokens.brass, tokens.ink, true],
  ['Texto del documento sobre papel', tokens.inkOnPaper, tokens.paper, true],
  ['Texto del documento sobre borde de papel', tokens.inkOnPaper, tokens.paperEdge, true],
  ['Texto del CTA primario sobre latón', tokens.ink, tokens.brass, true],
  // Casos negativos: si alguno empieza a cumplir, hay que revisar la paleta a mano.
  ['Latón base sobre tarjeta (prohibido como texto)', tokens.brass, tokens.surface, false],
  ['Blanco sobre papel (prohibido)', tokens.white, tokens.paper, false],
];

let failures = 0;

for (const [label, fg, bg, mustPass] of pairs) {
  const value = ratio(fg, bg);
  const passes = value >= 4.5;
  const ok = passes === mustPass;
  if (!ok) failures += 1;
  const verdict = mustPass ? (passes ? 'OK' : 'FALLA') : passes ? 'INESPERADO' : 'OK (excluido)';
  console.log(`${ok ? '✓' : '✗'} ${value.toFixed(2).padStart(5)}:1  ${label} — ${verdict}`);
}

console.log(
  failures === 0
    ? '\nTodos los pares cumplen lo esperado (WCAG AA 4.5:1).'
    : `\n${failures} par(es) fuera de norma.`,
);

process.exit(failures === 0 ? 0 : 1);
