import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronLeft, ChevronRight, MapPin, Calendar, ArrowRight } from 'lucide-react';
import { useProjects } from '@/hooks/useContent';

gsap.registerPlugin(ScrollTrigger);

export default function Projects() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const { projects, loading } = useProjects();

  const activeProject = projects[activeIndex] || null;

  useEffect(() => {
    if (loading || projects.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        carouselRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [loading, projects]);

  const nextProject = () => {
    setActiveIndex((prev) => (prev + 1) % projects.length);
  };

  const prevProject = () => {
    setActiveIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  if (loading) {
    return (
      <section
        id="projects"
        ref={sectionRef}
        className="relative py-20 md:py-32 bg-[#0f0f0f]"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="animate-pulse">
            <div className="h-10 bg-white/10 rounded w-1/3 mx-auto mb-8" />
            <div className="h-[400px] bg-white/5 rounded-2xl" />
          </div>
        </div>
      </section>
    );
  }

  if (projects.length === 0) {
    return null;
  }

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative py-20 md:py-32 bg-[#0f0f0f]"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="section-title">Completed Projects</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            A showcase of our engineering excellence across the United States
          </p>
        </div>

        {/* Project Carousel */}
        <div ref={carouselRef} className="relative">
          {/* Main Project Display */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Image Side */}
            <div className="relative h-[300px] md:h-[400px] rounded-2xl overflow-hidden group">
              {projects.map((project, index) => (
                <div
                  key={project.slug}
                  className={`absolute inset-0 transition-all duration-700 ${
                    index === activeIndex
                      ? 'opacity-100 scale-100'
                      : 'opacity-0 scale-105'
                  }`}
                >
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f]/80 via-transparent to-transparent" />
                </div>
              ))}

              {/* Project Navigation Overlay */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                <div className="flex gap-2">
                  {projects.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === activeIndex
                          ? 'bg-[#009966] w-6'
                          : 'bg-white/50 hover:bg-white/70'
                      }`}
                      aria-label={`View project ${index + 1}`}
                    />
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={prevProject}
                    className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 flex items-center justify-center transition-colors duration-300"
                    aria-label="Previous project"
                  >
                    <ChevronLeft size={20} className="text-white" />
                  </button>
                  <button
                    onClick={nextProject}
                    className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 flex items-center justify-center transition-colors duration-300"
                    aria-label="Next project"
                  >
                    <ChevronRight size={20} className="text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content Side */}
            {activeProject && (
              <div className="space-y-6">
                {/* Project Header */}
                <div>
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {activeProject.name.toUpperCase()}
                  </h3>
                  <p className="text-[#009966] font-medium">
                    {activeProject.company}
                  </p>
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-[#888888]">
                    <Calendar size={16} className="text-[#009966]" />
                    <span className="text-sm">{activeProject.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#888888]">
                    <MapPin size={16} className="text-[#009966]" />
                    <span className="text-sm">{activeProject.location}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-[#888888] leading-relaxed">
                  {activeProject.description}
                </p>

                {/* Materials & Services */}
                <div>
                  <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">
                    Materials & Services
                  </h4>
                  <ul className="space-y-2">
                    {activeProject.materials.map((material, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-3 text-[#888888] text-sm"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-[#009966]" />
                        {material}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .querySelector('#contact')
                      ?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 text-[#009966] hover:text-[#00cc88] transition-colors duration-300 font-medium"
                >
                  Discuss Your Project
                  <ArrowRight size={16} />
                </a>
              </div>
            )}
          </div>

          {/* Project Thumbnails */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            {projects.map((project, index) => (
              <button
                key={project.slug}
                onClick={() => setActiveIndex(index)}
                className={`relative h-24 md:h-32 rounded-xl overflow-hidden transition-all duration-300 ${
                  index === activeIndex
                    ? 'ring-2 ring-[#009966] ring-offset-2 ring-offset-[#0f0f0f]'
                    : 'opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={project.image}
                  alt={project.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f]/80 to-transparent" />
                <span className="absolute bottom-2 left-2 text-xs font-medium text-white">
                  {project.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
