# Migration Plan: phhbr.de → bruchner.dev

Rebrand and rebuild the personal site as a freelance portfolio: Jekyll → Astro, GitHub Pages → self-hosted VPS, deploy-on-push via GitHub Actions.

**Status:** in progress on branch `feat/astro-bruchner-dev`.

---

## Confirmed decisions

| Area | Decision |
|---|---|
| Stack | Migrate Jekyll (Klisé fork) → **Astro**, static output |
| Hosting | **Docker image → GHCR → VPS**, deploy on push to `main` |
| VPS | **Caddy already running** — acts as edge/TLS; site container sits behind it |
| Design | **Full redesign, technical/developer-brand** (mono accents, terminal feel, subtle grid) |
| Content | **Archive posts**; site becomes a portfolio/landing page; add `/services` |
| Domain | **phhbr.de → bruchner.dev**; phhbr.de keeps a permanent 301, renewed indefinitely |
| Contact | Single canonical **hello@bruchner.dev** |
| Repo | Rename `phhbr.github.io` → `bruchner.dev`; default branch `master` → `main` |

## Legacy URLs to preserve

`/hello-world/` · `/still-alive/` · `/looking-for-something-new/` · `/freelance-availability/` · `/leaving-linkedin/` · `/about/` · `/resume/` · `/legal/` · `/notes/` · `/thanks/` · `/tags/` · `/feed.xml` · `/sitemap.xml`

---

## Phase 0 — Prep (no code)

- [ ] 0.1 Register/confirm `bruchner.dev` + DNS A/AAAA → VPS
- [ ] 0.2 Set up `hello@bruchner.dev`; alias old `blog@` / `cv@` / `freelance@` on phhbr.de so inbound isn't lost
- [ ] 0.3 Rename GitHub repo → `bruchner.dev`; rename branch `master` → `main`, set as default
- [ ] 0.4 **Disable GitHub Pages** on the repo — prevents a stale parallel deployment
- [ ] 0.5 VPS: unprivileged `deploy` user (docker group or rootless Docker); create `/srv/bruchner.dev/`
- [ ] 0.6 Dedicated ed25519 deploy key, restricted in `authorized_keys` with `command=`, `no-agent-forwarding,no-port-forwarding,no-pty,no-X11-forwarding`

## Phase 1 — Astro scaffold + content migration

- [ ] 1.1 Astro 7, TypeScript `strict`, static output (no adapter), `site: 'https://bruchner.dev'`
- [ ] 1.2 Integrations: `@astrojs/sitemap`, `@astrojs/rss`, and the built-in **Fonts API** — it downloads and self-hosts fonts at build time, which is what kills the `fonts.gstatic.com` request
- [ ] 1.3 Content collections in `src/content.config.ts`:
  - `posts` — `glob()` over `src/content/posts`; Zod: `title`, `description`, `pubDate` (`z.coerce.date()`), `tags`, `draft`, `archived`
  - `services` — `glob()` over `src/content/services`; Zod: `title`, `summary`, `order`, `skills`
  - `cv` — `file('src/data/cv.yml')`; roles, education, certs, testimonials as *data*, not markup
- [ ] 1.4 Port all 5 posts, **keeping slugs identical**. Fix the `hello-world` filename/frontmatter year mismatch (file → `2020-05-01-hello-world.md`, slug stays `hello-world`)
- [ ] 1.5 Rewrite for the rebrand:
  - `looking-for-something-new` → dated editor's note (LinkedIn is gone, contact is `hello@`), `archived: true`
  - `freelance-availability` → substance moves to `/services`; post gets `archived: true` + a link there
  - `leaving-linkedin` → contact block → `hello@bruchner.dev`; phone number decision pending
  - Global replace `phhbr.de` → `bruchner.dev`; `blog@`/`cv@`/`freelance@` → `hello@`
- [ ] 1.6 Delete: `about.md`, `notes.md`, `thanks.md`, `tags.md`, `now.json`, `browserconfig.xml`, `lighthouse.png`, `scripts/`, `_includes/`, `_layouts/`, `_sass/`, `Gemfile*`, `CNAME`, `.github/ISSUE_TEMPLATE/`, `_site/`

## Phase 2 — Design & pages

