# Migration Plan: phhbr.de → bruchner.dev

Rebrand and rebuild the personal site as a freelance portfolio: Jekyll → Astro, GitHub Pages → the existing Caddy on the VPS, deploy-on-push via GitHub Actions.

**Status:** in progress on branch `feat/astro-bruchner-dev`. Phases 1 and 2 done (2026-09-25). Package manager is pnpm 12 with a 5-day `minimumReleaseAge`. Playwright smoke tests and axe (WCAG 2.2 AA, both themes) in `tests/`. Phases 3 and 4 done in the repo (2026-09-25): Caddy config, workflows and `deploy/README.md`. Next: host and GitHub setup (0.3, 0.4, `deploy/README.md`), then cutover. Contact address is `hello@phhbr.de` until 0.2 is done.

---

## Confirmed decisions

| Area | Decision |
|---|---|
| Stack | Migrate Jekyll (Klisé fork) → **Astro**, static output |
| Hosting | **Static files served by the existing edge Caddy** on the VPS. No container, no registry, no second Caddy |
| Deploy | CI builds `dist/` and **rsyncs** it to the VPS through a key locked to `rrsync`. The deploy user is genuinely unprivileged (no shell, no docker group, no sudo) |
| Design | **Full redesign, technical/developer-brand** (mono accents, terminal feel, subtle grid) |
| Content | **Archive posts**; site becomes a portfolio/landing page; add `/services` |
| Domain | **phhbr.de → bruchner.dev**; phhbr.de keeps a permanent 301, renewed indefinitely |
| Contact | Single canonical **hello@bruchner.dev** on Proton Mail (same account as phhbr.de) |
| Repo | Rename `phhbr.github.io` → `bruchner.dev`; default branch `master` → `main`. **Both happen after cutover** (Phase 6) |

**Why not a container:** the site is ~10 static HTML files. Docker + GHCR + a second Caddy would add a registry credential, a root-equivalent `docker` group member, digest-pinning upkeep and a split header config, and in exchange it would only serve files the edge Caddy can already serve. The real attack surface is the VPS itself, and every extra moving part on it makes that surface bigger.

## Legacy URLs to preserve

