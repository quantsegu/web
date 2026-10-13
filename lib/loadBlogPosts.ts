/// <reference types="vite/client" />
import { parseFrontmatter } from './parseFrontmatter';

export interface BlogPost {
  slug: string;
  title: string;
  /** ISO date, YYYY-MM-DD */
  date: string;
  description: string;
  tags: string[];
  body: string;
  readingMinutes: number;
}

function toIsoDate(value: unknown): string {
  // js-yaml turns an unquoted 2026-10-13 into a Date, so accept both forms.
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }
  return String(value ?? '').slice(0, 10);
}

/**
 * Loads all blog posts from content/blog/, parses frontmatter, and returns
 * them newest first. The slug is the filename without the .md extension.
 */
export function loadBlogPosts(): BlogPost[] {
  const modules = import.meta.glob<string>('../content/blog/*.md', {
    query: '?raw',
    import: 'default',
    eager: true,
  });

  const posts: BlogPost[] = Object.entries(modules)
    .filter(([path]) => !path.includes('README'))
    .map(([path, raw]) => {
      const { data, content } = parseFrontmatter(raw);
      const slug = path.split('/').pop()!.replace(/\.md$/, '');
      const words = content.split(/\s+/).filter(Boolean).length;
      return {
        slug,
        title: String(data.title ?? ''),
        date: toIsoDate(data.date),
        description: String(data.description ?? ''),
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
        body: content,
        readingMinutes: Math.max(1, Math.round(words / 200)),
      };
    })
    .filter((p) => p.title.length > 0);

  posts.sort((a, b) => b.date.localeCompare(a.date));
  return posts;
}

export function formatPostDate(iso: string): string {
  const d = new Date(`${iso}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
