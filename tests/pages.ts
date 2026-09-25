export const pages = [
  { path: '/', heading: 'Philipp Bruchner' },
  { path: '/services/', heading: 'Services' },
  { path: '/services/frontend/', heading: 'Frontend & design systems' },
  { path: '/services/accessibility/', heading: 'Accessibility (BITV & WCAG)' },
  { path: '/services/backend/', heading: 'Backend development' },
  { path: '/services/testing/', heading: 'Testing & quality' },
  { path: '/services/consulting/', heading: 'Architecture & consulting' },
  { path: '/work/', heading: 'Work' },
  { path: '/cv/', heading: 'Curriculum vitae' },
  { path: '/writing/', heading: 'Writing' },
  { path: '/relaunch/', heading: 'new name, new site' },
  { path: '/legal/', heading: 'Legal notice / Impressum' },
  { path: '/privacy/', heading: 'Privacy policy / Datenschutzerklärung' },
];

// Older posts keep their original URLs, since links to them exist elsewhere.
export const archivedPosts = ['/hello-world/', '/still-alive/', '/freelance-availability/', '/leaving-linkedin/'];

// Too thin to be worth a search result: served, but noindex and not in the sitemap.
export const noindexPosts = ['/hello-world/', '/still-alive/'];
