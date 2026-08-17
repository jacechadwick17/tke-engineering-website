import { useState, useEffect } from 'react';

// --- Interfaces ---
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

export interface HrDocument {
  slug: string;
  title: string;
  category: string;
  documentFile: string;
}

// --- Parse frontmatter from markdown content ---
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
  let isMultiline = false;
  let isList = false;

  for (let line of lines) {
    // Skip empty lines, but preserve them if we are inside a multi-line paragraph
    if (line.trim() === '') {
      if (isMultiline && currentKey) {
        frontmatter[currentKey] += '\n';
      }
      continue;
    }

    // 1. Check for a new key-value pair (e.g., "title: Piping Designer")
    const kvMatch = line.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);

    if (kvMatch && !line.startsWith(' ') && !line.startsWith('-')) {
      currentKey = kvMatch[1].trim();
      let rawValue = kvMatch[2].trim();

      isMultiline = false;
      isList = false;

      // Detect CMS multi-line string indicators
      if (rawValue === '>-' || rawValue === '>' || rawValue === '|') {
        isMultiline = true;
        frontmatter[currentKey] = '';
        continue;
      }

      // An empty value means a list is likely starting on the next line
      if (rawValue === '') {
        isList = true;
        frontmatter[currentKey] = [];
        continue;
      }

      // Clean standard single-line values
      let val: any = rawValue;
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      else if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
      else if (val === 'true') val = true;
      else if (val === 'false') val = false;
      else if (!isNaN(Number(val)) && val !== '') val = Number(val);

      frontmatter[currentKey] = val;
      continue;
    }

    // 2. Read multi-line string text (ignores internal bullet points)
    if (isMultiline && currentKey) {
      const cleanLine = line.replace(/^[\s]*/, ''); // Strip YAML indent
      frontmatter[currentKey] += (frontmatter[currentKey] ? '\n' : '') + cleanLine;
      continue;
    }

    // 3. Read structural list items
    const listMatch = line.match(/^[\s]*- (.*)$/);
    if (isList && listMatch) {
      let listItem = listMatch[1].trim();
      if (listItem.startsWith('"') && listItem.endsWith('"')) listItem = listItem.slice(1, -1);
      else if (listItem.startsWith("'") && listItem.endsWith("'")) listItem = listItem.slice(1, -1);

      if (!Array.isArray(frontmatter[currentKey])) {
         frontmatter[currentKey] = [];
      }
      frontmatter[currentKey].push(listItem);
      continue;
    }
  }

  return { frontmatter, body };
}

// --- Hooks ---

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
        const manifestResponse = await fetch('/content/model-showcase-manifest.md');
        let slideSlugs: string[] = [];
        
        if (manifestResponse.ok) {
          const manifestContent = await manifestResponse.text();
          const { frontmatter } = parseFrontmatter(manifestContent);
          slideSlugs = frontmatter.slides || [];
        }

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
          } catch (err) {
            console.error(`Error loading slide ${slug}`, err);
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
    try {
      // Automatically scans the folder for ANY markdown file the CMS creates
      const jobFiles = import.meta.glob('/public/content/jobs/*.md', { as: 'raw', eager: true });
      const loadedJobs: Job[] = [];
      
      for (const path in jobFiles) {
        const content = jobFiles[path] as string;
        const { frontmatter } = parseFrontmatter(content);
        const slug = path.split('/').pop()?.replace('.md', '') || '';
        
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

      // Filter out any jobs marked as inactive in the CMS
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
    const loadProjects = async () => {
      try {
        const manifestResponse = await fetch('/content/projects-manifest.md');
        let projectSlugs: string[] = [];
        
        if (manifestResponse.ok) {
          const manifestContent = await manifestResponse.text();
          const { frontmatter } = parseFrontmatter(manifestContent);
          projectSlugs = frontmatter.projects || [];
        }

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
          if (!response.ok) continue;
          
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

// New Automatic Hook for HR Docs
export function useHrDocuments() {
  const [hrDocs, setHrDocs] = useState<HrDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // Uses the same automatic folder scan as projects
      const docFiles = import.meta.glob('/public/content/hr-docs/*.md', { as: 'raw', eager: true });
      const loadedDocs: HrDocument[] = [];
      
      for (const path in docFiles) {
        const content = docFiles[path] as string;
        const slug = path.split('/').pop()?.replace('.md', '') || '';
        const { frontmatter } = parseFrontmatter(content);
        
        loadedDocs.push({
          slug,
          title: frontmatter.title || '',
          category: frontmatter.category || 'General',
          documentFile: frontmatter.documentFile || '',
        });
      }
      setHrDocs(loadedDocs);
    } catch (error) {
      console.error('Error loading HR docs:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { hrDocs, loading };
}
