import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { archivedPosts, pages } from './pages';

const paths = [...pages.map(({ path }) => path), ...archivedPosts, '/does-not-exist/'];

// WCAG 2.2 A and AA, the level the site claims.
const tags = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22a', 'wcag22aa'];

for (const colorScheme of ['light', 'dark'] as const) {
  test.describe(`axe, ${colorScheme} theme`, () => {
    // Reduced motion so axe never measures the hero tooltip mid-fade.
    test.use({ colorScheme, reducedMotion: 'reduce' });

    for (const path of paths) {
      test(`${path} has no WCAG A/AA violations`, async ({ page }) => {
        await page.goto(path);
        const { violations } = await new AxeBuilder({ page }).withTags(tags).analyze();
        const summary = violations.map(({ id, help, nodes }) => ({
          id,
          help,
          targets: nodes.map(({ target }) => target.join(' ')),
        }));
        expect(summary).toEqual([]);
      });
    }
  });
}
