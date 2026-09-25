# bruchner.dev

[![Deploy](https://github.com/phhbr/bruchner.dev/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/phhbr/bruchner.dev/actions/workflows/deploy.yml)

Personal site and freelance portfolio of Philipp Bruchner, live at **[bruchner.dev](https://bruchner.dev)**. Built with [Astro](https://astro.build) as a static site.

## Development

Requires Node.js 22.12 or newer (see `.nvmrc`) and pnpm, pinned in `package.json` (Corepack picks it up).

```bash
pnpm install
pnpm dev         # http://localhost:4321
pnpm build       # astro check + build + inline-code guard → dist/
pnpm test        # Playwright + axe against the build (run `pnpm build` first)
pnpm og          # re-render public/og.png, the link preview image
```

Dependencies are only installed once a release is at least 5 days old (`minimumReleaseAge` in `pnpm-workspace.yaml`), and install scripts run only when allowed there.

## Layout

- `src/config.ts`: site identity, contact address and Impressum data
- `src/content/posts/`: archived posts; the filename minus its date prefix is the URL slug
- `src/content/services/`: service offerings shown on `/` and `/services/`
- `src/data/cv.ts`: CV data rendered on `/cv/`
- `scripts/check-inline.mjs`: fails the build on inline scripts or styles, which the CSP blocks
- `scripts/og-image.mjs`: renders the link preview image with the site's fonts
- `tests/`: Playwright smoke tests, axe accessibility checks and a CSP test (desktop and mobile)
- `deploy/`: edge Caddy config, its Docker test, and the server/GitHub setup ([deploy/README.md](deploy/README.md))
- `.github/workflows/`: CI on pull requests; deploy on push to `main` (rsync to the VPS)
