import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Lightbulb,
  FileCheck,
  Droplets,
  CloudFog,
  Settings,
  ArrowUpCircle,
  ArrowDownCircle,
  Wind,
  Gauge,
  Network,
  Wrench,
} from 'lucide-react';
import { useServices, useSettings } from '@/hooks/useContent';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, React.ElementType> = {
  Lightbulb,
  FileCheck,
  Droplets,
  CloudFog,
  Settings,
  ArrowUpCircle,
  ArrowDownCircle,
  Wind,
  Gauge,
  Network,
  Wrench,
};

export default function ServicesDetail() {
  const sectionRef = useRef<HTMLElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const { services, loading: servicesLoading } = useServices();
  const { settings, loading: settingsLoading } = useSettings();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Service items staggered slide
      if (leftColRef.current) {
        const items = leftColRef.current.querySelectorAll('.service-item');
        gsap.fromTo(
          items,
          { opacity: 0, x: -50 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: leftColRef.current,
              start: 'top 70%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Right column parallax
      if (rightColRef.current) {
        gsap.fromTo(
          rightColRef.current,
          { opacity: 0, y: 100 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: rightColRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [services]);

  const selectedServiceData = services.find((s) => s.slug === selectedService);

  // Format markdown-like text to HTML
  const formatDescription = (text: string) => {
    return text
      .split('\n\n')
      .map((paragraph) => `<p class="mb-4 text-[#888888] leading-relaxed">${paragraph}</p>`)
      .join('');
  };

  if (servicesLoading || settingsLoading) {
    return (
      <section
        id="services"
        ref={sectionRef}
        className="relative py-20 md:py-32 bg-[#0f0f0f] overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-white/10 rounded w-1/3 mb-8" />
            <div className="space-y-3">
              {[...Array(11)].map((_, i) => (
                <div key={i} className="h-10 bg-white/5 rounded" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative py-20 md:py-32 bg-[#0f0f0f] overflow-hidden"
    >
      {/* Background TKE Logo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <span
          className="text-[30vw] font-bold text-white/[0.02] select-none"
          style={{ fontFamily: 'Oswald, sans-serif' }}
        >
          TKE
        </span>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left Column - Services List */}
          <div ref={leftColRef}>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-8">
              SERVICES
            </h3>

            <div className="space-y-1">
              {services.map((service, index) => {
                const Icon = iconMap[service.icon] || Settings;
                const isHovered = hoveredIndex === index;

                return (
                  <div
                    key={service.slug}
                    className="service-item group"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <button
                      onClick={() => setSelectedService(service.slug)}
                      className={`w-full flex items-center gap-4 py-3 px-4 rounded-lg transition-all duration-300 text-left ${
                        isHovered ? 'bg-[#2d8a7a]/10' : 'bg-transparent'
                      }`}
                    >
                      <Icon
                        size={20}
                        className={`transition-colors duration-300 flex-shrink-0 ${
                          isHovered ? 'text-[#2d8a7a]' : 'text-[#888888]'
                        }`}
                      />
                      <span
                        className={`text-sm md:text-base font-medium transition-colors duration-300 ${
                          isHovered ? 'text-[#c94e4e]' : 'text-[#e0e0e0]'
                        }`}
                      >
                        {service.name}
                      </span>

                      {/* Ripple effect indicator */}
                      <div
                        className={`ml-auto w-2 h-2 rounded-full transition-all duration-300 ${
                          isHovered
                            ? 'bg-[#2d8a7a] scale-100'
                            : 'bg-transparent scale-0'
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column - About Text */}
          <div ref={rightColRef} className="space-y-12">
            {/* Who We Are */}
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
                WHO WE ARE
              </h3>
              <div className="h-1 w-20 bg-[#2d8a7a] mb-6" />
              <p className="text-[#888888] leading-relaxed text-sm md:text-base">
                {settings?.aboutText}
              </p>
            </div>

            {/* What We Do */}
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
                WHAT WE DO
              </h3>
              <div className="h-1 w-20 bg-[#2d8a7a] mb-6" />
              <p className="text-[#888888] leading-relaxed text-sm md:text-base">
                {settings?.whatWeDoText}
              </p>
            </div>

            {/* Stats - Only 2 stats (removed 50+ engineers) */}
            <div className="grid grid-cols-2 gap-6 pt-8 border-t border-white/10">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[#2d8a7a]">
                  {settings?.yearsExperience || '30+'}
                </div>
                <div className="text-xs md:text-sm text-[#888888] mt-1">
                  Years Experience
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[#2d8a7a]">
                  {settings?.projectsCompleted || '500+'}
                </div>
                <div className="text-xs md:text-sm text-[#888888] mt-1">
                  Projects Completed
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Service Detail Modal */}
      <Dialog
        open={!!selectedService}
        onOpenChange={() => setSelectedService(null)}
      >
        <DialogContent className="max-w-2xl bg-[#1a1a1a] border-white/10 text-white max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
              {selectedServiceData && (
                <>
                  {(() => {
                    const Icon =
                      iconMap[selectedServiceData.icon] || Settings;
                    return <Icon size={28} className="text-[#2d8a7a]" />;
                  })()}
                  {selectedServiceData.name}
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          {selectedServiceData && (
            <div
              className="mt-4 prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{
                __html: formatDescription(selectedServiceData.fullDescription),
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
