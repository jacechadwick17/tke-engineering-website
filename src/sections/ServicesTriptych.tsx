import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ClipboardList, Cog, HardHat, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    id: 1,
    title: 'Project Management',
    description:
      'TKE provides its clients with a full project management package including quotes, scheduling, budget allocation, and overseeing the design phase and site development.',
    icon: ClipboardList,
    color: '#2d8a7a',
  },
  {
    id: 2,
    title: 'Engineering',
    description:
      'Our multidisciplinary staff has years of accumulated experience in fields such as mechanical, electrical, and civil engineering. We maintain a full staff of design and drafting personnel utilizing the most advanced computer aided technology.',
    icon: Cog,
    color: '#3dbba5',
  },
  {
    id: 3,
    title: 'Construction Management',
    description:
      'TKE offers on-site scheduling, material tracking, field engineering, and daily reporting to streamline the installation process and address any issues on the spot.',
    icon: HardHat,
    color: '#2d8a7a',
  },
];

export default function ServicesTriptych() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance animation for cards
      if (cardsRef.current) {
        gsap.fromTo(
          cardsRef.current.children,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="services-overview"
      ref={sectionRef}
      className="relative py-20 md:py-32 bg-[#0f0f0f]"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="section-title">Our Core Services</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Comprehensive engineering solutions tailored to meet the demands of
            the gas and pipeline industry
          </p>
        </div>

        {/* Accordion Cards */}
        <div
          ref={cardsRef}
          className="flex flex-col lg:flex-row gap-4 min-h-[500px]"
        >
          {services.map((service, index) => {
            const Icon = service.icon;
            const isActive = activeIndex === index;

            return (
              <div
                key={service.id}
                className={`relative overflow-hidden rounded-xl cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ${
                  isActive
                    ? 'lg:flex-[3] flex-1'
                    : activeIndex !== null
                    ? 'lg:flex-[0.8] flex-1'
                    : 'lg:flex-1 flex-1'
                }`}
                style={{
                  background: `linear-gradient(135deg, ${service.color}15 0%, ${service.color}05 100%)`,
                  border: `1px solid ${service.color}30`,
                }}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {/* Background Glow */}
                <div
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    isActive ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    background: `radial-gradient(circle at center, ${service.color}20 0%, transparent 70%)`,
                  }}
                />

                {/* Content */}
                <div className="relative h-full p-8 flex flex-col">
                  {/* Icon */}
                  <div
                    className={`w-16 h-16 rounded-lg flex items-center justify-center mb-6 transition-all duration-500 ${
                      isActive ? 'scale-110' : 'scale-100'
                    }`}
                    style={{ background: `${service.color}30` }}
                  >
                    <Icon
                      size={32}
                      style={{ color: service.color }}
                      className="transition-transform duration-500"
                    />
                  </div>

                  {/* Title - Rotates when compressed on desktop */}
                  <h3
                    className={`text-xl md:text-2xl font-bold text-white mb-4 transition-all duration-500 ${
                      !isActive && activeIndex !== null
                        ? 'lg:writing-mode-vertical lg:rotate-180'
                        : ''
                    }`}
                    style={{
                      writingMode:
                        !isActive && activeIndex !== null ? 'vertical-rl' : 'horizontal-tb',
                    }}
                  >
                    {service.title.toUpperCase()}
                  </h3>

                  {/* Description - Shows on active */}
                  <div
                    className={`flex-1 transition-all duration-500 ${
                      isActive
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-4 pointer-events-none'
                    }`}
                  >
                    <p className="text-[#888888] text-sm md:text-base leading-relaxed mb-6">
                      {service.description}
                    </p>

                    <a
                      href="#services"
                      onClick={(e) => {
                        e.preventDefault();
                        document
                          .querySelector('#services')
                          ?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="inline-flex items-center gap-2 text-[#2d8a7a] hover:text-[#3dbba5] transition-colors duration-300 font-medium"
                    >
                      Read More
                      <ArrowRight size={16} />
                    </a>
                  </div>

                  {/* Bottom Line Accent */}
                  <div
                    className={`absolute bottom-0 left-0 h-1 transition-all duration-500 ${
                      isActive ? 'w-full' : 'w-0'
                    }`}
                    style={{ background: service.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
