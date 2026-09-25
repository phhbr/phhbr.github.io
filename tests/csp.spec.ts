import { readFileSync } from 'node:fs';
import { expect, test, type Page } from '@playwright/test';
import { legacyPosts, pages } from './pages';

// The exact policy the server sends, read from the Caddy snippet.
const snippet = readFileSync(new URL('../deploy/security-headers.caddy', import.meta.url), 'utf8');
const policy = snippet.match(/\{args\[0\]\} "([^"]+)"/)?.[1];

// Serve every page with the production CSP header and record violations.
async function withCsp(page: Page) {
  await page.route('**/*', async (route) => {
    const response = await route.fetch();
    const headers = { ...response.headers() };
    if (route.request().resourceType() === 'document') headers['content-security-policy'] = policy!;
    await route.fulfill({ response, headers });
  });
  await page.addInitScript(() => {
    const violations: string[] = [];
    Object.assign(window, { cspViolations: violations });
    document.addEventListener('securitypolicyviolation', (event) =>
      violations.push(`${event.violatedDirective} ${event.blockedURI}`),
    );
  });
}

const violations = (page: Page) =>
  page.evaluate(() => (window as unknown as { cspViolations: string[] }).cspViolations);

test('policy is found in the Caddy snippet', () => {
  expect(policy).toContain("default-src 'none'");
});

for (const path of [...pages.map(({ path }) => path), ...legacyPosts]) {
  test(`${path} works under the production CSP`, async ({ page }) => {
    await withCsp(page);
    await page.goto(path);
    await page.waitForLoadState('networkidle');
    expect(await violations(page)).toEqual([]);
  });
}

test('theme toggle works under the production CSP', async ({ page }) => {
  await withCsp(page);
  await page.goto('/');
  const toggle = page.getByRole('button', { name: 'Dark mode' });
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  expect(await violations(page)).toEqual([]);
});

test('the CSP is really applied: inline code is blocked', async ({ page }) => {
  await withCsp(page);
  await page.goto('/');
  await page.evaluate(() => {
    const script = document.createElement('script');
    script.textContent = 'window.inlineRan = true';
    document.body.append(script);
  });
  expect(await page.evaluate(() => 'inlineRan' in window)).toBe(false);
  expect(await violations(page)).toContainEqual(expect.stringMatching(/^script-src-elem inline/));
});
