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

The site is in English (`/en/`) and German (`/de/`); the bare domain sends visitors to one of them by browser language (in Caddy). Posts are English only.

- `src/i18n/index.ts`: languages, the route table (German pages have German paths) and shared interface text
- `src/config.ts`: site identity, contact details, availability and Impressum data
- `src/views/`: page templates shared by both languages; `src/pages/en/` and `src/pages/de/` route to them
- `src/content/services/{en,de}/`: service offerings; the file name is the slug, `key` pairs translations
- `src/content/posts/`: posts; the filename minus its date prefix is the slug under `/en/`
- `src/data/`: CV and projects, with `{ en, de }` wherever the text differs; clients and employers are described by sector, never named
- `scripts/check-inline.mjs`: fails the build on inline scripts or styles, which the CSP blocks
- `scripts/og-image.mjs`: renders the link preview image with the site's fonts
- `tests/`: Playwright smoke tests, axe accessibility checks and a CSP test (desktop and mobile)
- `deploy/`: edge Caddy config, its Docker test, and the server/GitHub setup ([deploy/README.md](deploy/README.md))
- `.github/workflows/`: CI on pull requests; deploy on push to `main` (rsync to the VPS)
