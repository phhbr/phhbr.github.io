// @ts-check
import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import sitemap from '@astrojs/sitemap';
import { externalLinks } from './src/utils/external-links';

const SITE = 'https://bruchner.dev';

export default defineConfig({
  site: SITE,
  trailingSlash: 'always',
  build: {
    // Keep all CSS external so the CSP can stay `style-src 'self'` (plan 3.2).
    inlineStylesheets: 'never',
  },
  markdown: {
    processor: satteri({ hastPlugins: [externalLinks(SITE)] }),
  },
  integrations: [sitemap()],
});
