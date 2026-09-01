import { footer, marca } from '../content';
import Wordmark from '../ui/Wordmark';

export default function Footer() {
  return (
    <footer className="border-t border-line bg-ink-2/40">
      <div className="mx-auto max-w-[76rem] px-6 py-14 sm:px-8 lg:px-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.4fr)_repeat(2,minmax(0,0.8fr))]">
          <div>
            <Wordmark />
            <p className="mt-4 max-w-xs text-sm text-muted">{footer.descriptor}</p>
            <p className="mt-5 text-[0.8125rem] text-muted/70">{marca.venture}</p>
          </div>

          {footer.columnas.map((columna) => (
            <nav key={columna.titulo} aria-label={columna.titulo}>
              <p className="font-mono text-[0.6875rem] tracking-[0.16em] text-brass uppercase">
                {columna.titulo}
              </p>
              <ul className="mt-4 flex flex-col gap-2.5">
                {columna.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-muted transition-colors duration-200 hover:text-cream"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl text-[0.75rem] text-muted/70">{footer.nota}</p>
          <p className="font-mono text-[0.75rem] text-muted/70">{footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
