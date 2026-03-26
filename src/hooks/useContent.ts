import { useState, useEffect } from 'react';

// Types
export interface HeroData {
  backgroundImage: string;
  titleLine1: string;
  titleLine2: string;
  titleLine3: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
}

export interface ModelShowcaseData {
  title: string;
  subtitle: string;
  beforeImage: string;
  afterImage: string;
  beforeLabel: string;
  afterLabel: string;
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  year: string;
  value: string;
  image: string;
}

export interface Service {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  features: string[];
  image: string;
  icon: string;
}

export interface Settings {
  companyName: string;
  logo: string;
  contact: {
    address: string;
    phone: string;
    email: string;
    hours: string;
  };
}

// Default data
const defaultHero: HeroData = {
  backgroundImage: '/hero-bg.jpg',
  titleLine1: 'Design.',
  titleLine2: 'Build.',
  titleLine3: 'Deliver.',
  subtitle: 'Innovative engineering solutions for complex construction challenges. We transform visions into reality with precision and expertise.',
  ctaPrimary: 'Explore Our Services',
  ctaSecondary: 'View Projects',
};

const defaultModelShowcase: ModelShowcaseData = {
  title: 'From Concept to Reality',
  subtitle: 'Drag the slider to see how our 3D models translate into finished construction projects.',
  beforeImage: '/model-before.jpg',
  afterImage: '/model-after.jpg',
  beforeLabel: '3D Model',
  afterLabel: 'Completed Project',
};

const defaultJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Structural Engineer',
    department: 'Engineering',
    location: 'Dallas, TX',
    type: 'Full-time',
    description: '<p>We are seeking an experienced Structural Engineer to lead complex projects.</p><ul><li>Minimum 8 years experience</li><li>PE license required</li><li>Experience with high-rise buildings preferred</li></ul>',
  },
  {
    id: '2',
    title: 'MEP Designer',
    department: 'Design',
    location: 'Houston, TX',
    type: 'Full-time',
    description: '<p>Join our MEP team to design innovative mechanical, electrical, and plumbing systems.</p><ul><li>5+ years MEP design experience</li><li>AutoCAD and Revit proficiency</li><li>LEED accreditation a plus</li></ul>',
  },
];

const defaultProjects: Project[] = [
  {
    id: '1',
    title: 'Downtown Office Tower',
    description: 'A 45-story mixed-use development featuring Class A office space and retail.',
    category: 'Commercial',
    location: 'Dallas, TX',
    year: '2023',
    value: '$120M',
    image: '/project-1.jpg',
  },
  {
    id: '2',
    title: 'Industrial Manufacturing Plant',
    description: 'State-of-the-art manufacturing facility with sustainable design features.',
    category: 'Industrial',
    location: 'Houston, TX',
    year: '2022',
    value: '$85M',
    image: '/project-2.jpg',
  },
  {
    id: '3',
    title: 'Medical Center Expansion',
    description: '200,000 sq ft hospital expansion including surgical suites and patient towers.',
    category: 'Healthcare',
    location: 'Austin, TX',
    year: '2023',
    value: '$150M',
    image: '/project-3.jpg',
  },
];

