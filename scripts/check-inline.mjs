// Fails the build if any page ships inline script or style (plan 3.3).
// The CSP is `script-src 'self'; style-src 'self'` with no hashes, so inline
// code would be blocked in production; catch it here instead.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';

const rules = [
  { name: '<style> element', pattern: /<style[\s>]/gi },
  { name: 'style= attribute', pattern: /\sstyle\s*=/gi },
  {
    name: 'inline <script>',
    // A <script> without src, unless it is a JSON-LD data block.
    pattern: /<script(?![^>]*\ssrc\s*=)(?![^>]*type\s*=\s*["']?application\/ld\+json)[^>]*>/gi,
  },
];

const htmlFiles = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return htmlFiles(path);
    return entry.name.endsWith('.html') ? [path] : [];
  });

const violations = htmlFiles(DIST).flatMap((file) => {
  const html = readFileSync(file, 'utf8');
  return rules.flatMap(({ name, pattern }) =>
    [...html.matchAll(pattern)].map((match) => `${file}: ${name}: ${match[0].slice(0, 80)}`),
  );
});

if (violations.length > 0) {
  console.error(`Inline code found (blocked by CSP):\n${violations.join('\n')}`);
  process.exit(1);
}
console.log(`check-inline: ${htmlFiles(DIST).length} pages clean`);
