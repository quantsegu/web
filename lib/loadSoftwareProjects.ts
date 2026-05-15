/// <reference types="vite/client" />
import { parseFrontmatter } from './parseFrontmatter';

export interface SoftwareProject {
  title: string;
  description: string;
  features: string[];
  icon: string;
  image: string;
  order?: number;
  url?: string;
  ctaLabel?: string;
}

/**
 * Loads all software project markdown files from content/software/,
 * parses frontmatter, and returns a sorted array.
 */
export function loadSoftwareProjects(): SoftwareProject[] {
  const modules = import.meta.glob<string>(
    '../content/software/*.md',
    { query: '?raw', import: 'default', eager: true }
  );

  const projects: SoftwareProject[] = Object.entries(modules)
    .filter(([path]) => !path.includes('README'))
    .map(([, raw]) => {
      const { data } = parseFrontmatter(raw);
      return {
        title: String(data.title ?? ''),
        description: String(data.description ?? ''),
        features: Array.isArray(data.features) ? data.features.map(String) : [],
        icon: String(data.icon ?? 'Code'),
        image: String(data.image ?? ''),
        order: typeof data.order === 'number' ? data.order : undefined,
        url: data.url ? String(data.url) : undefined,
        ctaLabel: data.ctaLabel ? String(data.ctaLabel) : undefined,
      };
    })
    .filter((p) => p.title.length > 0);

  projects.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  return projects;
}
