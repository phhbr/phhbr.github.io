import { expect, test } from '@playwright/test';
import { archivedPosts, noindexPosts, pages } from './pages';

const indexable = [...pages.map(({ path }) => path), ...archivedPosts.filter((p) => !noindexPosts.includes(p))];

const structuredDataTypes = async (page: import('@playwright/test').Page) => {
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  return blocks.flatMap((block) => {
    const data = JSON.parse(block);
    return (data['@graph'] ?? [data]).map((node: { '@type': string }) => node['@type']);
  });
};

for (const path of indexable) {
  test(`${path} has a search-ready title and description`, async ({ page }) => {
    await page.goto(path);
    expect((await page.title()).length, 'title length').toBeLessThanOrEqual(60);
    const description = (await page.locator('meta[name="description"]').getAttribute('content')) ?? '';
    expect(description.length, 'description length').toBeGreaterThanOrEqual(110);
    expect(description.length, 'description length').toBeLessThanOrEqual(160);
    await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
  });
}

for (const path of noindexPosts) {
  test(`${path} is served but not indexed`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex');
  });
}

const expectedTypes: Record<string, string[]> = {
  '/': ['Person', 'ProfessionalService', 'WebSite'],
  '/services/': ['ProfessionalService'],
  '/services/accessibility/': ['Service'],
  '/cv/': ['ProfilePage'],
  '/relaunch/': ['BlogPosting'],
};

for (const [path, types] of Object.entries(expectedTypes)) {
  test(`${path} has ${types.join(', ')} structured data`, async ({ page }) => {
    await page.goto(path);
    expect((await structuredDataTypes(page)).sort()).toEqual(types);
  });
}

test('the sitemap lists every indexable page with a date, and no noindex page', async ({ request }) => {
  const xml = await (await request.get('/sitemap-0.xml')).text();
  const entries = [...xml.matchAll(/<url><loc>https:\/\/bruchner\.dev([^<]+)<\/loc>(<lastmod>[^<]+<\/lastmod>)?/g)];
  const paths = entries.map(([, path]) => path);
  expect(paths.sort()).toEqual([...indexable].sort());
  for (const [, path, lastmod] of entries) expect(lastmod, `${path} lastmod`).toBeTruthy();
});