const defaultServices: Service[] = [
  {
    id: '1',
    title: 'Structural Engineering',
    shortDescription: 'Comprehensive structural analysis and design services.',
    fullDescription: '<p>Our structural engineering team provides comprehensive analysis and design services for buildings, bridges, and industrial facilities. We use advanced software and methodologies to ensure safety, efficiency, and cost-effectiveness.</p>',
    features: [
      'Structural analysis and design',
      'Seismic evaluation',
      'Forensic engineering',
      'Peer review services',
      'Construction support',
    ],
    image: '/service-structural.jpg',
    icon: '🏗️',
  },
  {
    id: '2',
    title: 'MEP Design',
    shortDescription: 'Mechanical, electrical, and plumbing system design.',
    fullDescription: '<p>We design efficient MEP systems that meet your building\'s needs while minimizing energy consumption and operational costs. Our designs prioritize sustainability and long-term performance.</p>',
    features: [
      'HVAC system design',
      'Electrical systems',
      'Plumbing design',
      'Fire protection',
      'Energy modeling',
    ],
    image: '/service-mep.jpg',
    icon: '⚡',
  },
  {
    id: '3',
    title: 'Construction Management',
    shortDescription: 'End-to-end project oversight and management.',
    fullDescription: '<p>Our construction management team ensures your project is delivered on time, within budget, and to the highest quality standards. We coordinate all aspects of the construction process.</p>',
    features: [
      'Project planning',
      'Schedule management',
      'Cost control',
      'Quality assurance',
      'Safety management',
    ],
    image: '/service-construction.jpg',
    icon: '🏢',
  },
  {
    id: '4',
    title: '3D Modeling & BIM',
    shortDescription: 'Advanced 3D visualization and building information modeling.',
    fullDescription: '<p>We create detailed 3D models and BIM representations that help visualize projects before construction begins, identify potential issues, and improve collaboration.</p>',
    features: [
      '3D architectural modeling',
      'BIM coordination',
      'Clash detection',
      'Virtual reality walkthroughs',
      'As-built documentation',
    ],
    image: '/service-3d.jpg',
    icon: '🎨',
  },
  {
    id: '5',
    title: 'Project Consulting',
    shortDescription: 'Expert guidance throughout your project lifecycle.',
    fullDescription: '<p>Our consulting services provide expert guidance at every stage of your project, from initial feasibility studies through project completion and beyond.</p>',
    features: [
      'Feasibility studies',
      'Value engineering',
      'Risk assessment',
      'Permit assistance',
      'Owner representation',
    ],
    image: '/service-consulting.jpg',
    icon: '📊',
  },
];

const defaultSettings: Settings = {
  companyName: 'TKE Engineering',
  logo: '/tke-logo.png',
  contact: {
    address: '123 Engineering Way, Industrial District, TX 75001',
    phone: '(555) 123-4567',
    email: 'info@tke-engineering.com',
    hours: 'Mon - Fri: 8:00 AM - 5:00 PM',
  },
};

// Helper function to load content from CMS
async function loadContent<T>(filePath: string, defaultData: T): Promise<T> {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      return defaultData;
    }
    const content = await response.text();
    
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (frontmatterMatch) {
      const frontmatter = frontmatterMatch[1];
      const data: Record<string, unknown> = {};
      
      frontmatter.split('\n').forEach((line) => {
        const match = line.match(/^([\w]+):\s*(.+)$/);
        if (match) {
          const [, key, value] = match;
          try {
            data[key] = JSON.parse(value);
          } catch {
            data[key] = value.replace(/^["']|["']$/g, '');
          }
        }
      });
      
      return { ...defaultData, ...data } as T;
    }
    
    return defaultData;
  } catch {
    return defaultData;
  }
}

export function useHero() {
  const [hero, setHero] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContent<HeroData>('/content/hero.md', defaultHero).then((data) => {
      setHero(data);
      setLoading(false);
    });
  }, []);

  return { hero, loading };
}

export function useModelShowcase() {
  const [showcase, setShowcase] = useState<ModelShowcaseData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContent<ModelShowcaseData>('/content/model-showcase.md', defaultModelShowcase).then((data) => {
      setShowcase(data);
      setLoading(false);
    });
  }, []);

  return { showcase, loading };
}

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/content/jobs/')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load jobs');
        return res.json();
      })
      .then((data) => {
        setJobs(data.length > 0 ? data : defaultJobs);
        setLoading(false);
      })
      .catch(() => {
        setJobs(defaultJobs);
        setLoading(false);
      });
  }, []);

  return { jobs, loading };
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/content/projects/')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load projects');
        return res.json();
      })
      .then((data) => {
        setProjects(data.length > 0 ? data : defaultProjects);
        setLoading(false);
      })
      .catch(() => {
        setProjects(defaultProjects);
        setLoading(false);
      });
  }, []);

  return { projects, loading };
}

export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/content/services/')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load services');
        return res.json();
      })
      .then((data) => {
        setServices(data.length > 0 ? data : defaultServices);
        setLoading(false);
      })
      .catch(() => {
        setServices(defaultServices);
        setLoading(false);
      });
  }, []);

  return { services, loading };
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContent<Settings>('/content/settings.md', defaultSettings).then((data) => {
      setSettings(data);
      setLoading(false);
    });
  }, []);

  return { settings, loading };
}
