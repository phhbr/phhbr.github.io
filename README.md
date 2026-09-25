# bruchner.dev

Personal site and freelance portfolio of Philipp Bruchner. Built with [Astro](https://astro.build) as a static site.

## Development

Requires Node.js 22.12 or newer (see `.nvmrc`).

```bash
npm ci
npm run dev      # http://localhost:4321
npm run build    # astro check + build + inline-code guard → dist/
npm run preview
```

## Layout

- `src/config.ts`: site identity, contact address and Impressum data
- `src/content/posts/`: archived posts; the filename minus its date prefix is the URL slug
- `src/content/services/`: service offerings shown on `/` and `/services/`
- `src/data/cv.ts`: CV data rendered on `/cv/`
- `scripts/check-inline.mjs`: fails the build on inline scripts or styles, which the CSP blocks

The migration from the former Jekyll site at phhbr.de is tracked in [docs/migration-plan.md](docs/migration-plan.md).
