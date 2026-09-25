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

for (const [path, image] of [
  ['/en/', 'og.png'],
  ['/de/', 'og-de.png'],
]) {
  test(`${path} has a link preview image that exists`, async ({ page, request }) => {
    await page.goto(path);
    const content = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect(content).toBe(`https://bruchner.dev/${image}`);
    const response = await request.get(new URL(content!).pathname);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toBe('image/png');
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
  });
}

const expectedTypes: Record<string, string[]> = {
  '/en/': ['Person', 'ProfessionalService', 'WebSite'],
  '/de/': ['Person', 'ProfessionalService', 'WebSite'],
  '/en/services/': ['ProfessionalService'],
  '/de/leistungen/': ['ProfessionalService'],
  '/en/services/accessibility/': ['Service'],
  '/de/leistungen/barrierefreiheit/': ['Service'],
  '/en/cv/': ['ProfilePage'],
  '/de/lebenslauf/': ['ProfilePage'],
  '/en/relaunch/': ['BlogPosting'],
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
