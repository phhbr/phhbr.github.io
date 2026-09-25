// The site exists in English (/en/) and German (/de/). The bare domain sends
// visitors to one of them by their browser language (deploy/bruchner.dev.caddy).

export const langs = ['en', 'de'] as const;
export type Lang = (typeof langs)[number];
export type Localized<T = string> = Record<Lang, T>;

// BCP 47 tags for <html lang>, Open Graph and schema.org.
export const locales: Localized = { en: 'en-GB', de: 'de-DE' };

// Each language's own name, for the language switch.
export const langNames: Localized = { en: 'English', de: 'Deutsch' };

// A page's language follows from its URL: /de/… is German, everything else English.
export const langOf = (url: URL): Lang => (url.pathname.startsWith('/de/') ? 'de' : 'en');

// Data that is the same in both languages is a plain value; anything else is
// { en, de }. `tr` picks the right one.
export const tr = <T extends string | string[]>(value: T | Localized<T>, lang: Lang): T =>
  typeof value === 'object' && !Array.isArray(value) ? value[lang] : value;

// Pages that exist in both languages. German pages have German paths.
export const routes = {
  home: { en: '/en/', de: '/de/' },
  services: { en: '/en/services/', de: '/de/leistungen/' },
  work: { en: '/en/work/', de: '/de/projekte/' },
  cv: { en: '/en/cv/', de: '/de/lebenslauf/' },
  legal: { en: '/en/legal/', de: '/de/impressum/' },
  privacy: { en: '/en/privacy/', de: '/de/datenschutz/' },
} satisfies Record<string, Localized>;

// Posts are written in English only.
export const writingPath = '/en/writing/';
export const postPath = (id: string) => `/en/${id}/`;

const en = {
  skip: 'Skip to content',
  home: 'home',
  mainNav: 'Main',
  languageNav: 'Language',
  themeToggle: 'Dark mode',
  nav: { services: 'Services', work: 'Work', cv: 'CV' },
  footer: { writing: 'Writing', rss: 'RSS', legal: 'Legal notice', privacy: 'Privacy' },
  email: 'Email',
  orCall: 'or call',
};

// Shared interface text: header, footer, contact links.
export const ui: Localized<typeof en> = {
  en,
  de: {
    skip: 'Zum Inhalt springen',
    home: 'Startseite',
    mainNav: 'Hauptmenü',
    languageNav: 'Sprache',
    themeToggle: 'Dunkelmodus',
    nav: { services: 'Leistungen', work: 'Projekte', cv: 'Lebenslauf' },
    footer: { writing: 'Blog (auf Englisch)', rss: 'RSS', legal: 'Impressum', privacy: 'Datenschutz' },
    email: 'E-Mail an',
    orCall: 'oder telefonisch:',
  },
};
