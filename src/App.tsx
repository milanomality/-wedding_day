import { useEffect } from 'react';
import { initSmoothScroll } from './lib/lenis';
import Hero from './components/Hero';
import Schedule from './components/Schedule';
import Gallery from './components/Gallery';
import Venues from './components/Venues';
import DressCode from './components/DressCode';
import Contacts from './components/Contacts';
import Rsvp from './components/Rsvp';
import Footer from './components/Footer';
import BackgroundBlobs from './components/BackgroundBlobs';

export default function App() {
  useEffect(() => {
    const cleanup = initSmoothScroll();
    return cleanup;
  }, []);

  return (
    <>
      <BackgroundBlobs />
      <Hero />
      <main>
        <Schedule />
        <Gallery />
        <Venues />
        <DressCode />
        <Contacts />
        <Rsvp />
      </main>
      <Footer />
    </>
  );
}
