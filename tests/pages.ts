export const pages = [
  { path: '/en/', heading: 'Philipp Bruchner', lang: 'en-GB' },
  { path: '/en/services/', heading: 'Services', lang: 'en-GB' },
  { path: '/en/services/frontend/', heading: 'Frontend & design systems', lang: 'en-GB' },
  { path: '/en/services/accessibility/', heading: 'Accessibility (BITV & WCAG)', lang: 'en-GB' },
  { path: '/en/services/backend/', heading: 'Backend development', lang: 'en-GB' },
  { path: '/en/services/testing/', heading: 'Testing & quality', lang: 'en-GB' },
  { path: '/en/services/consulting/', heading: 'Architecture & consulting', lang: 'en-GB' },
  { path: '/en/work/', heading: 'Work', lang: 'en-GB' },
  { path: '/en/cv/', heading: 'Curriculum vitae', lang: 'en-GB' },
  { path: '/en/writing/', heading: 'Writing', lang: 'en-GB' },
  { path: '/en/relaunch/', heading: 'New name, new site', lang: 'en-GB' },
  { path: '/en/legal/', heading: 'Legal notice', lang: 'en-GB' },
  { path: '/en/privacy/', heading: 'Privacy policy', lang: 'en-GB' },
  { path: '/de/', heading: 'Philipp Bruchner', lang: 'de-DE' },
  { path: '/de/leistungen/', heading: 'Leistungen', lang: 'de-DE' },
  { path: '/de/leistungen/frontend-designsysteme/', heading: 'Frontend & Designsysteme', lang: 'de-DE' },
  { path: '/de/leistungen/barrierefreiheit/', heading: 'Barrierefreiheit (BITV & WCAG)', lang: 'de-DE' },
  { path: '/de/leistungen/backend/', heading: 'Backend-Entwicklung', lang: 'de-DE' },
  { path: '/de/leistungen/tests-qualitaet/', heading: 'Tests & Qualität', lang: 'de-DE' },
  { path: '/de/leistungen/architektur-beratung/', heading: 'Architektur & Beratung', lang: 'de-DE' },
  { path: '/de/projekte/', heading: 'Projekte', lang: 'de-DE' },
  { path: '/de/lebenslauf/', heading: 'Lebenslauf', lang: 'de-DE' },
  { path: '/de/impressum/', heading: 'Impressum', lang: 'de-DE' },
  { path: '/de/datenschutz/', heading: 'Datenschutzerklärung', lang: 'de-DE' },
];

// Older posts, English only, at their original URLs under /en/.
export const archivedPosts = ['/en/hello-world/', '/en/still-alive/', '/en/freelance-availability/', '/en/leaving-linkedin/'];

// Too thin to be worth a search result: served, but noindex and not in the sitemap.
export const noindexPosts = ['/en/hello-world/', '/en/still-alive/'];

// URLs from before the German version, and where they lead now. The build
// ships static redirect pages for them; the server answers with a 301 first.
export const legacyRedirects = [
  ['/', '/en/'],
  ['/services/', '/en/services/'],
  ['/services/accessibility/', '/en/services/accessibility/'],
  ['/work/', '/en/work/'],
  ['/cv/', '/en/cv/'],
  ['/relaunch/', '/en/relaunch/'],
  ['/leaving-linkedin/', '/en/leaving-linkedin/'],
  ['/legal/', '/en/legal/'],
];
