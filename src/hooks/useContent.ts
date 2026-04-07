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
    const loadSlides = async () => {
      try {
        // Load the manifest file that lists all slides
        const manifestResponse = await fetch('/content/model-showcase-manifest.md');
        let slideSlugs: string[] = [];
        
        if (manifestResponse.ok) {
          const manifestContent = await manifestResponse.text();
          const { frontmatter } = parseFrontmatter(manifestContent);
          slideSlugs = frontmatter.slides || [];
        }

        // If no manifest, try to load a default list
        if (slideSlugs.length === 0) {
          slideSlugs = ['slide-1', 'slide-2', 'slide-3'];
        }

        const loadedSlides: ModelShowcaseSlide[] = [];
        
        for (const slug of slideSlugs) {
          try {
            const response = await fetch(`/content/model-showcase/${slug}.md`);
            if (!response.ok) continue;
            
            const content = await response.text();
            const { frontmatter } = parseFrontmatter(content);
            
            // Only add if it has images
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
          } catch {
            // Skip files that don't exist or fail to load
          }
        }

        setSlides(loadedSlides.sort((a, b) => a.order - b.order));
      } catch (error) {
        console.error('Error loading model showcase:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSlides();
  }, []);

  return { slides, loading };
}

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const jobFiles = [
          '/content/jobs/electrical-design-engineer.md',
        ];

        const loadedJobs: Job[] = [];
        for (const file of jobFiles) {
          const response = await fetch(file);
          const content = await response.text();
          const { frontmatter } = parseFrontmatter(content);
          const slug = file.split('/').pop()?.replace('.md', '') || '';
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
    };

    loadJobs();
  }, []);

  return { jobs, loading };
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        // Load the manifest file that lists all projects
        const manifestResponse = await fetch('/content/projects-manifest.md');
        let projectSlugs: string[] = [];
        
        if (manifestResponse.ok) {
          const manifestContent = await manifestResponse.text();
          const { frontmatter } = parseFrontmatter(manifestContent);
          projectSlugs = frontmatter.projects || [];
        }

        // If no manifest, try to load a default list
        if (projectSlugs.length === 0) {
          projectSlugs = ['ngpl-station-348', 'custody-transfer-ms'];
        }

        const loadedProjects: Project[] = [];
        
        for (const slug of projectSlugs) {
          try {
            const response = await fetch(`/content/projects/${slug}.md`);
            if (!response.ok) continue;
            
            const content = await response.text();
            const { frontmatter } = parseFrontmatter(content);
            
            // Support both old 'image' and new 'images' format
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
          } catch (err) {
            console.warn(`Failed to load project: ${slug}`, err);
          }
        }

        setProjects(loadedProjects);
      } catch (error) {
        console.error('Error loading projects:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  return { projects, loading };
}

export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const serviceFiles = [
          '/content/services/conceptual-design.md',
          '/content/services/ferc-support.md',
          '/content/services/leaching.md',
          '/content/services/dehydration.md',
          '/content/services/compression.md',
          '/content/services/injection.md',
          '/content/services/withdrawal.md',
          '/content/services/btex-recovery.md',
          '/content/services/metering-regulating.md',
          '/content/services/interconnect.md',
          '/content/services/retrofits.md',
        ];

        const loadedServices: Service[] = [];
        for (const file of serviceFiles) {
          const response = await fetch(file);
          const content = await response.text();
          const { frontmatter, body } = parseFrontmatter(content);
          const slug = file.split('/').pop()?.replace('.md', '') || '';
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
    };

    loadServices();
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
