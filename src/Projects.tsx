import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useProjects } from '../hooks/useContent';

gsap.registerPlugin(ScrollTrigger);

export function Projects() {
  const { projects, loading } = useProjects();
  const [currentIndex, setCurrentIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const thumbnailsRef = useRef<HTMLDivElement>(null);

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
        carouselRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      );

      gsap.fromTo(
        thumbnailsRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.4,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (loading || projects.length === 0) {
    return (
      <section id="projects" ref={sectionRef} className="py-24 md:py-32 bg-[#f8f9fa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  const currentProject = projects[currentIndex];

  return (
    <section id="projects" ref={sectionRef} className="py-24 md:py-32 bg-[#f8f9fa] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div ref={titleRef} className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a1a1a] mb-4">
            Featured Projects
          </h2>
          <p className="text-lg text-[#666666] max-w-2xl mx-auto">
            Explore our portfolio of successful engineering and construction projects
          </p>
        </div>

        {/* Main Carousel */}
        <div ref={carouselRef} className="relative mb-8">
          <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-xl overflow-hidden shadow-2xl">
            {projects.map((project, index) => (
              <div
                key={project.id}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Project Info */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                  <span className="inline-block px-3 py-1 bg-[#009966] text-white text-xs md:text-sm font-medium rounded-full mb-3 md:mb-4">
                    {project.category}
                  </span>
                  <h3 className="text-2xl md:text-4xl font-bold text-white mb-2 md:mb-3">
                    {project.title}
                  </h3>
                  <p className="text-white/80 text-sm md:text-base max-w-2xl mb-4 line-clamp-2 md:line-clamp-none">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-4 md:gap-6 text-white/70 text-xs md:text-sm mb-4">
                    <span>{project.location}</span>
                    <span className="hidden md:inline">•</span>
                    <span>{project.year}</span>
                    <span className="hidden md:inline">•</span>
                    <span>{project.value}</span>
                  </div>
                  <button className="inline-flex items-center gap-2 text-[#009966] font-semibold hover:text-[#00cc88] transition-colors text-sm md:text-base">
                    View Project Details
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
            aria-label="Previous project"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-[#1a1a1a]" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
            aria-label="Next project"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-[#1a1a1a]" />
          </button>

          {/* Slide Counter */}
          <div className="absolute top-4 right-4 z-20 bg-black/60 text-white px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium">
            {currentIndex + 1} / {projects.length}
          </div>
        </div>

        {/* Thumbnail Navigation */}
        <div ref={thumbnailsRef} className="flex gap-2 md:gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {projects.map((project, index) => (
            <button
              key={project.id}
              onClick={() => goToSlide(index)}
              className={`flex-shrink-0 relative w-24 h-16 md:w-40 md:h-24 rounded-lg overflow-hidden transition-all ${
                index === currentIndex
                  ? 'ring-2 md:ring-3 ring-[#009966] ring-offset-2'
                  : 'opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              {index === currentIndex && (
                <div className="absolute inset-0 bg-[#009966]/20" />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
