import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown } from 'lucide-react';
import { useHero } from '@/hooks/useContent';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const { hero, loading } = useHero();

  useEffect(() => {
    if (loading || !hero) return;

    const ctx = gsap.context(() => {
      // Parallax effect on image
      gsap.to(imageRef.current, {
        yPercent: 30,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Content fade and blur on scroll
      gsap.to(contentRef.current, {
        opacity: 0,
        filter: 'blur(10px)',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '50% top',
          scrub: true,
        },
      });

      // Title entrance animation
      gsap.fromTo(
        titleRef.current,
        { rotateX: 90, opacity: 0, transformOrigin: 'center bottom' },
        { rotateX: 0, opacity: 1, duration: 1.2, ease: 'expo.out', delay: 0.5 }
      );

      // Subtitle entrance
      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 1 }
      );

      // Overlay gradient animation
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.5, ease: 'power2.out' }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [loading, hero]);

  const scrollToServices = () => {
    const servicesSection = document.querySelector('#services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading || !hero) {
    return (
      <section
        id="home"
        ref={sectionRef}
        className="relative h-screen w-full overflow-hidden bg-[#0f0f0f]"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-pulse text-white/20">Loading...</div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden"
    >
      {/* Background Image with Parallax */}
      <div
        ref={imageRef}
        className="absolute inset-0 w-full h-[120%] -top-[10%]"
      >
        <img
          src={hero.backgroundImage}
          alt="Hero background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Dark Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-gradient-to-b from-[#0f0f0f]/60 via-[#0f0f0f]/40 to-[#0f0f0f]"
      />

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 h-full flex flex-col items-center justify-center px-4 md:px-8"
      >
        <div className="text-center max-w-5xl mx-auto">
          {/* Main Title */}
          <h1
            ref={titleRef}
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight"
            style={{ perspective: '1000px' }}
          >
            <span className="block">{hero.titleLine1}</span>
            <span className="block text-[#009966]">{hero.titleLine2}</span>
          </h1>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="text-lg md:text-xl lg:text-2xl text-[#e0e0e0] max-w-3xl mx-auto mb-10 font-light"
          >
            {hero.subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={hero.cta1Link}
              onClick={(e) => {
                e.preventDefault();
                document.querySelector(hero.cta1Link)?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn-primary text-center"
            >
              {hero.cta1Text}
            </a>
            <a
              href={hero.cta2Link}
              onClick={(e) => {
                e.preventDefault();
                document.querySelector(hero.cta2Link)?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 border border-white/30 text-white font-semibold rounded transition-all duration-300 hover:bg-white/10 hover:border-white/50"
            >
              {hero.cta2Text}
            </a>
          </div>
        </div>

        {/* Scroll Indicator */}
        <button
          onClick={scrollToServices}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/60 hover:text-white transition-colors duration-300 animate-bounce"
          aria-label="Scroll down"
        >
          <ChevronDown size={32} />
        </button>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0f0f0f] to-transparent" />
    </section>
  );
}
