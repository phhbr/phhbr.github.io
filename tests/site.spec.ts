import { expect, test } from '@playwright/test';
import { archivedPosts, pages } from './pages';

for (const { path, heading } of pages) {
  test(`${path} renders with one h1 and no console errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });

    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading);
    expect(errors).toEqual([]);
  });
}

for (const path of archivedPosts) {
  test(`archived post ${path} is served at its original URL`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
}

test('external links do not leak the opener or referrer', async ({ page, baseURL }) => {
  for (const path of [...pages.map(({ path }) => path), ...archivedPosts]) {
    await page.goto(path);
    for (const link of await page.locator('a[href^="http"]').all()) {
      const href = (await link.getAttribute('href'))!;
      if (href.startsWith(baseURL!) || href.startsWith('https://bruchner.dev')) continue;
      expect(await link.getAttribute('rel'), `${path}: ${href}`).toBe('noopener noreferrer');
    }
  }
});

test('llms.txt lists the main pages', async ({ request }) => {
  const response = await request.get('/llms.txt');
  expect(response.status()).toBe(200);
  const text = await response.text();
  expect(text).toMatch(/^# Philipp Bruchner\n\n> /);
  for (const path of ['/services/', '/cv/', '/relaunch/']) expect(text).toContain(`https://bruchner.dev${path}`);
});

test('unknown paths show the 404 page', async ({ page }) => {
  const response = await page.goto('/does-not-exist/');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found');
});

test('home page does not scroll horizontally', async ({ page }) => {
  await page.goto('/');
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});

test('home page describes the person and service as JSON-LD', async ({ page }) => {
  await page.goto('/');
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(blocks).toHaveLength(1);
  const graph: { '@type': string }[] = JSON.parse(blocks[0])['@graph'];
  expect(graph.map((node) => node['@type']).sort()).toEqual(['Person', 'ProfessionalService', 'WebSite']);
});

test('no request leaves the site', async ({ page, baseURL }) => {
  const foreign: string[] = [];
  page.on('request', (request) => {
    const url = request.url();
    if (!url.startsWith(baseURL!) && !url.startsWith('data:')) foreign.push(url);
  });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  expect(foreign).toEqual([]);
});

test('legal notice shows e-mail and phone as plain text', async ({ page }) => {
  await page.goto('/legal/');
  const contact = page.locator('#contact + p');
  await expect(contact).toContainText(/E-mail: \S+@\S+/);
  await expect(contact).toContainText(/Phone: \+49/);
  await expect(contact.locator('a')).toHaveCount(0);
});

test('skip link is the first focusable element and targets main', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to content' });
  await expect(skip).toBeFocused();
  await expect(skip).toHaveAttribute('href', '#main');
});

test.describe('theme toggle', () => {
  test.use({ colorScheme: 'light' });

  test('switches theme and remembers the choice', async ({ page }) => {
    await page.goto('/');
    const toggle = page.getByRole('button', { name: 'Dark mode' });
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await expect(page.getByRole('button', { name: 'Dark mode' })).toHaveAttribute('aria-pressed', 'true');
  });
});
