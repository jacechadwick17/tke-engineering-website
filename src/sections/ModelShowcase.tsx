import { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MoveHorizontal } from 'lucide-react';
import { useModelShowcase } from '../hooks/useContent';

gsap.registerPlugin(ScrollTrigger);

export default function ModelShowcase() {
  const { showcase, loading } = useModelShowcase();
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

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
        containerRef.current,
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
      setSliderPosition(percentage);
    },
    []
  );

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    handleMove(e.clientX);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      handleMove(e.clientX);
    },
    [isDragging, handleMove]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    handleMove(e.touches[0].clientX);
  };

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging) return;
      handleMove(e.touches[0].clientX);
    },
    [isDragging, handleMove]
  );

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove]);

  if (loading) {
    return (
      <section ref={sectionRef} className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
            <div className="aspect-[16/9] bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </section>
    );
  }

  const showcaseData = showcase || {
    title: 'From Concept to Reality',
    subtitle: 'Drag the slider to see how our 3D models translate into finished construction projects.',
    beforeImage: '/model-before.jpg',
    afterImage: '/model-after.jpg',
    beforeLabel: '3D Model',
    afterLabel: 'Completed Project',
  };

  return (
    <section id="modeling" ref={sectionRef} className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div ref={titleRef} className="text-center mb-12 md:mb-16">
          <span className="inline-block text-[#009966] font-semibold text-sm uppercase tracking-wider mb-4">
            3D Visualization
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a1a1a] mb-4">
            {showcaseData.title}
          </h2>
          <p className="text-lg text-[#666666] max-w-2xl mx-auto">
            {showcaseData.subtitle}
          </p>
        </div>

        {/* Before/After Slider */}
        <div
          ref={containerRef}
          className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl cursor-ew-resize select-none"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          {/* After Image (Full) */}
          <div className="absolute inset-0">
            <img
              src={showcaseData.afterImage}
              alt="Completed project"
              className="w-full h-full object-cover"
              draggable={false}
            />
            {/* Label */}
            <div className="absolute bottom-6 right-6 bg-[#009966] text-white px-4 py-2 rounded-lg font-semibold">
              {showcaseData.afterLabel}
            </div>
          </div>

          {/* Before Image (Clipped) */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
            <img
              src={showcaseData.beforeImage}
              alt="3D model"
              className="w-full h-full object-cover"
              draggable={false}
            />
            {/* Label */}
            <div className="absolute bottom-6 left-6 bg-[#1a1a1a] text-white px-4 py-2 rounded-lg font-semibold">
              {showcaseData.beforeLabel}
            </div>
          </div>

          {/* Slider Handle */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-lg"
            style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
          >
            {/* Handle Circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center">
              <MoveHorizontal className="w-6 h-6 text-[#009966]" />
            </div>
          </div>

          {/* Instruction Overlay */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium pointer-events-none">
            Drag to compare
          </div>
        </div>

        {/* Feature Points */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {[
            {
              title: 'Precision Modeling',
              description: 'Accurate 3D representations that match final construction specifications.',
            },
            {
              title: 'Real-time Visualization',
              description: 'See your project come to life before breaking ground.',
            },
            {
              title: 'Design Validation',
              description: 'Identify and resolve issues early in the design process.',
            },
          ].map((feature, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 bg-[#009966]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <div className="w-3 h-3 bg-[#009966] rounded-full"></div>
              </div>
              <h4 className="font-semibold text-[#1a1a1a] mb-2">{feature.title}</h4>
              <p className="text-sm text-[#666666]">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
