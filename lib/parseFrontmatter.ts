import { load } from 'js-yaml';

/**
 * Parses YAML frontmatter from a markdown string (browser-safe).
 */
export function parseFrontmatter(raw: string): { data: Record<string, unknown>; content: string } {
  if (!raw.startsWith('---')) {
    return { data: {}, content: raw };
  }

  const end = raw.indexOf('\n---', 3);
  if (end === -1) {
    return { data: {}, content: raw };
  }

  const yamlBlock = raw.slice(3, end).trim();
  const content = raw.slice(end + 4).replace(/^\r?\n/, '');
  const data = (load(yamlBlock) as Record<string, unknown>) ?? {};

  return { data, content };
}