- [ ] 2.1 Tokens in `src/styles/tokens.css` — custom properties + `color-scheme` / `light-dark()`. Mono display face for headings and UI chrome, readable sans for body. Self-hosted, subset, `font-display: swap`, preloaded
- [ ] 2.2 Dark mode defaults to `prefers-color-scheme` via CSS only; toggle writes `localStorage` + `data-theme` on `<html>`. **Fix the FOUC** with a tiny blocking inline script in `<head>` — its sha256 goes into the CSP `script-src`
- [ ] 2.3 Layouts: `BaseLayout` (head, meta, OG, JSON-LD `Person` + `ProfessionalService`), `PageLayout`, `PostLayout`
- [ ] 2.4 Components: `Nav`, `Footer`, `Hero`, `ServiceCard`, `TechStack`, `TestimonialCard`, `ThemeToggle`, `Prose`
- [ ] 2.5 Pages:
  - `/` — hero with one-line positioning + availability, 3–4 service blocks, tech stack strip, 2–3 testimonials, single CTA
  - `/services` — full offering, engagement models, availability posture, CTA
  - `/cv` — rendered from `src/data/`; `/resume/` kept as a 301 alias
  - `/writing` — archived post index, clearly labelled as an archive
  - Root-level `[...slug]` — resolves the 5 legacy slugs at their **original paths**
  - `/legal` — Impressum (updated address/email/domain). Must carry a **plain-text** e-mail address and a phone number to satisfy § 5 DDG
  - `/privacy` — separate Datenschutzerklärung; now genuinely accurate (self-hosted fonts, no analytics, no cookies). Must disclose server access logs + retention
  - `/404`
- [ ] 2.6 Visual language: monospace kickers/labels, thin rules, single accent colour, `::selection` styling, subtle dotted/grid background, generous whitespace. Zero client JS beyond the toggle
- [ ] 2.7 A11y: visible focus rings, skip link, `prefers-reduced-motion`, semantic landmarks, contrast ≥ 4.5:1 in both themes — the CV claims a11y expertise, the site should prove it

## Phase 3 — Security hardening

- [ ] 3.1 **Self-hosted fonts** (via 1.2 / 2.1) — removes the only third-party request and the GDPR/Impressum contradiction
- [ ] 3.2 **CSP** in the container Caddyfile:
      `default-src 'none'; script-src 'self' 'sha256-<toggle-hash>'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; form-action 'none'; base-uri 'none'; frame-ancestors 'none'; object-src 'none'; upgrade-insecure-requests`
      Ship `Content-Security-Policy-Report-Only` first, verify clean, then enforce
- [ ] 3.3 Other headers: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()`, `Cross-Origin-Opener-Policy: same-origin`, `Cross-Origin-Resource-Policy: same-origin`, `X-Frame-Options: DENY`. Strip the `Server` header
- [ ] 3.4 **HSTS on the edge Caddy only**: `max-age=63072000; includeSubDomains; preload`. Submit to the preload list only once the domain is stable
- [ ] 3.5 Remove the `<meta name="referrer">` tag (header supersedes it) and the leftover Pinterest `p:domain_verify` token
- [ ] 3.6 **Commit `package-lock.json`** (never gitignore it) + `.github/dependabot.yml` for npm, github-actions and docker, weekly. Add `npm audit --audit-level=high` to CI
- [ ] 3.7 Enable GitHub secret scanning + push protection
- [ ] 3.8 Container hardening: non-root user, `read_only: true` rootfs + `tmpfs` for Caddy's data dir, `security_opt: [no-new-privileges:true]`, `cap_drop: [ALL]`, base images pinned **by digest**, published on `127.0.0.1:<port>` only — never `0.0.0.0`
- [ ] 3.9 CI hardening: pin all actions by commit SHA, least-privilege `permissions:` per job, no `pull_request_target`, no secrets in fork PRs
- [ ] 3.10 All external links get `rel="noopener noreferrer"`. Email stays a `mailto:` — a contact form would add a backend and a spam surface for no real gain. **Exception:** on `/legal` the address must be rendered as **plain text**, since § 5 DDG is not satisfied by a `mailto:` link alone
- [ ] 3.11 `/.well-known/security.txt` with `Contact: mailto:hello@bruchner.dev` and `Expires`
- [ ] 3.12 `robots.txt` + sitemap generated with the correct `https://bruchner.dev` origin

## Phase 4 — Container + CI/CD

- [ ] 4.1 `Dockerfile`, multi-stage:
  - `build`: `node:22-alpine@sha256:…` → `npm ci` → `npm run build` → `/app/dist`
  - `runtime`: `caddy:2-alpine@sha256:…`, copy `dist` → `/srv`, copy `Caddyfile`, non-root, listen on `:8080`
