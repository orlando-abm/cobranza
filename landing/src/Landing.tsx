import Nav from './sections/Nav';
import Hero from './sections/Hero';
import Tension from './sections/Tension';
import Procurador from './sections/Procurador';
import CausaDeEjemplo from './sections/CausaDeEjemplo';
import FlujoCompleto from './sections/FlujoCompleto';
import MatrizAutonomia from './sections/MatrizAutonomia';
import CTA from './sections/CTA';
import Footer from './sections/Footer';
import Connector from './ui/Connector';
import NoiseOverlay from './ui/NoiseOverlay';
import { nav } from './content';

export default function Landing() {
  return (
    <>
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-full focus:bg-brass focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-ink"
      >
        {nav.saltarAlContenido}
      </a>

      <NoiseOverlay />
      <Nav />

      <main id="contenido">
        <Hero />
        <Connector />
        <Tension />
        <Connector />
        <Procurador />
        <CausaDeEjemplo />
        <FlujoCompleto />
        <Connector />
        <MatrizAutonomia />
        <CTA />
      </main>

      <Footer />
    </>
  );
}
