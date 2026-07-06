import { useState, useEffect } from 'react';

export interface Job {
  slug: string;
  title: string;
  location: string;
  department: string;
  active: boolean;
  description: string;
  requirements: string[];
}

export interface Project {
  slug: string;
  name: string;
  company: string;
  date: string;
  location: string;
  description: string;
  images: string[];
  materials: string[];
}

export interface Service {
  slug: string;
  name: string;
  icon: string;
  featured: boolean;
  shortDescription?: string;
  fullDescription: string;
}

export interface Hero {
  backgroundVideo?: string;
  backgroundImage: string;
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  cta1Text: string;
  cta1Link: string;
  cta2Text: string;
  cta2Link: string;
}

export interface ModelShowcaseSlide {
  slug: string;
  title: string;
  description: string;
  beforeImage: string;
  afterImage: string;
  order: number;
}

export interface Settings {
  companyName: string;
  logoUrl: string;
  logoWidth: number;
  address1: string;
  address2: string;
  phone: string;
  email: string;
  resumeEmail: string;
  yearsExperience: string;
  projectsCompleted: string;
  aboutText: string;
  whatWeDoText: string;
}

// Parse frontmatter from markdown content
function parseFrontmatter(content: string): { frontmatter: Record<string, any>; body: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    return { frontmatter: {}, body: content };
  }

  const frontmatterText = match[1];
  const body = match[2].trim();

  const frontmatter: Record<string, any> = {};
  const lines = frontmatterText.split('\n');
  let currentKey = '';
  let currentValue: any = '';
  let inList = false;
  let listItems: string[] = [];

  for (const line of lines) {
    const listMatch = line.match(/^  - (.+)$/);
    if (listMatch) {
      if (!inList) {
        inList = true;
        listItems = [];
      }
      listItems.push(listMatch[1]);
      continue;
    }

    if (inList && currentKey) {
      frontmatter[currentKey] = listItems;
      inList = false;
      listItems = [];
    }

    const keyValueMatch = line.match(/^([^:]+):\s*(.+)?$/);
    if (keyValueMatch) {
      currentKey = keyValueMatch[1].trim();
      currentValue = keyValueMatch[2]?.trim() || '';

      // Remove quotes if present
      if (currentValue.startsWith('"') && currentValue.endsWith('"')) {
        currentValue = currentValue.slice(1, -1);
      }

      // Parse booleans
      if (currentValue === 'true') currentValue = true;
      if (currentValue === 'false') currentValue = false;

      // Parse numbers
      if (!isNaN(Number(currentValue)) && currentValue !== '') {
        currentValue = Number(currentValue);
      }

      // Parse multiline strings (starts with | or >)
      if (currentValue === '|' || currentValue === '>') {
        currentValue = '';
      }

      frontmatter[currentKey] = currentValue;
    } else if (currentKey && line.startsWith('  ')) {
      // Continuation of multiline value
      frontmatter[currentKey] += (frontmatter[currentKey] ? '\n' : '') + line.trim();
    }
  }

  if (inList && currentKey) {
    frontmatter[currentKey] = listItems;
  }

  return { frontmatter, body };
}