- [ ] 4.2 `Caddyfile` (in-container): serve `/srv`, `file_server`, `try_files`, `handle_errors` → `/404.html`, all headers from 3.2/3.3, `encode zstd gzip`, immutable `Cache-Control` for `/_astro/*`, short/`no-cache` for HTML
- [ ] 4.3 `.dockerignore`: `node_modules`, `dist`, `.git`, `.github`, `.astro`
- [ ] 4.4 `compose.yaml` (versioned in repo, deployed to `/srv/bruchner.dev/`): image `ghcr.io/phhbr/bruchner.dev:latest`, `ports: ["127.0.0.1:8080:8080"]`, restart policy, hardening from 3.8, healthcheck
- [ ] 4.5 **Edge Caddy** (existing, on the host):
  - `bruchner.dev, www.bruchner.dev` → `reverse_proxy 127.0.0.1:8080` + HSTS header
  - `phhbr.de, www.phhbr.de` → `redir https://bruchner.dev{uri} permanent`
  - `www` → apex as a 301
  - Keep a copy of this snippet in the repo under `deploy/`
- [ ] 4.6 `.github/workflows/deploy.yml` on push to `main`:
  - job `build`: checkout → setup-node (cached) → `npm ci` → `npm run build` → `npm audit` → `docker/build-push-action` → GHCR, tagged `sha-<short>` **and** `latest`
  - job `deploy` (needs build): SSH as `deploy`, `docker compose pull && docker compose up -d && docker image prune -f`
  - Secrets: `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`, `VPS_SSH_KNOWN_HOSTS` — pin the host key, **never** `StrictHostKeyChecking=no`
  - Concurrency group to cancel superseded deploys
- [ ] 4.7 `.github/workflows/pr.yml` on pull_request: build + `astro check` + link check + Lighthouse CI. No deploy, no secrets

## Phase 5 — Cutover

- [ ] 5.1 Deploy to `next.bruchner.dev` first, with `X-Robots-Tag: noindex` at the edge; verify
- [ ] 5.2 Flip DNS for `bruchner.dev` apex/www; confirm Caddy issues certs
- [ ] 5.3 Repoint `phhbr.de` DNS from GitHub Pages IPs to the VPS; verify path-preserving 301s
- [ ] 5.4 Add both domains to Google Search Console; submit the new sitemap; use the Change of Address tool for phhbr.de
- [ ] 5.5 Remove `noindex` from production; verify `robots.txt`, `sitemap.xml`, `feed.xml` all emit `bruchner.dev`
- [ ] 5.6 Update GitHub profile, email signatures, external profiles

---

## Verification

1. `npm run build` clean; `astro check` → zero TS errors
2. `docker build .` succeeds; `docker run -p 8080:8080` serves the site locally
3. **securityheaders.com** → **A+** on `bruchner.dev`
4. **Mozilla Observatory** → 100 / A+
5. Devtools Network on hard reload: **zero third-party requests** (especially `fonts.gstatic.com`)
6. CSP report-only produces no console violations before enforcing
7. Lighthouse 100/100/100/100 on `/` and `/services`
8. `curl -sI https://phhbr.de/leaving-linkedin/` → `301`, `Location: https://bruchner.dev/leaving-linkedin/`
9. Every legacy slug resolves 200 or 301 — verify with `lychee` against the old sitemap
10. Push to `main` → confirm end-to-end deploy and that the running container reports the new digest
11. `docker inspect` confirms non-root user, read-only rootfs, no added capabilities
12. `axe` + keyboard-only pass on `/` and `/services` in both themes
13. Dependabot raises at least one PR — proves the lockfile is tracked and scanning works

---

## Scope

**Included:** full Astro rewrite, redesign, container + CI/CD, security headers, dependency scanning, domain migration with 301s, content consolidation.

**Excluded:** blogging going forward (posts archived, not deleted); comments; analytics of any kind; contact form/backend; CMS; i18n / German version.

Existing post URLs are preserved to protect inbound links and SEO. Edge Caddy owns TLS, HSTS and the phhbr.de redirect (host state); container Caddy owns CSP and app headers (repo-versioned).

---

## Security findings being fixed

Carried over from the audit of the current site. The Jekyll site's attack surface was already near zero — no trackers, no third-party scripts, no vulnerable gems — so these are mostly hygiene and hosting-capability issues.

