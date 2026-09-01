import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/**
 * Dominio del sitio, resuelto en tiempo de build.
 *
 * Las URL absolutas (canonical, Open Graph, JSON-LD, sitemap) no pueden quedar
 * fijas en kupera.cl: mientras el dominio no exista, un deploy en *.vercel.app
 * publicaría una og:image que no resuelve y el link se compartiría sin imagen.
 *
 * Orden de resolución:
 *   1. VITE_SITE_URL, si se define a mano.
 *   2. El dominio de producción del proyecto en Vercel. Al conectar kupera.cl
 *      pasa a ser kupera.cl solo, sin tocar nada acá.
 *   3. kupera.cl, para un build local.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.VITE_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, '');

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel.replace(/\/$/, '')}`;

  return 'https://kupera.cl';
}

const SITE_URL = resolveSiteUrl();
// Solo el dominio definitivo se indexa. Cualquier otro host es un ensayo y no
// debe competir en buscadores con el sitio real.
const INDEXABLE = new URL(SITE_URL).hostname === 'kupera.cl';

/** Reemplaza __SITE_URL__ y __ROBOTS_META__ en index.html, y emite robots.txt y sitemap.xml. */
function siteUrlPlugin() {
  return {
    name: 'kupera-site-url',

    transformIndexHtml(html: string) {
      return html
        .replaceAll('__SITE_URL__', SITE_URL)
        .replace(
          '__ROBOTS_META__',
          INDEXABLE ? '' : '<meta name="robots" content="noindex, nofollow" />',
        );
    },

    generateBundle(this: { emitFile: (f: Record<string, string>) => void }) {
      const robots = INDEXABLE
        ? `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`
        : `# Deploy de ensayo: no se indexa hasta que el sitio viva en kupera.cl.\nUser-agent: *\nDisallow: /\n`;

      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots });

      if (INDEXABLE) {
        this.emitFile({
          type: 'asset',
          fileName: 'sitemap.xml',
          source:
            `<?xml version="1.0" encoding="UTF-8"?>\n` +
            `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
            `  <url>\n` +
            `    <loc>${SITE_URL}/</loc>\n` +
            `    <changefreq>monthly</changefreq>\n` +
            `    <priority>1.0</priority>\n` +
            `  </url>\n` +
            `</urlset>\n`,
        });
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), siteUrlPlugin()],
  server: {
    // 5173 lo ocupa la app del producto; 5174 y 4321-4323, otros proyectos locales.
    port: 5180,
    strictPort: true,
  },
});
