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
  image: string;
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

export interface Settings {
  companyName: string;
  address1: string;
  address2: string;
  phone: string;
  email: string;
  resumeEmail: string;
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

export function useJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        // In production, this would fetch from the CMS API
        // For now, we'll use the markdown files directly
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
        const projectFiles = [
          '/content/projects/wyckoff.md',
          '/content/projects/jefferson-island.md',
          '/content/projects/egan-hub.md',
          '/content/projects/egan-hub-moss-bluff.md',
        ];

        const loadedProjects: Project[] = [];
        for (const file of projectFiles) {
          const response = await fetch(file);
          const content = await response.text();
          const { frontmatter } = parseFrontmatter(content);
          const slug = file.split('/').pop()?.replace('.md', '') || '';
          loadedProjects.push({
            slug,
            name: frontmatter.name || '',
            company: frontmatter.company || '',
            date: frontmatter.date || '',
            location: frontmatter.location || '',
            description: frontmatter.description || '',
            image: frontmatter.image || '',
            materials: frontmatter.materials || [],
          });
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
        setSettings(data);
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
