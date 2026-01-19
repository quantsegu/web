/// <reference types="vite/client" />
import matter from 'gray-matter';

export interface SoftwareProject {
  title: string;
  description: string;
  features: string[];
  icon: string;
  image: string;
  order?: number;
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
    .map(([, raw]) => {
      const { data } = matter(raw);
      return {
        title: String(data.title ?? ''),
        description: String(data.description ?? ''),
        features: Array.isArray(data.features) ? data.features.map(String) : [],
        icon: String(data.icon ?? 'Code'),
        image: String(data.image ?? ''),
        order: typeof data.order === 'number' ? data.order : undefined,
      };
    })
    .filter((p) => p.title.length > 0);

  projects.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  return projects;
}