export function useHero() {
  const [hero, setHero] = useState<Hero | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHero = async () => {
      try {
        const response = await fetch('/content/hero/hero.md');
        const content = await response.text();
        const { frontmatter } = parseFrontmatter(content);
        setHero({
          backgroundVideo: frontmatter.backgroundVideo || '',
          backgroundImage: frontmatter.backgroundImage || '',
          titleLine1: frontmatter.titleLine1 || 'TKE Engineering',
          titleLine2: frontmatter.titleLine2 || '& Design',
          subtitle: frontmatter.subtitle || '',
          cta1Text: frontmatter.cta1Text || 'Explore Our Services',
          cta1Link: frontmatter.cta1Link || '#services',
          cta2Text: frontmatter.cta2Text || 'Get In Touch',
          cta2Link: frontmatter.cta2Link || '#contact',
        });
      } catch (error) {
        console.error('Error loading hero:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHero();
  }, []);

  return { hero, loading };
}

export function useModelShowcase() {
  const [slides, setSlides] = useState<ModelShowcaseSlide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const slideFiles = import.meta.glob('/public/content/model-showcase/*.md', { as: 'raw', eager: true });
      const loadedSlides: ModelShowcaseSlide[] = [];
      
      for (const path in slideFiles) {
        const content = slideFiles[path] as string;
        const slug = path.split('/').pop()?.replace('.md', '') || '';
        const { frontmatter } = parseFrontmatter(content);
        
        if (frontmatter.beforeImage || frontmatter.afterImage || frontmatter.image) {
          loadedSlides.push({
            slug,
            title: frontmatter.title || '',
            description: frontmatter.description || '',
            beforeImage: frontmatter.beforeImage || frontmatter.image || '',
            afterImage: frontmatter.afterImage || frontmatter.image || '',
            order: frontmatter.order || 999,
          });
        }
      }
      setSlides(loadedSlides.sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error('Error loading model showcase:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { slides, loading };
}

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const jobFiles = import.meta.glob('/public/content/jobs/*.md', { as: 'raw', eager: true });
      const loadedJobs: Job[] = [];
      
      for (const path in jobFiles) {
        const content = jobFiles[path] as string;
        const slug = path.split('/').pop()?.replace('.md', '') || '';
        const { frontmatter } = parseFrontmatter(content);
        
        loadedJobs.push({
          slug,
          title: frontmatter.title || '',
          location: frontmatter.location || '',
          department: frontmatter.department || '',
          active: frontmatter.active ?? true,
          description: frontmatter.description || '',
          requirements: frontmatter.requirements || [],
        });
      }
      setJobs(loadedJobs.filter(job => job.active));
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { jobs, loading };
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const projectFiles = import.meta.glob('/public/content/projects/*.md', { as: 'raw', eager: true });
      const loadedProjects: Project[] = [];
      
      for (const path in projectFiles) {
        const content = projectFiles[path] as string;
        const slug = path.split('/').pop()?.replace('.md', '') || '';
        const { frontmatter } = parseFrontmatter(content);
        
        let images: string[] = [];
        if (frontmatter.images && Array.isArray(frontmatter.images)) {
          images = frontmatter.images;
        } else if (frontmatter.image) {
          images = [frontmatter.image];
        }
        
        if (images.length > 0 || frontmatter.name) {
          loadedProjects.push({
            slug,
            name: frontmatter.name || '',
            company: frontmatter.company || '',
            date: frontmatter.date || '',
            location: frontmatter.location || '',
            description: frontmatter.description || '',
            images: images,
            materials: frontmatter.materials || [],
          });
        }
      }
      setProjects(loadedProjects);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { projects, loading };
}

export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const serviceFiles = import.meta.glob('/public/content/services/*.md', { as: 'raw', eager: true });
      const loadedServices: Service[] = [];
      
      for (const path in serviceFiles) {
        const content = serviceFiles[path] as string;
        const slug = path.split('/').pop()?.replace('.md', '') || '';
        const { frontmatter, body } = parseFrontmatter(content);
        
        loadedServices.push({
          slug,
          name: frontmatter.name || '',
          icon: frontmatter.icon || 'Settings',
          featured: frontmatter.featured || false,
          shortDescription: frontmatter.shortDescription || '',
          fullDescription: frontmatter.fullDescription || body || '',
        });
      }
      setServices(loadedServices);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { services, loading };
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/content/settings.json');
        const data = await response.json();
        setSettings({
          companyName: data.companyName || 'TKE Engineering & Design, Inc.',
          logoUrl: data.logoUrl || '',
          logoWidth: data.logoWidth || 50,
          address1: data.address1 || '',
          address2: data.address2 || '',
          phone: data.phone || '',
          email: data.email || '',
          resumeEmail: data.resumeEmail || '',
          yearsExperience: data.yearsExperience || '30+',
          projectsCompleted: data.projectsCompleted || '500+',
          aboutText: data.aboutText || '',
          whatWeDoText: data.whatWeDoText || '',
        });
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  return { settings, loading };
}
