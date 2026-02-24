import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MoveHorizontal, Layers, Box, Building2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const showcaseItems = [
  {
    id: 1,
    title: '3D Conceptual Model',
    description: 'Initial CAD design and 3D visualization',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80',
    icon: Box,
  },
  {
    id: 2,
    title: 'Engineering Blueprint',
    description: 'Detailed technical specifications',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80',
    icon: Layers,
  },
  {
    id: 3,
    title: 'Construction Phase',
    description: 'On-site implementation',
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80',
    icon: Building2,
  },
  {
    id: 4,
    title: 'Completed Facility',
    description: 'Final operational installation',
    image: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=800&q=80',
    icon: Building2,
  },
];

export default function ModelShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50);
  const sectionRef = useRef<HTMLElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentItem = showcaseItems[currentIndex];
  const CurrentIcon = currentItem.icon;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
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
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleMouseMove(e);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % showcaseItems.length);
    setSliderPosition(50);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + showcaseItems.length) % showcaseItems.length);
    setSliderPosition(50);
  };

  return (
    <section
      id="model-showcase"
      ref={sectionRef}
      className="relative py-20 md:py-32 bg-[#0a0a0a]"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#2d8a7a]/10 rounded-full mb-6">
            <Layers size={16} className="text-[#2d8a7a]" />
            <span className="text-sm text-[#2d8a7a] font-medium">
              From Concept to Reality
            </span>
          </div>
          <h2 className="section-title">3D Model to Finished Construction</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Experience our project evolution through interactive before/after
            comparisons. Drag the slider to see the transformation.
          </p>
        </div>

        {/* Main Showcase Container */}
        <div ref={containerRef} className="relative">
          {/* Image Comparison Slider */}
          <div
            ref={sliderRef}
            className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden cursor-ew-resize select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchMove={handleTouchMove}
            onTouchStart={() => setIsDragging(true)}
            onTouchEnd={() => setIsDragging(false)}
          >
            {/* Background Image (3D Model/Before) */}
            <div className="absolute inset-0">
              <img
                src={currentItem.image}
                alt={`${currentItem.title} - 3D Model`}
                className="w-full h-full object-cover"
                style={{ filter: 'grayscale(30%) brightness(0.7)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent" />
              
              {/* Label */}
              <div className="absolute top-4 left-4 px-3 py-1 bg-[#2d8a7a]/80 rounded text-xs font-medium text-white">
                3D MODEL / PLANNING
              </div>
            </div>

            {/* Foreground Image (Construction/After) - Revealed by slider */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              <img
                src={currentItem.image}
                alt={`${currentItem.title} - Completed`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent" />
              
              {/* Label */}
              <div className="absolute top-4 right-4 px-3 py-1 bg-[#c94e4e]/80 rounded text-xs font-medium text-white">
                COMPLETED
              </div>
            </div>

            {/* Slider Handle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-10"
              style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                <MoveHorizontal size={20} className="text-[#0f0f0f]" />
              </div>
            </div>

            {/* Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0f0f0f] to-transparent">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-[#2d8a7a]/20 rounded-lg flex items-center justify-center">
                  <CurrentIcon size={20} className="text-[#2d8a7a]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {currentItem.title}
                  </h3>
                  <p className="text-sm text-[#888888]">
                    {currentItem.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-6">
            {/* Slide Indicators */}
            <div className="flex gap-2">
              {showcaseItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    setSliderPosition(50);
                  }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-[#2d8a7a] w-8'
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Arrow Controls */}
            <div className="flex gap-2">
              <button
                onClick={prevSlide}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-300"
                aria-label="Previous slide"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-white"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                onClick={nextSlide}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors duration-300"
                aria-label="Next slide"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-white"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>

          {/* Thumbnail Strip */}
          <div className="flex gap-3 mt-6 overflow-x-auto pb-2">
            {showcaseItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentIndex(index);
                  setSliderPosition(50);
                }}
                className={`flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden transition-all duration-300 ${
                  index === currentIndex
                    ? 'ring-2 ring-[#2d8a7a] ring-offset-2 ring-offset-[#0a0a0a]'
                    : 'opacity-50 hover:opacity-80'
                }`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <div className="bg-[#1a1a1a] rounded-xl p-6 border border-white/5">
            <Box size={32} className="text-[#2d8a7a] mb-4" />
            <h4 className="text-lg font-bold text-white mb-2">
              3D Visualization
            </h4>
            <p className="text-sm text-[#888888]">
              Advanced CAD modeling and rendering for precise project planning
            </p>
          </div>
          <div className="bg-[#1a1a1a] rounded-xl p-6 border border-white/5">
            <Layers size={32} className="text-[#2d8a7a] mb-4" />
            <h4 className="text-lg font-bold text-white mb-2">
              Detailed Engineering
            </h4>
            <p className="text-sm text-[#888888]">
              Comprehensive blueprints and technical specifications
            </p>
          </div>
          <div className="bg-[#1a1a1a] rounded-xl p-6 border border-white/5">
            <Building2 size={32} className="text-[#2d8a7a] mb-4" />
            <h4 className="text-lg font-bold text-white mb-2">
              Quality Construction
            </h4>
            <p className="text-sm text-[#888888]">
              Expert on-site management ensuring project excellence
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
