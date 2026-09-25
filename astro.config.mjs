// @ts-check
import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import sitemap from '@astrojs/sitemap';
import { externalLinks } from './src/utils/external-links';
import { readdirSync } from 'node:fs';
import { lastModified, noindexPaths, postSlugs, sourcesFor } from './src/utils/last-modified';

const SITE = 'https://bruchner.dev';

// The English pages lived at the root until the German version arrived. These
// static redirect pages keep old links working anywhere the site is served;
// on the server, deploy/bruchner.dev.caddy answers the same paths with a 301
// first, and sends `/` to /de/ or /en/ by the browser's language.
const englishServices = readdirSync('./src/content/services/en').map((file) => file.replace(/\.md$/, ''));
const legacy = [
  'services',
  ...englishServices.map((slug) => `services/${slug}`),
  'work',
  'cv',
  'writing',
  'legal',
  'privacy',
  ...postSlugs,
];
const redirects = Object.fromEntries([
  ['/', '/en/'],
  ...legacy.map((path) => [`/${path}`, `/en/${path}/`]),
]);

export default defineConfig({
  site: SITE,
  trailingSlash: 'always',
  redirects,
  build: {
    // Keep all CSS external so the CSP can stay `style-src 'self'`.
    inlineStylesheets: 'never',
  },
  markdown: {
    processor: satteri({ hastPlugins: [externalLinks(SITE)] }),
  },
  integrations: [
    sitemap({
      // Leave out noindex posts; date every page by when its content last changed.
      serialize(item) {
        const { pathname } = new URL(item.url);
        if (noindexPaths.has(pathname)) return undefined;
        const sources = sourcesFor(pathname);
        return sources ? { ...item, lastmod: lastModified(sources).toISOString() } : item;
      },
    }),
  ],
});
