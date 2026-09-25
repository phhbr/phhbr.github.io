import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';

// When a page's content last changed: the latest commit touching any of its
// sources. Uncommitted changes count as now. CI checks out the full history
// (fetch-depth: 0), otherwise every page would get the same date.
export function lastModified(paths: string[]): Date {
  try {
    const git = (...args: string[]) => execFileSync('git', args, { encoding: 'utf8' }).trim();
    const committed = git('log', '-1', '--format=%cI', '--', ...paths);
    const dirty = git('status', '--porcelain', '--', ...paths);
    if (committed && !dirty) return new Date(committed);
  } catch {
    // Not a git checkout: fall through.
  }
  return new Date();
}

const POSTS = 'src/content/posts';
const slugOf = (file: string) => file.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '');

// Which files make up each page's content. Layout and styling changes are
// deliberately left out: they don't change what a page says.
const pages: Record<string, string[]> = {
  '/': ['src/pages/index.astro', 'src/components/Hero.astro', 'src/content/services', 'src/data'],
  '/services/': ['src/pages/services/index.astro', 'src/content/services'],
  '/work/': ['src/pages/work.astro', 'src/data/work.ts'],
  '/cv/': ['src/pages/cv.astro', 'src/data/cv.ts'],
  '/writing/': ['src/pages/writing', POSTS],
  '/legal/': ['src/pages/legal.astro', 'src/config.ts'],
  '/privacy/': ['src/pages/privacy.astro', 'src/config.ts'],
};

export function sourcesFor(pathname: string): string[] | undefined {
  if (pages[pathname]) return pages[pathname];
  const service = pathname.match(/^\/services\/([^/]+)\/$/);
  if (service) return [`src/content/services/${service[1]}.md`, 'src/pages/services/[slug].astro'];
  const post = readdirSync(POSTS).find((file) => `/${slugOf(file)}/` === pathname);
  return post ? [`${POSTS}/${post}`] : undefined;
}

// Posts marked `noindex: true`, which the sitemap and llms.txt leave out.
export const noindexPaths = new Set(
  readdirSync(POSTS)
    .filter((file) => /^noindex:\s*true\s*$/m.test(readFileSync(`${POSTS}/${file}`, 'utf8')))
    .map((file) => `/${slugOf(file)}/`),
);
