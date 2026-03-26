import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    id: 1,
    title: 'Structural Engineering',
    description: 'Comprehensive structural analysis and design for buildings, bridges, and industrial facilities.',
    image: '/service-structural.jpg',
    icon: '🏗️',
  },
  {
    id: 2,
    title: 'MEP Design',
    description: 'Mechanical, electrical, and plumbing systems designed for efficiency and sustainability.',
    image: '/service-mep.jpg',
    icon: '⚡',
  },
  {
    id: 3,
    title: 'Construction Management',
    description: 'End-to-end project oversight ensuring quality, safety, and on-time delivery.',
    image: '/service-construction.jpg',
    icon: '🏢',
  },
];

export default function ServicesTriptych() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      );

      gsap.fromTo(
        '.service-card',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 70%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="services" ref={sectionRef} className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div ref={titleRef} className="text-center mb-16">
          <span className="inline-block text-[#009966] font-semibold text-sm uppercase tracking-wider mb-4">
            What We Do
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a1a1a] mb-4">
            Our Core Services
          </h2>
          <p className="text-lg text-[#666666] max-w-2xl mx-auto">
            From concept to completion, we provide comprehensive engineering solutions tailored to your project needs.
          </p>
        </div>

        {/* Service Cards */}
        <div
          ref={cardsRef}
          className="grid md:grid-cols-3 gap-6 lg:gap-8"
        >
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`service-card group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ${
                hoveredCard === index
                  ? 'md:col-span-1 scale-[1.02]'
                  : hoveredCard !== null
                  ? 'md:scale-[0.98] opacity-80'
                  : ''
              }`}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Background Image */}
              <div className="aspect-[4/5] relative">
                <img
                  src={service.image}
                  alt={service.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                  {/* Icon */}
                  <div className="w-14 h-14 bg-[#009966] rounded-xl flex items-center justify-center text-2xl mb-4 transform transition-transform duration-300 group-hover:scale-110">
                    {service.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-3">
                    {service.title}
                  </h3>

                  {/* Description - shows on hover */}
                  <div className="overflow-hidden">
                    <p className="text-white/80 text-sm md:text-base transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      {service.description}
                    </p>
                  </div>

                  {/* CTA */}
                  <div className="mt-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100">
                    <span className="inline-flex items-center gap-2 text-[#009966] font-semibold text-sm">
                      Learn More
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>

                {/* Border Effect */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#009966] rounded-2xl transition-colors duration-300" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
