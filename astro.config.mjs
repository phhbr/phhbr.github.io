// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://bruchner.dev',
  trailingSlash: 'always',
  build: {
    // Keep all CSS external so the CSP can stay `style-src 'self'` (plan 3.2).
    inlineStylesheets: 'never',
  },
  integrations: [sitemap()],
});
