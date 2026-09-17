import type { APIRoute } from 'astro';
import { INDEXABLE, abs } from '../lib/site';

export const GET: APIRoute = () => {
  // Un ensayo no publica sitemap: no hay nada que invitar a indexar.
  if (!INDEXABLE) return new Response(null, { status: 404 });

  const hoy = new Date().toISOString().slice(0, 10);
  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `  <url>\n    <loc>${abs('/')}</loc>\n    <lastmod>${hoy}</lastmod>\n  </url>\n` +
    `</urlset>\n`;

  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
