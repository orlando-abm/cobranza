/**
 * Estado de publicación, derivado del `site` que resuelve astro.config.mjs.
 * Solo el dominio definitivo se indexa: cualquier otro host es un ensayo.
 */
export const SITE = new URL(import.meta.env.SITE ?? 'https://kupera.cl');

export const INDEXABLE = SITE.hostname === 'kupera.cl';

export const abs = (path: string) => new URL(path, SITE).toString();
