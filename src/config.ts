import type { Localized } from './i18n';

export const SITE = {
  title: 'bruchner.dev',
  author: 'Philipp Bruchner',
  // Page titles end in the name, which is what people search for.
  homeTitle: {
    en: 'Philipp Bruchner | Freelance Frontend Engineer, Nürnberg',
    de: 'Philipp Bruchner | Freelance Frontend-Entwickler, Nürnberg',
  } satisfies Localized,
  description: {
    en: 'Freelance senior frontend engineer in Nürnberg: accessible design systems, web components and TypeScript apps (Angular, React). Remote or on-site.',
    de: 'Freiberuflicher Senior-Frontend-Entwickler in Nürnberg: barrierefreie Designsysteme nach BITV und WCAG, Web Components und TypeScript-Apps. Remote oder vor Ort.',
  } satisfies Localized,
  // Region only; the street address is on the legal notice where the law requires it.
  locality: 'Nürnberg',
  region: 'Bayern',
  email: 'hello@bruchner.dev',
  // Dedicated business number, offered next to e-mail wherever the site asks for contact.
  phone: '+49 15679 121402',
  // Shown in the home page hero. Update it when a project fills the calendar.
  availability: {
    en: 'Available for new projects, remote or on-site across Germany.',
    de: 'Verfügbar für neue Projekte, remote oder vor Ort in ganz Deutschland.',
  } satisfies Localized,
  github: 'https://github.com/phhbr',
};

// Impressum data (§ 5 DDG). Rendered on the legal notice and privacy pages.
export const LEGAL = {
  name: 'Philipp Bruchner',
  street: 'Greifswalder Straße 4',
  city: '90425 Nürnberg',
  country: { en: 'Germany', de: 'Deutschland' } satisfies Localized,
  phone: SITE.phone,
  // Umsatzsteuer-Identifikationsnummer, if one has been issued (§ 5 Abs. 1 Nr. 6 DDG).
  vatId: undefined as string | undefined,
  // Named as processor on the privacy page, followed by the country.
  hostingProvider: 'netcup GmbH, Emmy-Noether-Straße 10, 76131 Karlsruhe',
};
