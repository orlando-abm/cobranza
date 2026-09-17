import type { APIRoute } from 'astro';
import { INDEXABLE, abs } from '../lib/site';

export const GET: APIRoute = () => {
  const cuerpo = INDEXABLE
    ? `User-agent: *\nAllow: /\n\nSitemap: ${abs('/sitemap.xml')}\n`
    : `# Deploy de ensayo: no se indexa. El sitio oficial es https://kupera.cl\nUser-agent: *\nDisallow: /\n`;

  return new Response(cuerpo, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
