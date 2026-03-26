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

gssap.registerPlugin(ScrollTrigger);

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
           
