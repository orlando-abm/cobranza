/**
 * Chequeo de publicación contra los criterios de Google for Startups.
 *
 * Revisa el sitio YA CONSTRUIDO (dist/), que es lo que ve un revisor, y agrupa
 * los resultados por criterio de rechazo:
 *   1. Dominio inaccesible o de ensayo
 *   2. Producto incompleto (solo marketing, lista de espera, sin interfaz real)
 *   3. Falta de transparencia operativa (fundadores y equipo verificables)
 * más las reglas duras del proyecto (sin voseo, sin hitos de cobro).
 *
 * Si el build apunta a kupera.cl, cualquier falla detiene el build: un sitio
 * que no cumple no llega a producción. En un deploy de ensayo solo advierte.
 *
 * Uso: node scripts/check-publicacion.mjs
 */
import { readFileSync, existsSync } from 'node:fs';

const DOMINIO = 'https://kupera.cl/';
const APP = 'https://app.kupera.cl';

const leer = (ruta) => (existsSync(ruta) ? readFileSync(ruta, 'utf8') : '');
const html = leer('dist/index.html');
const robots = leer('dist/robots.txt');
const sitemap = leer('dist/sitemap.xml');

if (!html) {
  console.error('✗ No existe dist/index.html. Corre el build de Astro antes de este chequeo.');
  process.exit(1);
}

const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1] ?? '';
const produccion = canonical === DOMINIO;

