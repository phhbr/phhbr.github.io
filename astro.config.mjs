// @ts-check
import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import sitemap from '@astrojs/sitemap';
import { externalLinks } from './src/utils/external-links';
import { lastModified, noindexPaths, sourcesFor } from './src/utils/last-modified';

const SITE = 'https://bruchner.dev';

export default defineConfig({
  site: SITE,
  trailingSlash: 'always',
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
