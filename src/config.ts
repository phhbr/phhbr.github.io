export const SITE = {
  title: 'bruchner.dev',
  author: 'Philipp Bruchner',
  // Page titles end in the name, which is what people search for.
  homeTitle: 'Philipp Bruchner | Freelance Frontend Engineer, Nürnberg',
  description:
    'Freelance senior frontend engineer in Nürnberg: accessible design systems, web components and TypeScript apps (Angular, React). Remote or on-site.',
  // Region only; the street address is on /legal/ where the law requires it.
  locality: 'Nürnberg',
  region: 'Bayern',
  email: 'hello@bruchner.dev',
  github: 'https://github.com/phhbr',
  lang: 'en-GB',
};

// Impressum data (§ 5 DDG). Rendered on /legal/ and /privacy/.
export const LEGAL = {
  name: 'Philipp Bruchner',
  street: 'Greifswalder Straße 4',
  city: '90425 Nürnberg',
  country: 'Germany',
  // Dedicated business number.
  phone: '+49 15679 121402',
  // Umsatzsteuer-Identifikationsnummer, if one has been issued (§ 5 Abs. 1 Nr. 6 DDG).
  vatId: undefined as string | undefined,
  // Named as processor on /privacy/.
  hostingProvider: 'netcup GmbH, Emmy-Noether-Straße 10, 76131 Karlsruhe, Germany',
};
