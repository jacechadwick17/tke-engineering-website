import { useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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

  // Ensure scroll triggers refresh when routes change
  useEffect(() => {
    ScrollTrigger.refresh();
  }, [currentRoute]);

  return (
    <div className="relative min-h-screen bg-[#0f0f0f]">
      <div className="noise-overlay" />
      
      <Navbar />
      
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
