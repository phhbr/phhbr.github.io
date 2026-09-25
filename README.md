# bruchner.dev

Personal site and freelance portfolio of Philipp Bruchner. Built with [Astro](https://astro.build) as a static site.

## Development

Requires Node.js 22.12 or newer (see `.nvmrc`) and pnpm, pinned in `package.json` (Corepack picks it up).

```bash
pnpm install
pnpm dev         # http://localhost:4321
pnpm build       # astro check + build + inline-code guard → dist/
pnpm test        # Playwright + axe against the build (run `pnpm build` first)
```

Dependencies are only installed once a release is at least 5 days old (`minimumReleaseAge` in `pnpm-workspace.yaml`), and install scripts run only when allowed there.

## Layout

- `src/config.ts`: site identity, contact address and Impressum data
- `src/content/posts/`: archived posts; the filename minus its date prefix is the URL slug
- `src/content/services/`: service offerings shown on `/` and `/services/`
- `src/data/cv.ts`: CV data rendered on `/cv/`
- `scripts/check-inline.mjs`: fails the build on inline scripts or styles, which the CSP blocks
- `tests/`: Playwright smoke tests, axe accessibility checks and a CSP test (desktop and mobile)
- `deploy/`: server config for the edge Caddy (security headers)

The migration from the former Jekyll site at phhbr.de is tracked in [docs/migration-plan.md](docs/migration-plan.md).
