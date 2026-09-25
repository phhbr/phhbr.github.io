// Renders the link preview images (1200×630) with the site's own fonts and
// colours: public/og.png (English) and public/og-de.png (German). Run after
// changing the name or tagline: `pnpm og`.
import { readFileSync } from 'node:fs';
import { chromium } from '@playwright/test';

const font = (path) =>
  `data:font/woff2;base64,${readFileSync(new URL(`../node_modules/${path}`, import.meta.url)).toString('base64')}`;

const mono = font('@fontsource-variable/martian-mono/files/martian-mono-latin-wdth-normal.woff2');
const body = font('@fontsource-variable/atkinson-hyperlegible-next/files/atkinson-hyperlegible-next-latin-wght-normal.woff2');

const taglines = {
  'og.png': 'Freelance senior frontend engineer for design systems and accessible web apps.',
  'og-de.png': 'Freiberuflicher Senior-Frontend-Entwickler für Designsysteme und barrierefreie Web-Apps.',
};

// Light theme tokens from src/styles/tokens.css.
const html = (tagline) => `<!doctype html>
<style>
  @font-face { font-family: Mono; src: url(${mono}) format('woff2'); font-weight: 100 800; font-stretch: 87.5% 112.5%; }
  @font-face { font-family: Body; src: url(${body}) format('woff2'); font-weight: 200 800; }
  * { box-sizing: border-box; margin: 0; }
  body {
    width: 1200px; height: 630px; overflow: hidden;
    padding: 96px 88px;
    display: flex; flex-direction: column;
    background-color: #edf1f5;
    background-image: radial-gradient(#d5dee8 1.5px, transparent 2px);
    background-size: 32px 32px;
    color: #14212e;
    font-family: Body;
  }
  h1 {
    position: relative;
    width: fit-content;
    font-family: Mono; font-size: 84px; white-space: nowrap; font-weight: 700; font-stretch: 112.5%;
    line-height: 1.05; letter-spacing: -0.02em;
    background: color-mix(in srgb, #1d5fb4 16%, transparent);
    outline: 2px solid color-mix(in srgb, #1d5fb4 55%, transparent);
  }
  h1::before, h1::after {
    content: ''; position: absolute; left: -200px; right: -200px;
    border-top: 2px dashed color-mix(in srgb, #1d5fb4 45%, transparent);
  }
  h1::before { top: 0; }
  h1::after { bottom: 0; }
  p { font-size: 40px; line-height: 1.3; margin-top: 48px; max-width: 900px; }
  .site { margin-top: auto; font-family: Mono; font-size: 28px; font-weight: 700; }
  .site span { color: #1d5fb4; }
</style>
<h1>Philipp Bruchner</h1>
<p>${tagline}</p>
<div class="site"><span>~/</span>bruchner.dev</div>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const [file, tagline] of Object.entries(taglines)) {
  await page.setContent(html(tagline));
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: new URL(`../public/${file}`, import.meta.url).pathname });
  console.log(`og-image: wrote public/${file}`);
}
await browser.close();
