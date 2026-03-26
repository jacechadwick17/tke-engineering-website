import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { X, ChevronRight, CheckCircle2, Users, Award, Building2, Clock } from 'lucide-react';
import { useServices } from '../hooks/useContent';

gsap.registerPlugin(ScrollTrigger);

interface Service {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  features: string[];
  image: string;
  icon: string;
}

export default function ServicesDetail() {
  const { services, loading } = useServices();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.stat-item',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 80%',
          },
        }
      );

      gsap.fromTo(
        '.service-list-item',
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.services-list',
            start: 'top 70%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedService) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedService]);

  const stats = [
    { icon: Building2, value: '250+', label: 'Projects Completed' },
    { icon: Users, value: '50+', label: 'Expert Engineers' },
    { icon: Award, value: '15+', label: 'Industry Awards' },
    { icon: Clock, value: '18', label: 'Years Experience' },
  ];

  if (loading) {
    return (
      <section ref={sectionRef} className="py-24 md:py-32 bg-[#f8f9fa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-64 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="py-24 md:py-32 bg-[#f8f9fa]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Section */}
        <div
          ref={statsRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-20"
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="stat-item bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <stat.icon className="w-8 h-8 text-[#009966] mx-auto mb-3" />
              <div className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-[#666666]">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Services List */}
        <div className="services-list">
          <h3 className="text-2xl md:text-3xl font-bold text-[#1a1a1a] mb-8 text-center">
            Detailed Service Offerings
          </h3>

          <div className="space-y-4">
            {services.map((service) => (
              <div
                key={service.id}
                className="service-list-item bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => setSelectedService(service)}
                  className="w-full p-6 flex items-center justify-between text-left group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#009966]/10 rounded-lg flex items-center justify-center text-2xl">
                      {service.icon}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-[#1a1a1a] group-hover:text-[#009966] transition-colors">
                        {service.title}
                      </h4>
                      <p className="text-sm text-[#666666] mt-1">
                        {service.shortDescription}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#999999] group-hover:text-[#009966] group-hover:translate-x-1 transition-all" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Service Detail Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedService(null)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
            {/* Close Button */}
            <button
              onClick={() => setSelectedService(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors z-10"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image */}
            <div className="aspect-video relative">
              <img
                src={selectedService.image}
                alt={selectedService.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="w-14 h-14 bg-[#009966] rounded-xl flex items-center justify-center text-3xl mb-3">
                  {selectedService.icon}
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white">
                  {selectedService.title}
                </h3>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 md:p-8">
              <div
                className="prose prose-lg max-w-none text-[#666666] mb-8"
                dangerouslySetInnerHTML={{ __html: selectedService.fullDescription }}
              />

              <div>
                <h4 className="text-lg font-semibold text-[#1a1a1a] mb-4">
                  Key Features
                </h4>
                <ul className="grid md:grid-cols-2 gap-3">
                  {selectedService.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3"
                    >
                      <CheckCircle2 className="w-5 h-5 text-[#009966] flex-shrink-0 mt-0.5" />
                      <span className="text-[#666666]">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <a
                  href="#contact"
                  onClick={() => setSelectedService(null)}
                  className="inline-flex items-center gap-2 bg-[#009966] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#007a52] transition-colors"
                >
                  Request a Consultation
                  <ChevronRight className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