| Old path | New behaviour |
|---|---|
| `/hello-world/` `/still-alive/` `/freelance-availability/` `/leaving-linkedin/` | 200 at the **same path** |
| `/looking-for-something-new/` | 301 → `/relaunch/` (post removed, open decision 4) |
| `/legal/` | 200 |
| `/resume/` | 301 → `/cv/` |
| `/about/` `/notes/` `/thanks/` | 301 → `/` |
| `/tags/` | 301 → `/writing/` |
| `/feed.xml` | 200 (RSS 2.0 replaces jekyll-feed's Atom at the same URL) |
| `/sitemap.xml` | 301 → `/sitemap-index.xml` (`@astrojs/sitemap` does not emit `sitemap.xml`) |

All 301s live in the edge Caddy config (4.1). Astro's `redirects` option is **not** used: in static output it emits meta-refresh pages, not real 301s.

---

## Phase 0 — Prep (no code)

- [x] 0.0 **Delegate DNSSEC for phhbr.de.** Done 2026-09-25: DS `15027 13 2 30CACDA8…55CC6FEB` at DENIC, validated by 1.1.1.1. netcup's form defaults the algorithm to DSA (3); it must be set to ECDSAP256SHA256 (13) or DENIC rejects the key. deSEC signs the zone, but there is no DS record at DENIC, so the signatures are never checked (and mail DNS can be spoofed). Copy the DS records from deSEC (domain → ⓘ) into phhbr.de's registrar and verify with dnsviz.net. This is also the prerequisite for 0.1: deSEC raises the domain limit (currently 1) only once existing domains are securely delegated
- [x] 0.1 **DNS for bruchner.dev stays at netcup** (decided 2026-09-25, instead of moving to deSEC): the zone already holds the `*` wildcard and the `vbs` records, and netcup's DNSSEC is one switch. DNSSEC is on (DS `54766 8 2 …` at `.dev`, validated). Apex A `5.181.51.153` / AAAA `2a03:4000:3f:2b1:449e:eff:fe64:244c` added; `www` is covered by the wildcard
- [ ] 0.2 **Mail: `hello@bruchner.dev` on Proton** (phhbr.de is already on Proton; check that the plan allows a second custom domain)
  - Proton → Settings → Domain names → Add `bruchner.dev`
  - DNS: Proton `TXT` verification token · `MX 10 mail.protonmail.ch.` + `MX 20 mailsec.protonmail.ch.` · `TXT "v=spf1 include:_spf.protonmail.ch ~all"` · three DKIM `CNAME`s (`protonmail`, `protonmail2`, `protonmail3` `._domainkey`, targets from the Proton UI) · `_dmarc TXT "v=DMARC1; p=quarantine"`
  - Create the address `hello@bruchner.dev`, set it as the default sender for new mail
  - Then switch `SITE.email` in `src/config.ts` and replace `hello@phhbr.de` in `src/content/posts/` (the site uses it as the interim address)
  - Keep `blog@` / `cv@` / `freelance@phhbr.de` receiving; phhbr.de's MX/SPF/DKIM/DMARC are **never touched** during this migration
  - Verify: all Proton DNS checks green, send to a Gmail account (SPF/DKIM/DMARC `pass` in headers), mail-tester.com ≥ 9/10
- [ ] 0.3 VPS (commands in `deploy/README.md` §1): create `deploy` user with **locked password** (it needs `/bin/sh` only because sshd runs the forced command through it), not in `docker`/`sudo`; `/srv/bruchner.dev/site/` owned by `deploy`, world-readable so Caddy can serve it
- [ ] 0.4 Dedicated ed25519 deploy key in `~deploy/.ssh/authorized_keys`: `command="rrsync /srv/bruchner.dev/site",restrict` (`restrict` = no forwarding, no PTY, no `~/.ssh/rc`). The key can write into that one directory and do nothing else. Tested in Debian bookworm (rsync 3.2.7): the deploy flags pass rrsync, a repeat run transfers nothing, `..` paths are refused. Commands in `deploy/README.md` §2
- [ ] 0.5 Optional: `CAA` records on bruchner.dev. Caddy falls back to ZeroSSL when Let's Encrypt fails, so allow **both** (`0 issue "letsencrypt.org"`, `0 issue "sectigo.com"`) or pin Caddy to Let's Encrypt

## Phase 1 — Astro scaffold + content migration

- [x] 1.1 Astro 7, **current stable, pinned**; TypeScript `strict`; static output (no adapter); `site: 'https://bruchner.dev'`; `trailingSlash: 'always'` (matches Jekyll's `/:title/` URLs); `build.inlineStylesheets: 'never'` (see 3.2)
- [x] 1.2 `@astrojs/sitemap` integration; `@astrojs/rss` helper in `src/pages/feed.xml.ts`; fonts (chosen in 2.1) self-hosted via **Fontsource** packages (bundled into the external stylesheet, no `fonts.gstatic.com`). Astro's `<Font />` component is **not** used, because it emits inline `<style>` tags that the CSP blocks
- [x] 1.3 Content collections in `src/content.config.ts`:
  - `posts`: `glob()` over `src/content/posts` with a **`generateId` that strips the `YYYY-MM-DD-` prefix**, so `2022-03-01-still-alive.md` → `still-alive`. Zod: `title`, `description`, `pubDate` (`z.coerce.date()`), `archived` (default `true`). No tags, no drafts
  - `services`: `glob()` over `src/content/services`; Zod: `title`, `summary`, `order`, `skills`
  - CV: typed module `src/data/cv.ts` rather than a collection, since it is one structured document, not a set of entries; roles, education, certs, testimonials as *data*, not markup
- [x] 1.4 Port all 5 posts, **keeping slugs identical**. Fix the `hello-world` filename/frontmatter year mismatch (file → `2020-05-01-hello-world.md`, slug stays `hello-world`)
- [ ] 1.5 Rewrite for the rebrand (done except the personal-detail pass and open decision 4):
  - `looking-for-something-new` → removed, URL redirects to `/relaunch/` (open decision 4)
  - `freelance-availability` → substance moves to `/services`; post gets an editor's note + a link there
  - `leaving-linkedin` → contact block → `hello@bruchner.dev`; phone number removed
  - [x] `hello-world` / `still-alive` → **personal-detail pass**, the same way open decision 1 is handled: family details, employer, and the home-automation/solar/garden inventory are pretexting material
  - Global replace `phhbr.de` → `bruchner.dev`; `blog@`/`cv@`/`freelance@` → `hello@` (interim `hello@phhbr.de`, see 0.2)
  - Feed item GUIDs change origin (`phhbr.github.io` → `bruchner.dev`), so feed readers will show the 5 posts as new once. Accepted
- [x] 1.6 Delete: `about.md`, `notes.md`, `thanks.md`, `tags.md`, `now.json`, `browserconfig.xml`, `lighthouse.png`, `scripts/`, `_includes/`, `_layouts/`, `_sass/`, `Gemfile*`, `CNAME`, `.github/ISSUE_TEMPLATE/`, `_site/`. Their URLs are handled by the redirect map above

## Phase 2 — Design & pages

- [x] 2.1 Tokens in `src/styles/tokens.css`: custom properties + `color-scheme` / `light-dark()`. **Martian Mono** (variable, width axis) for headings and UI chrome, **Atkinson Hyperlegible Next** for body. Palette: blueprint paper `#EDF1F5` / deep blue `#0E1620`, ink, muted, one inspector-blue accent; all text pairs ≥ 5.5:1. Self-hosted, subset, `font-display: swap`, preloaded via `<link rel="preload">` to the hashed font URL
- [x] 2.2 Dark mode defaults to `prefers-color-scheme` via CSS only; toggle writes `localStorage` + `data-theme` on `<html>`. **Fix the FOUC** with a tiny **external, blocking** `public/theme.js` loaded as `<script is:inline src="/theme.js">` in `<head>`. One small, cacheable same-origin request, with no CSP hash to keep in sync
- [x] 2.3 `BaseLayout` (head, meta, OG, font preloads); JSON-LD `Person` + `ProfessionalService` (with the services as an `OfferCatalog`) + `WebSite` on `/`, country only, no street address (`ld+json` isn't executed, so CSP doesn't apply). Separate page/post layouts turned out unnecessary
- [x] 2.4 Components: `Nav`, `Footer`, `Hero`, `TechStack`, `Testimonial`, `ThemeToggle`. Services use a ruled list instead of cards; long text uses a `.prose` class
- [x] 2.5 Pages:
  - `/`: hero with one-line positioning + availability, 4 services, tech stack, 3 testimonials, single CTA. The hero shows the name as if selected in the browser inspector: highlight, guide lines and a tooltip with its real role, name and contrast ratio (decorative, `aria-hidden`)
  - `/services`: full offering, engagement models, availability posture, CTA
  - `/cv`: rendered from `src/data/`; `/resume/` → 301 at the edge
  - `/writing`: archived post index, clearly labelled as an archive
  - `src/pages/[slug].astro`: the 5 legacy post slugs at their **original paths** (a single segment, not a `[...slug]` catch-all)
  - `/legal`: Impressum (updated address/email/domain). Must carry a **plain-text** e-mail address and a phone number (§ 5 DDG). Add the **USt-IdNr** if one exists (§ 5 Abs. 1 Nr. 6 DDG), and name the person responsible for the editorial content (§ 18 Abs. 2 MStV) since posts stay online
  - `/privacy`: separate Datenschutzerklärung that is now accurate: self-hosted fonts, no analytics, no cookies. Must name the **VPS provider** (AVV in place) and **Proton** (mail) as processors, and describe access logging exactly as configured in 4.1
  - `/404`
- [x] 2.6 Visual language: monospace kickers/labels, thin rules, single accent colour, `::selection` styling, subtle dotted/grid background, generous whitespace. Zero client JS beyond the toggle
- [x] 2.7 A11y, checked by axe-core in `tests/a11y.spec.ts` on every page in both themes: visible focus rings, skip link, `prefers-reduced-motion`, semantic landmarks, contrast ≥ 4.5:1 in both themes. The CV claims a11y expertise, so the site should show it

## Phase 3 — Security hardening

- [x] 3.1 **Self-hosted fonts** (via 1.2 / 2.1): removes the only third-party request and the GDPR/Impressum contradiction. Tested: no request leaves the site
- [x] 3.2 **CSP as a static header, no inline code anywhere**, in `deploy/security-headers.caddy`:
      `default-src 'none'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; manifest-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'`
      Only what the site uses: no `data:` images, no fetches, and `object-src` is covered by `default-src 'none'`. `upgrade-insecure-requests` is dropped: every resource is same-origin, so it would do nothing in production and breaks local testing over http.
      The snippet takes the header name as an argument, so it ships as `Content-Security-Policy-Report-Only` first (5.1) and is enforced in 5.2.
      `tests/csp.spec.ts` reads the policy from the snippet, serves every page and the theme toggle under it, and fails on any violation; it also checks that injected inline script is blocked.
      *Why no hashes:* Astro's `security.csp` emits a `<meta>` CSP, and a header CSP applies on top of it (both must pass). With `default-src 'none'` in the header, hashed inline code would still be blocked unless the header is loosened. A meta CSP also can't express `frame-ancestors` or report-only. A policy with no inline code never drifts
- [x] 3.3 **CI guard for 3.2**: `scripts/check-inline.mjs`, part of `pnpm run build`: fails if any `dist/**/*.html` contains a `<style>` element, a `style=` attribute, or a `<script>` without `src` (except `type="application/ld+json"`)
- [x] 3.4 Other headers (same snippet, checked against Caddy 2.11 in Docker): `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`, `Cross-Origin-Opener-Policy: same-origin`, `Cross-Origin-Resource-Policy: same-origin`, `X-Frame-Options: DENY`. Strip the `Server` header. (No `interest-cohort`: Chrome logs it as an unrecognised feature, which costs the Lighthouse Best Practices 100)
- [x] 3.5 **HSTS** on bruchner.dev (same snippet, imported only by the bruchner.dev site block): `max-age=63072000; includeSubDomains; preload`. No preload-list submission is needed, because the whole `.dev` TLD is already preloaded
- [x] 3.6 Remove the `<meta name="referrer">` tag (header supersedes it) and the leftover Pinterest `p:domain_verify` token (gone with the Jekyll templates)
- [x] 3.7 **pnpm 12** pinned via `packageManager` (itself at least 5 days old). `pnpm-workspace.yaml`: `minimumReleaseAge: 7200` (5 days) and `allowBuilds` (install scripts denied unless listed; esbuild's is not needed). **Commit `pnpm-lock.yaml`** + `.github/dependabot.yml` for `npm` (covers pnpm lockfiles) and `github-actions`, weekly, **grouped**, with `cooldown.default-days: 5` so its PRs respect the same age rule. `.github/dependabot.yml` only takes effect once it is on the default branch (6.3); check then that Dependabot handles the pnpm 12 lockfile. `pnpm audit --audit-level=high` runs as a **report-only** job (4.2), not a deploy gate: an advisory in a build-only dependency must not block an urgent Impressum fix
- [x] 3.8 GitHub secret scanning + push protection enabled (2026-09-25). Once the repo is private (6.2), repo-level secret scanning needs GitHub's paid Secret Protection; push protection for your own account keeps working
- [x] 3.9 Host side (repo part; applied with 0.3/0.4): the deploy key can only run `rrsync` into `/srv/bruchner.dev/site` (0.4). Uploaded files are `D755,F644`; Caddy only reads. CI never writes Caddy config
- [x] 3.10 CI hardening: all actions pinned by commit SHA (each release at least 5 days old), `permissions: {}` at workflow level and least privilege per job, `persist-credentials: false`, no `pull_request_target`, no secrets outside the `production` environment, secrets passed via `env:` not inline. `actionlint` and `zizmor` clean (one low note about the new `$/` self-reference syntax, left as the documented `./`)
- [x] 3.11 All external links get `rel="noopener noreferrer"`: components set it, and a Sätteri HAST plugin (`src/utils/external-links.ts`) adds it to Markdown links; tested on every page. Email stays a `mailto:`, since a contact form would add a backend and a spam surface for no real gain. **Exception:** on `/legal` the address must be rendered as **plain text**, since § 5 DDG is not satisfied by a `mailto:` link alone
- [x] 3.12 `/.well-known/security.txt` with `Contact:` from `SITE.email` and an `Expires` refreshed on every build
- [x] 3.13 `robots.txt` pointing at `https://bruchner.dev/sitemap-index.xml`; sitemap generated with the correct origin
- [x] 3.14 `/llms.txt` (llmstxt.org format) generated from config, services and posts. Not a security item, but the same kind of machine-readable file; few crawlers read it yet, so it's cheap and optional

## Phase 4 — Serving + CI/CD

- [x] 4.1 `deploy/bruchner.dev.caddy`: the edge site blocks, **versioned in the repo and applied to the host by hand** (`deploy/README.md` §3). `deploy/test-caddy.sh` runs it in Docker against the build with Caddy's internal CA and checks 30 things: headers, caching, compression, every legacy redirect, 404, www. It caught that `handle_errors` does not inherit headers, so the per-site headers are one local snippet imported in both routes; that snippet also holds the 5.1 → 5.2 launch switch:
  - `bruchner.dev`: `root * /srv/bruchner.dev/site`, `file_server`, `encode zstd gzip`, `import bruchner_dev_headers …` from `deploy/security-headers.caddy` (3.2–3.5)
  - `Cache-Control: public, max-age=31536000, immutable` for `/_astro/*`; `no-cache` for HTML
  - Legacy redirect map from the table above (`redir … permanent`), with and without trailing slash
  - `handle_errors 404` → rewrite to `/404.html`, with the same headers
  - Access logging: **off** (no `log` directive), matching the privacy page
  - `www.bruchner.dev` → `redir https://bruchner.dev{uri} permanent`
  - `phhbr.de, www.phhbr.de` → `redir https://bruchner.dev{uri} permanent`, commented out until 5.4 (legacy paths then hit the map above; two hops is acceptable)
- [x] 4.2 `.github/workflows/deploy.yml`, triggered on push to `main` (and to `feat/astro-bruchner-dev` until 6.3, because `workflow_dispatch` only works once the file is on the default branch) **and** `workflow_dispatch` (with a `ref` input). It calls `ci.yml` as its first stage:
  - `ci.yml` job `build`: checkout → `pnpm/action-setup` (version from `packageManager`) → setup-node (pnpm cache) → `pnpm install --frozen-lockfile` → `pnpm run build` (`astro check`, build, inline guard) → `dist/version.txt` → `pnpm test` → lychee (internal links, offline) → `deploy/test-caddy.sh` → upload artifact (with hidden files, for `.well-known/`)
  - job `deploy` (needs ci, `production` environment): `rsync -rc --delete-delay --delay-updates --chmod=D755,F644 dist/ deploy@$VPS_HOST:` → `https://bruchner.dev/version.txt` must equal the SHA
  - Secrets in the `production` environment, which only `main` and the feature branch may use: `VPS_HOST`, `VPS_SSH_KEY`, `VPS_SSH_KNOWN_HOSTS`. Pin the host key; **never** `StrictHostKeyChecking=no`. Setup in `deploy/README.md` §4
  - Concurrency group with `cancel-in-progress: false`: queue deploys, don't kill one mid-rsync
  - **Rollback** = `workflow_dispatch` with an earlier `ref`. Git is the release history
- [x] 4.3 `.github/workflows/ci.yml` on pull_request (and as deploy's first stage): the build job above plus a report-only `pnpm audit`. No deploy, no secrets. **Lighthouse CI dropped:** it would pull a large, unpinned toolchain into CI for scores the tests already cover (axe, CSP, no third-party requests); Lighthouse stays a manual check (Verification 6)

## Phase 5 — Cutover

Nothing is merged to `master` during this phase: GitHub Pages builds phhbr.de from `master`, and merging the Astro branch there would make Pages rebuild the live site from Astro source. Pre-cutover deploys run on push to the feature branch (see 4.2).

- [x] 5.1 (2026-09-25) bruchner.dev A/AAAA (apex + `www`) → VPS. Install `deploy/bruchner.dev.caddy` **without** the phhbr.de block and with `X-Robots-Tag: noindex`. Deploy, verify everything in *Verification* except the phhbr.de items. First deploy `97fbf02` via push: `version.txt` matches, all headers live (also on 404s), 16 URLs 200, all legacy redirects 301, zstd + immutable assets, zero report-only CSP violations on 12 pages in both themes in Chromium. The VPS is in netcup's German network (`DE-NETCUP-SERVER`), so the relaunch post's hosting claim holds
- [ ] 5.2 Launch switch in `bruchner_dev_response_headers` (`deploy/README.md`): CSP from report-only to enforced, remove `noindex`. Repo side done 2026-09-25 (Caddy test passes in launch mode); applied once the file is copied to the server; verify `robots.txt`, `sitemap-index.xml`, `feed.xml` all emit `bruchner.dev`
- [ ] 5.3 24h before: lower the TTL on phhbr.de's A/AAAA
- [ ] 5.4 Add the phhbr.de block to the edge Caddy; repoint phhbr.de **A/AAAA only** from the GitHub Pages IPs to the VPS (MX, SPF, DKIM, DMARC, Proton verification untouched). Confirm cert issuance and path-preserving 301s
- [ ] 5.5 Google Search Console: add bruchner.dev, submit `sitemap-index.xml`, then use **Change of Address** on phhbr.de (requires the 301s from 5.4 to be live)
- [ ] 5.6 Update GitHub profile, email signatures, external profiles
- [ ] 5.7 Set `pubDate` of `src/content/posts/2026-09-25-relaunch.md` (and its filename date) to the go-live date

## Phase 6 — Cleanup (after 5.4 has been stable for about a week)

- [ ] 6.1 **Disable GitHub Pages** on the repo
- [ ] 6.2 Rename repo → `bruchner.dev`; rename `master` → `main`, set as default; **make the repo private** (Pages no longer needs it public, and the history holds personal details)
- [ ] 6.3 Merge the feature branch via PR into `main`; from here on push-to-`main` deploys

---

## Verification

1. `pnpm run build` clean; `astro check` → zero TS errors; 3.3 inline guard passes
2. **securityheaders.com** → **A+** on `bruchner.dev`
3. **Mozilla Observatory** → 100 / A+
4. Devtools Network on hard reload: **zero third-party requests** (especially `fonts.gstatic.com`)
5. CSP report-only produces no console violations in either theme, including after toggling
6. Lighthouse 100/100/100/100 on `/` and `/services`
7. `curl -sI https://phhbr.de/leaving-linkedin/` → `301`, `Location: https://bruchner.dev/leaving-linkedin/`
8. Every row of the legacy URL table returns the stated status. Run `lychee` against the old `_site/sitemap.xml` plus the redirect paths
9. Push to `main` → the deploy job's version check passes; `workflow_dispatch` of an older ref rolls back
10. On the VPS: `sudo -u deploy -s` fails; `ssh -i <deploy key> deploy@host id` is refused by `rrsync`
11. `pnpm test` green (includes axe WCAG 2.2 AA on every page in both themes); keyboard-only pass on `/` and `/services`
12. `pnpm-lock.yaml` is tracked; `dependabot.yml` validates in the repo's *Insights → Dependency graph → Dependabot* tab
13. Mail: Proton DNS checks green; mail-tester.com ≥ 9/10 from `hello@bruchner.dev`; inbound to `hello@bruchner.dev` **and** the old `@phhbr.de` addresses still arrives after 5.4

---

## Scope

**Included:** full Astro rewrite, redesign, static deploy + CI/CD, security headers, dependency scanning, domain migration with 301s, content consolidation, mail on the new domain.

**Excluded:** regular blogging (earlier posts archived, not deleted; occasional new posts like the relaunch announcement set `archived: false`); comments; analytics of any kind; contact form/backend; CMS; i18n / German version; containers.

Existing post URLs are preserved to protect inbound links and SEO. The edge Caddy owns TLS, headers, redirects and the phhbr.de redirect; its config is versioned in `deploy/` but only ever applied by hand, never by CI.

---

## Security findings being fixed

Carried over from the audit of the current site. The Jekyll site's attack surface was already near zero (no trackers, no third-party scripts, no vulnerable gems), so these are mostly hygiene and hosting-capability issues.

| # | Finding | Fixed by |
|---|---|---|
| 1 | **Google Fonts hotlinked** from `fonts.gstatic.com` (~60 `@font-face` in `_sass/klise/_fonts.scss`). Only third-party request; contradicts the Impressum's privacy claim. ~⅔ of the faces aren't referenced by any font stack | 3.1 |
| 2 | **No security headers at all**, because GitHub Pages cannot set them | 3.2, 3.4, 3.5 |
| 3 | `<meta name="referrer" content="no-referrer-when-downgrade">` = permissive browser default | 3.4, 3.6 |
| 4 | **`Gemfile.lock` gitignored** → unreproducible builds, Dependabot blind to CVEs | 3.7 |
| 5 | Unescaped Liquid into `href` in `_layouts/post.html` (`page.tweet`), referencing a non-existent `site.username`. Dead code, latent injection | Phase 1 (rewrite) |
| 6 | `rel="noopener"` without `noreferrer` in `_config.yml` and `_includes/navbar.html` | 3.11 |
| 7 | Leftover Pinterest `p:domain_verify` token of unverified ownership | 3.6 |
| 8 | `now.json` (orphan Zeit Now v2 config) publicly served; `lighthouse.png` and empty `scripts/` also published | 1.6 |
| 9 | Canonical URL wrong: `url: https://phhbr.github.io` vs `CNAME: phhbr.de`, which breaks canonical/OG/sitemap/robots/feed | 1.1, 3.13 |
| 10 | `CNAME` in `exclude:` → never copied to `_site/` | 1.6 (no longer applicable) |
| 11 | Vendored `anchor_headings.html` v1.0.4 vs upstream 1.0.12; vendored theme = no upstream patch flow | Phase 1 (rewrite) |
| 12 | Orphan `</a>` in navbar; `lang="{{ … \| default: " en " }}"` stray spaces in three layouts | Phase 2 (rewrite) |
| 13 | Dead config: `include: [_redirects, .htaccess]` (neither exists), empty unused `comments.html`, unused `google_analytics`/`fb_appid` | 1.6 |
| 14 | Deprecated Sass slash division `$spacing-full / 2` | Phase 2 (rewrite) |
| 15 | Theme toggle defer-loaded → flash of wrong theme | 2.2 |

## Content problems being fixed

- June 2025 post says "reach out here on LinkedIn"; the December post says LinkedIn was deleted, so the two posts contradict each other
- June post is framed for recruiters (redundancy narrative, names the NIQ restructuring), which sends the wrong signal to clients
- Three contact addresses: `blog@`, `cv@`, `freelance@`
- The freelance pitch is a chronological post, not a page; `notes.md` is an empty stub sitting in the main nav
- Early posts share family, employer and home-setup details that conflict with the pretexting concern in open decision 1

---

## Open decisions

### 1. Home address in the Impressum

A *ladungsfähige Anschrift* is legally required, but the current combination of home address + private phone + full employment timeline is a ready-made pretexting dossier.

**Resolved (2026-09-25): keep the home address for now, fix the cheap wins instead.** Coworking is not wanted, and paying ~€100–250/month for a desk that goes unused is a poor trade for one Impressum line.

In scope for this migration:

- Dedicated phone number (VoIP) on `/legal`; the private 0911 landline comes off the site entirely (done)
- Phone removed from `leaving-linkedin.md` (done)
- CV dates coarsened to years in `src/data/cv.ts` (done)
- Personal-detail pass over the early posts (1.5) (done: family, hobbies, home automation, solar and garden details removed)
- **The public repo's git history still holds the old posts, the landline and the full CV dates.** Make the repo private in 6.2; the deploy works the same from a private repo

> ⚠️ **Correction:** an earlier draft suggested a *virtual office / mail-forwarding address*. That was wrong: BGH V ZR 210/22 holds virtual offices are **not** ladungsfähig, risking an Abmahnung and a Bußgeld up to €50,000. Coworking spaces **are** ladungsfähig, even a single flex desk.
>
> ⚠️ **Correction:** an earlier draft called a phone number a mandatory Impressum field. EuGH C-298/07 says the second contact channel need not be a phone, but the alternative requires answering a contact form within 30–60 minutes, so in practice a number stays.

### 2. Deploy mechanism

**Resolved (2026-09-25): rsync over SSH with an `rrsync`-restricted key** (0.4). GitHub still holds a key into the VPS, but it can only write static files into one directory.

If zero inbound CI access is wanted later: a systemd timer on the VPS pulls the latest release artifact (GitHub Releases or a tagged tarball) and swaps it in. The VPS then needs no inbound key at all.

### 3. Testimonials

Six anonymised quotes that all end in near-identical phrasing ("Any team would be lucky to have him") read as less credible than three varied ones.

**Resolved (2026-09-25): three quotes, still anonymised as role + company.** Kept the ones with distinct substance (reusable libraries across a department; strategic team player; goes above and beyond) from three different perspectives (tech lead, research scientist, peer engineer). Each is an excerpt that drops the repeated closing line. In `src/data/cv.ts`.

### 4. The June 2025 post

It was written for recruiters, described being made redundant, and named a former employer's restructuring (engineering moved to India).

**Resolved (2026-09-25): removed.** `/looking-for-something-new/` 301s to `/relaunch/`, which tells the freelance story for clients. `noindex` was rejected: it only hides the page from search engines, while `/writing/` would still show it to every visitor browsing the site. Copies remain in web archives and in git history until the repo goes private (6.2).