// Texto que ve una persona o un rastreador sin ejecutar JavaScript.
const visible = html
  .replace(/<script[\s\S]*?<\/script>/g, ' ')
  .replace(/<style[\s\S]*?<\/style>/g, ' ')
  .replace(/<noscript>[\s\S]*?<\/noscript>/g, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&[a-z#0-9]+;/gi, ' ')
  .replace(/\s+/g, ' ')
  .trim();
const palabras = visible.split(' ').filter(Boolean).length;

// Se buscan como palabras completas: "beta" no debe calzar dentro de otra palabra.
const PROHIBIDAS = [
  'acceso anticipado',
  'lista de espera',
  'early access',
  'waitlist',
  'beta',
  'próximamente',
  'en construcción',
  'no está habilitado',
  '[pendiente]',
  'pendiente de asignar',
  'lorem ipsum',
];

// Imperativos y formas del voseo rioplatense (regla dura de CLAUDE.md).
const VOSEO = /\b(podés|querés|tenés|debés|hacés|sabés|vos|arrastrá|pedile|corregí|decime|revisá|elegí|buscá|validá|dejá|mirá|andá|entrá|escribinos|contactanos|agendá)\b/i;
const escapar = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const prohibidasEncontradas = PROHIBIDAS.filter((p) =>
  new RegExp(`(^|[^\\p{L}])${escapar(p)}([^\\p{L}]|$)`, 'iu').test(visible),
);

// Enlaces del equipo: cada <a> marcado con data-linkedin debe ir a un perfil real.
const enlacesEquipo = [...html.matchAll(/<a\b[^>]*\bdata-linkedin\b[^>]*>/g)].map((m) => m[0]);
const linkedinValido = enlacesEquipo.some((a) => /href="https:\/\/(www\.)?linkedin\.com\/in\/[^"/]+\/?"/.test(a));

const RUT = /\b\d{1,2}\.?\d{3}\.?\d{3}-[\dkK]\b/;

const grupos = [
  {
    titulo: '1 · Dominio accesible y no de ensayo',
    reglas: [
      ['El canonical apunta a kupera.cl', canonical === DOMINIO, `canonical: ${canonical || '(ninguno)'}`],
      ['La página no declara noindex', !/<meta name="robots" content="[^"]*noindex/.test(html)],
      ['robots.txt permite indexar', /Allow: \//.test(robots) && !/Disallow: \/\s*$/m.test(robots)],
      ['sitemap.xml publica kupera.cl', sitemap.includes(`<loc>${DOMINIO}</loc>`)],
      ['Ninguna URL apunta a *.vercel.app', !/[a-z0-9-]+\.vercel\.app/.test(html)],
    ],
  },
  {
    titulo: '2 · Producto real, no solo marketing',
    reglas: [
      ['Enlace al producto en app.kupera.cl', html.includes(`href="${APP}"`)],
      ['Al menos una captura real del panel', /data-captura/.test(html)],
      [
        'Sin lenguaje de lista de espera, beta o marcadores',
        prohibidasEncontradas.length === 0,
        `encontradas: ${prohibidasEncontradas.join(', ')}`,
      ],
      ['Sin formularios que no envían', !/<form[\s>]/.test(html)],
      ['Contenido legible sin JavaScript (≥ 600 palabras)', palabras >= 600, `${palabras} palabras`],
    ],
  },
  {
    titulo: '3 · Transparencia operativa',
    reglas: [
      ['Fundador con perfil de LinkedIn enlazado', linkedinValido],
      ['Correo de contacto publicado', /href="mailto:[^"@]+@[^"]+"/.test(html)],
      ['Razón social publicada', /data-legal[\s\S]*Razón social:/.test(html)],
      ['Enlace al venture studio', html.includes('href="https://www.prodbooster.com"')],
    ],
  },
  {
    // El skill seo-aeo-best-practices: pares pregunta-respuesta visibles son el
    // formato que mejor extraen los buscadores y los asistentes de IA.
    titulo: 'Legibilidad para buscadores y asistentes',
    reglas: [
      ['Preguntas frecuentes visibles en el HTML', (html.match(/<summary\b/g) ?? []).length >= 5],
      ['FAQPage declarado', /"@type":"FAQPage"/.test(html)],
      [
        'Cada pregunta del marcado existe en la página',
        (() => {
          const m = html.match(/"@type":"Question","name":"([^"]+)"/g) ?? [];
          return m.length > 0 && m.every((q) => visible.includes(q.split('"name":"')[1].slice(0, -1)));
        })(),
      ],
      ['Señal de frescura (dateModified)', /"dateModified"/.test(html)],
    ],
  },
  {
    titulo: 'Reglas del proyecto',
    reglas: [
      ['Sin voseo', !VOSEO.test(visible), visible.match(VOSEO)?.[0] ?? ''],
      ['Sin hitos ni porcentajes de cobro', !/hito[s]? de (cobro|facturaci)/i.test(visible)],
      ['Un solo h1', (html.match(/<h1[\s>]/g) ?? []).length === 1],
      [
        'Sin texto pegado a un enlace',
        !/[a-záéíóúñ]<a[\s>]/i.test(html),
        (html.match(/.{12}[a-záéíóúñ]<a[\s>]/i) ?? [''])[0],
      ],
    ],
  },
];

const opcionales = [
  ['RUT publicado', /data-legal/.test(html) && RUT.test(visible)],
  ['Domicilio publicado', /data-legal[\s\S]*Domicilio:/.test(html)],
];

let fallas = 0;
console.log(`\nChequeo de publicación · ${produccion ? 'PRODUCCIÓN (kupera.cl)' : 'ensayo'}\n`);

for (const grupo of grupos) {
  console.log(grupo.titulo);
  for (const [nombre, ok, detalle] of grupo.reglas) {
    if (!ok) fallas += 1;
    console.log(`  ${ok ? '✓' : '✗'} ${nombre}${!ok && detalle ? `  (${detalle})` : ''}`);
  }
  console.log('');
}

console.log('Opcionales (no bloquean la publicación)');
for (const [nombre, ok] of opcionales) console.log(`  ${ok ? '✓' : '·'} ${nombre}`);
console.log('');

if (fallas === 0) {
  console.log('Cumple todos los criterios.\n');
  process.exit(0);
}

if (produccion) {
  console.error(`${fallas} criterio(s) sin cumplir. No se publica a producción.\n`);
  process.exit(1);
}

console.warn(`${fallas} criterio(s) sin cumplir. Es un deploy de ensayo: se permite, pero no postules con él.\n`);
process.exit(0);
