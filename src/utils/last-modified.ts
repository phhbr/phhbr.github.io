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
// deliberately left out: they don't change what a page says. German and
// English pages share their views and data, so they share their sources.
const home = ['src/views/Home.astro', 'src/components/Hero.astro', 'src/content/services', 'src/data'];
const servicesIndex = ['src/views/Services.astro', 'src/content/services'];
const work = ['src/views/Work.astro', 'src/data/work.ts'];
const cv = ['src/views/Cv.astro', 'src/data/cv.ts'];
const pages: Record<string, string[]> = {
  '/en/': home,
  '/de/': home,
  '/en/services/': servicesIndex,
  '/de/leistungen/': servicesIndex,
  '/en/work/': work,
  '/de/projekte/': work,
  '/en/cv/': cv,
  '/de/lebenslauf/': cv,
  '/en/writing/': ['src/pages/en/writing', POSTS],
  '/en/legal/': ['src/pages/en/legal.astro', 'src/config.ts'],
  '/de/impressum/': ['src/pages/de/impressum.astro', 'src/config.ts'],
  '/en/privacy/': ['src/pages/en/privacy.astro', 'src/config.ts'],
  '/de/datenschutz/': ['src/pages/de/datenschutz.astro', 'src/config.ts'],
};

export function sourcesFor(pathname: string): string[] | undefined {
  if (pages[pathname]) return pages[pathname];
  const service = pathname.match(/^\/(en|de)\/(?:services|leistungen)\/([^/]+)\/$/);
  if (service) return [`src/content/services/${service[1]}/${service[2]}.md`, 'src/views/Service.astro'];
  const post = readdirSync(POSTS).find((file) => `/en/${slugOf(file)}/` === pathname);
  return post ? [`${POSTS}/${post}`] : undefined;
}

// Posts marked `noindex: true`, which the sitemap and llms.txt leave out.
export const noindexPaths = new Set(
  readdirSync(POSTS)
    .filter((file) => /^noindex:\s*true\s*$/m.test(readFileSync(`${POSTS}/${file}`, 'utf8')))
    .map((file) => `/en/${slugOf(file)}/`),
);

// Every post's slug, for the redirects from its pre-/en/ URL (astro.config.mjs).
export const postSlugs = readdirSync(POSTS).map(slugOf);
