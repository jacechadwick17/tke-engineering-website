import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ArrowRight, Play } from 'lucide-react';
import { useHero } from '../hooks/useContent';

export function Hero() {
  const { hero, loading } = useHero();
  const heroRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loading) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 });

      tl.fromTo(
        overlayRef.current,
        { opacity: 1 },
        { opacity: 0.6, duration: 1, ease: 'power2.out' }
      )
        .fromTo(
          '.hero-title-line',
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' },
          '-=0.5'
        )
        .fromTo(
          '.hero-subtitle',
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
          '-=0.3'
        )
        .fromTo(
          '.hero-buttons',
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
          '-=0.3'
        );
    }, heroRef);

    return () => ctx.revert();
  }, [loading]);

  if (loading) {
    return (
      <section className="relative h-screen flex items-center justify-center bg-[#1a1a1a]">
        <div className="animate-pulse text-center">
          <div className="h-16 bg-white/10 rounded w-96 mx-auto mb-4"></div>
          <div className="h-6 bg-white/10 rounded w-64 mx-auto"></div>
        </div>
      </section>
    );
  }

  const heroData = hero || {
    backgroundImage: '/hero-bg.jpg',
    titleLine1: 'Design.',
    titleLine2: 'Build.',
    titleLine3: 'Deliver.',
    subtitle: 'Innovative engineering solutions for complex construction challenges. We transform visions into reality with precision and expertise.',
    ctaPrimary: 'Explore Our Services',
    ctaSecondary: 'View Projects',
  };

  return (
    <section
      ref={heroRef}
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroData.backgroundImage})` }}
      />

      {/* Dark Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black"
        style={{ opacity: 1 }}
      />

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6">
          <span className="hero-title-line block">{heroData.titleLine1}</span>
          <span className="hero-title-line block">{heroData.titleLine2}</span>
          <span className="hero-title-line block text-[#009966]">{heroData.titleLine3}</span>
        </h1>

        <p className="hero-subtitle text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10">
          {heroData.subtitle}
        </p>

        <div className="hero-buttons flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#services"
            className="group flex items-center gap-2 bg-[#009966] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#007a52] transition-all hover:scale-105"
          >
            {heroData.ctaPrimary}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#projects"
            className="group flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/20 transition-all border border-white/30"
          >
            <Play className="w-5 h-5" />
            {heroData.ctaSecondary}
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-white/70 rounded-full"></div>
        </div>
      </div>
    </section>
  );
}
