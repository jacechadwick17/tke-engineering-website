import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MoveHorizontal, Layers, Box } from 'lucide-react';
import { useModelShowcase } from '@/hooks/useContent';

gsap.registerPlugin(ScrollTrigger);

export default function ModelShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50);
  const sectionRef = useRef<HTMLElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { slides, loading } = useModelShowcase();

  const currentItem = slides[currentIndex];

  useEffect(() => {
    if (loading || slides.length === 0) return;

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
  }, [loading, slides]);

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
    setCurrentIndex((prev) => (prev + 1) % slides.length);
    setSliderPosition(50);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    setSliderPosition(50);
  };

  if (loading || slides.length === 0) {
    return (
      <section
        id="model-showcase"
        ref={sectionRef}
        className="relative py-20 md:py-32 bg-[#0a0a0a]"
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

  return (
    <section
      id="model-showcase"
      ref={sectionRef}
      className="relative py-20 md:py-32 bg-[#0a0a0a]"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#00A0A0]/10 rounded-full mb-6">
            <Layers size={16} className="text-[#00A0A0]" />
            <span className="text-sm text-[#00A0A0] font-medium">
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
            {/* Background Image (Completed/After) */}
            <div className="absolute inset-0">
              <img
                src={currentItem?.afterImage}
                alt={`${currentItem?.title} - Completed`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent" />
            </div>

            {/* Foreground Image (3D Model/Before) - Revealed by slider */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              <img
                src={currentItem?.beforeImage}
                alt={`${currentItem?.title} - 3D Model/Planning`}
                className="w-full h-full object-cover"
                style={{ filter: 'grayscale(30%) brightness(0.7)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent" />
            </div>

            {/* Labels - Always visible */}
            <div className="absolute top-4 left-4 px-3 py-1 bg-[#00A0A0]/80 rounded text-xs font-medium text-white z-20">
              3D MODEL / PLANNING
            </div>
            <div className="absolute top-4 right-4 px-3 py-1 bg-[#c94e4e]/80 rounded text-xs font-medium text-white z-20">
              COMPLETED
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
                <div className="w-10 h-10 bg-[#00A0A0]/20 rounded-lg flex items-center justify-center">
                  <Box size={20} className="text-[#00A0A0]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    {currentItem?.title}
                  </h3>
                  <p className="text-sm text-[#888888]">
                    {currentItem?.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-6">
            {/* Slide Indicators */}
            <div className="flex gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    setSliderPosition(50);
                  }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-[#00A0A0] w-8'
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
            {slides.map((item, index) => (
              <button
                key={item.slug}
                onClick={() => {
                  setCurrentIndex(index);
                  setSliderPosition(50);
                }}
                className={`flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden transition-all duration-300 ${
                  index === currentIndex
                    ? 'ring-2 ring-[#00A0A0] ring-offset-2 ring-offset-[#0a0a0a]'
                    : 'opacity-50 hover:opacity-80'
                }`}
              >
                <img
                  src={item.afterImage}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-6 mt-16">
          <div className="bg-[#1a1a1a] rounded-xl p-6 border border-white/5">
            <Box size={32} className="text-[#00A0A0] mb-4" />
            <h4 className="text-lg font-bold text-white mb-2">
              3D Visualization
            </h4>
            <p className="text-sm text-[#888888]">
              Advanced CAD modeling and rendering for precise project planning
            </p>
          </div>
          <div className="bg-[#1a1a1a] rounded-xl p-6 border border-white/5">
            <Layers size={32} className="text-[#00A0A0] mb-4" />
            <h4 className="text-lg font-bold text-white mb-2">
              Detailed Engineering
            </h4>
            <p className="text-sm text-[#888888]">
              Comprehensive blueprints and technical specifications
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
