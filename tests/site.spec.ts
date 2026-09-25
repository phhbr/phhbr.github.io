import { expect, test } from '@playwright/test';
import { archivedPosts, legacyRedirects, pages } from './pages';

for (const { path, heading, lang } of pages) {
  test(`${path} renders with one h1, the right language and no console errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });

    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading);
    await expect(page.locator('html')).toHaveAttribute('lang', lang);
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
  for (const path of ['/en/services/', '/en/cv/', '/en/relaunch/', '/de/']) {
    expect(text).toContain(`https://bruchner.dev${path}`);
  }
});

test('unknown paths show the 404 page', async ({ page }) => {
  const response = await page.goto('/does-not-exist/');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found');
});

for (const path of ['/en/', '/de/']) {
  test(`${path} does not scroll horizontally`, async ({ page }) => {
    await page.goto(path);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
}

// Astro strips whitespace JSX-style: a line break between text and a link
// disappears, gluing words together ("projectsor").
test('no words are glued to links', async ({ page }) => {
  for (const path of [...pages.map(({ path }) => path), ...archivedPosts]) {
    await page.goto(path);
    const glued = await page.evaluate(() =>
      [...document.querySelectorAll('main a')].flatMap((link) => {
        const textOf = (node: ChildNode | null) => (node?.nodeType === Node.TEXT_NODE ? node.textContent ?? '' : '');
        const before = textOf(link.previousSibling);
        const after = textOf(link.nextSibling);
        const text = link.textContent ?? '';
        const problems = [];
        if (/[A-Za-z]$/.test(before) && /^[A-Za-z]/.test(text)) problems.push(`${before.slice(-10)}|${text}`);
        if (/[A-Za-z]$/.test(text) && /^[A-Za-z]/.test(after)) problems.push(`${text}|${after.slice(0, 10)}`);
        return problems;
      }),
    );
    expect(glued, path).toEqual([]);
  }
});

test('no request leaves the site', async ({ page, baseURL }) => {
  const foreign: string[] = [];
  page.on('request', (request) => {
    const url = request.url();
    if (!url.startsWith(baseURL!) && !url.startsWith('data:')) foreign.push(url);
  });
  await page.goto('/en/');
  await page.waitForLoadState('networkidle');
  expect(foreign).toEqual([]);
});

for (const [path, email, phone] of [
  ['/en/legal/', 'E-mail', 'Phone'],
  ['/de/impressum/', 'E-Mail', 'Telefon'],
]) {
  test(`${path} shows e-mail and phone as plain text`, async ({ page }) => {
    await page.goto(path);
    const contact = page.locator('#contact + p');
    await expect(contact).toContainText(new RegExp(`${email}: \\S+@\\S+`));
    await expect(contact).toContainText(new RegExp(`${phone}: \\+49`));
    await expect(contact.locator('a')).toHaveCount(0);
  });
}

test('skip link is the first focusable element and targets main', async ({ page }) => {
  await page.goto('/en/');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to content' });
  await expect(skip).toBeFocused();
  await expect(skip).toHaveAttribute('href', '#main');
});

test.describe('theme toggle', () => {
  test.use({ colorScheme: 'light' });

  test('switches theme and remembers the choice', async ({ page }) => {
    await page.goto('/en/');
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

test('the German theme toggle is labelled in German', async ({ page }) => {
  await page.goto('/de/');
  await expect(page.getByRole('button', { name: 'Dunkelmodus' })).toBeVisible();
});

test.describe('languages', () => {
  // Each page's language switch leads to the same page in the other language,
  // or to that language's home page when there is no translation.
  const switchCases = [
    ['/en/', 'Deutsch', '/de/'],
    ['/de/', 'English', '/en/'],
    ['/en/work/', 'Deutsch', '/de/projekte/'],
    ['/de/lebenslauf/', 'English', '/en/cv/'],
    ['/en/services/accessibility/', 'Deutsch', '/de/leistungen/barrierefreiheit/'],
    ['/de/impressum/', 'English', '/en/legal/'],
    ['/en/relaunch/', 'Deutsch', '/de/'],
  ];

  for (const [from, name, to] of switchCases) {
    test(`switch on ${from} leads to ${to}`, async ({ page }) => {
      await page.goto(from);
      const nav = page.getByRole('navigation', { name: /^(Language|Sprache)$/ });
      await nav.getByRole('link', { name }).click();
      await expect(page).toHaveURL(to);
    });
  }

  test('the switch marks the current language', async ({ page }) => {
    await page.goto('/de/projekte/');
    const nav = page.getByRole('navigation', { name: 'Sprache' });
    await expect(nav.getByRole('link', { name: 'Deutsch' })).toHaveAttribute('aria-current', 'true');
    await expect(nav.getByRole('link', { name: 'English' })).not.toHaveAttribute('aria-current');
  });

  // Every hreflang alternate must exist and point back (search engines ignore one-way pairs).
  for (const { path } of pages) {
    test(`${path} hreflang alternates are reciprocal`, async ({ page }) => {
      await page.goto(path);
      const alternates = await page
        .locator('link[rel="alternate"][hreflang]:not([hreflang="x-default"])')
        .evaluateAll((links) => links.map((link) => new URL(link.getAttribute('href')!).pathname));
      if (alternates.length === 0) return;
      expect(alternates).toContain(path);
      for (const other of alternates.filter((p) => p !== path)) {
        const response = await page.goto(other);
        expect(response?.status(), other).toBe(200);
        const back = await page
          .locator('link[rel="alternate"][hreflang]')
          .evaluateAll((links) => links.map((link) => new URL(link.getAttribute('href')!).pathname));
        expect(back, other).toContain(path);
      }
    });
  }

  test('the home pages name the language chooser as x-default', async ({ page }) => {
    for (const path of ['/en/', '/de/']) {
      await page.goto(path);
      await expect(page.locator('link[hreflang="x-default"]')).toHaveAttribute('href', 'https://bruchner.dev/');
    }
  });
});

for (const [from, to] of legacyRedirects) {
  test(`old URL ${from} leads to ${to}`, async ({ page }) => {
    await page.goto(from);
    await expect(page).toHaveURL(to);
  });
}