| # | Finding | Fixed by |
|---|---|---|
| 1 | **Google Fonts hotlinked** from `fonts.gstatic.com` (~60 `@font-face` in `_sass/klise/_fonts.scss`). Only third-party request; contradicts the Impressum's privacy claim. ~⅔ of the faces aren't referenced by any font stack | 3.1 |
| 2 | **No security headers at all** — GitHub Pages cannot set them | 3.2, 3.3, 3.4 |
| 3 | `<meta name="referrer" content="no-referrer-when-downgrade">` = permissive browser default | 3.3, 3.5 |
| 4 | **`Gemfile.lock` gitignored** → unreproducible builds, Dependabot blind to CVEs | 3.6 |
| 5 | Unescaped Liquid into `href` in `_layouts/post.html` (`page.tweet`), referencing a non-existent `site.username`. Dead code, latent injection | Phase 1 (rewrite) |
| 6 | `rel="noopener"` without `noreferrer` in `_config.yml` and `_includes/navbar.html` | 3.10 |
| 7 | Leftover Pinterest `p:domain_verify` token of unverified ownership | 3.5 |
| 8 | `now.json` (orphan Zeit Now v2 config) publicly served; `lighthouse.png` and empty `scripts/` also published | 1.6 |
| 9 | Canonical URL wrong — `url: https://phhbr.github.io` vs `CNAME: phhbr.de`, poisoning canonical/OG/sitemap/robots/feed | 1.1, 3.12 |
| 10 | `CNAME` in `exclude:` → never copied to `_site/` | 1.6 (no longer applicable) |
| 11 | Vendored `anchor_headings.html` v1.0.4 vs upstream 1.0.12; vendored theme = no upstream patch flow | Phase 1 (rewrite) |
| 12 | Orphan `</a>` in navbar; `lang="{{ … \| default: " en " }}"` stray spaces in three layouts | Phase 2 (rewrite) |
| 13 | Dead config: `include: [_redirects, .htaccess]` (neither exists), empty unused `comments.html`, unused `google_analytics`/`fb_appid` | 1.6 |
| 14 | Deprecated Sass slash division `$spacing-full / 2` | Phase 2 (rewrite) |
| 15 | Theme toggle defer-loaded → flash of wrong theme | 2.2 |

## Content problems being fixed

- June 2025 post says "reach out here on LinkedIn"; the December post says LinkedIn was deleted — a live contradiction
- June post is framed for recruiters (redundancy narrative, names the NIQ restructuring) — wrong signal for clients
- Three contact addresses: `blog@`, `cv@`, `freelance@`
- The freelance pitch is a chronological post, not a page; `notes.md` is an empty stub sitting in the main nav

---

## Open decisions

### 1. Home address in the Impressum
A *ladungsfähige Anschrift* is legally required, but the current combination of home address + phone number + full employment timeline is a ready-made pretexting dossier.

- **(A)** Keep as-is
- **(B)** **Coworking space membership in Nürnberg** — **chosen, in progress** (see [c/o address setup](./co-address-setup.md))
- **(C)** Keep the address, drop the phone from the blog post, use a VoIP number

> ⚠️ **Correction:** an earlier draft of this plan suggested a *virtual office / mail-forwarding address*. That was wrong — BGH V ZR 210/22 holds that virtual offices are **not** ladungsfähig, so publishing one risks an Abmahnung and a Bußgeld of up to €50,000. Coworking spaces **are** ladungsfähig, even for a single flex desk. Details in [co-address-setup.md](./co-address-setup.md).

Drop the phone number from the post regardless. Note that a phone number is itself a mandatory Impressum field, so it stays on `/legal` — a VoIP business number is the way to keep the private line private.

Until the new address is live, `/legal` keeps the current address. An incorrect Impressum is a worse problem than a private one.

### 2. Deploy mechanism
SSH-from-CI means GitHub holds a key into the VPS.

- **(A)** Forced-command SSH key — **chosen for now**
- **(B)** Pull-based: a systemd timer on the VPS polls GHCR for a new digest; zero inbound access
- **(C)** Tailscale SSH with ephemeral auth keys

Move to (B) later if zero inbound CI access is wanted.

### 3. Testimonials
Seven anonymised quotes that all end in near-identical phrasing ("Any team would be lucky to have him") read as less credible than three varied, attributed ones. Consider 3 with real name + role + company (with permission), or swap them for concrete project outcomes.

### 4. The June 2025 post
Even archived with a note, it's the loudest career signal on the site and it names a former employer's restructuring.

- **(A)** Keep with note
- **(B)** Keep with note + `noindex` — **recommended**
- **(C)** Unpublish
