// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

/**
 * Dominio del sitio, resuelto en tiempo de build.
 *
 * - Producción en Vercel → siempre https://kupera.cl, aunque el deploy también
 *   responda en *.vercel.app: el canonical consolida en el dominio real.
 * - Preview en Vercel → la URL del propio deploy, y la página sale con noindex
 *   para que un ensayo nunca compita con el sitio en buscadores.
 * - SITE_URL, si se define, manda sobre todo lo anterior.
 * - Build local → kupera.cl, para que los chequeos de publicación evalúen el
 *   sitio tal como saldrá a producción.
 */
function resolveSite() {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, '');
  if (process.env.VERCEL_ENV === 'preview' && process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'https://kupera.cl';
}

export default defineConfig({
  site: resolveSite(),
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  vite: {
    plugins: [tailwindcss()],
  },
});
