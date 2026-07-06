import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

import Navbar from './sections/Navbar';
import Hero from './sections/Hero';
import ServicesTriptych from './sections/ServicesTriptych';
import ServicesDetail from './sections/ServicesDetail';
import ModelShowcase from './sections/ModelShowcase';
import Projects from './sections/Projects';
import CareersContact from './sections/CareersContact';
import Footer from './sections/Footer';
import EmployeePortal from './sections/EmployeePortal';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const lenisRef = useRef<Lenis | null>(null);
  const [currentRoute, setCurrentRoute] = useState(window.location.hash);

  // Monitor URL changes to catch when an employee clicks the footer logo
  useEffect(() => {
    const handleHashChange = () => {
      setCurrentRoute(window.location.hash);
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    
    // Only run smooth scroll on the main site (not the portal)
    if (!isTouchDevice && currentRoute !== '#portal') {
      lenisRef.current = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
      });

      function raf(time: number) {
        lenisRef.current?.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);
      lenisRef.current.on('scroll', ScrollTrigger.update);

      gsap.ticker.add((time) => {
        lenisRef.current?.raf(time * 1000);
      });

      gsap.ticker.lagSmoothing(0);
    }

    return () => {
      lenisRef.current?.destroy();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [currentRoute]);

  return (
    <div className="relative min-h-screen bg-[#0f0f0f]">
      <div className="noise-overlay" />
      
      {/* Navbar always stays so they can click "Home" to leave */}
      <Navbar />
      
      {/* Switch between the Portal and the Main Site */}
      {currentRoute === '#portal' ? (
        <EmployeePortal />
      ) : (
        <>
          <main>
            <Hero />
            <ServicesTriptych />
            <ServicesDetail />
            <ModelShowcase />
            <Projects />
            <CareersContact />
          </main>
          <Footer />
        </>
      )}
    </div>
  );
}
