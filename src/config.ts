export const SITE = {
  title: 'bruchner.dev',
  author: 'Philipp Bruchner',
  description:
    'Freelance software engineer for TypeScript web applications, design systems, accessibility and CI/CD.',
  // Switch to hello@bruchner.dev once its Proton mailbox is live (plan 0.2),
  // and replace the address in src/content/posts at the same time.
  email: 'hello@phhbr.de',
  github: 'https://github.com/phhbr',
  lang: 'en-GB',
};

// Impressum data (§ 5 DDG). Rendered on /legal/ and /privacy/.
export const LEGAL = {
  name: 'Philipp Bruchner',
  street: 'Greifswalder Straße 4',
  city: '90425 Nürnberg',
  country: 'Germany',
  // Dedicated VoIP number; the private landline is no longer published (open decision 1).
  phone: '+49 15679 121402',
  // Umsatzsteuer-Identifikationsnummer, if one has been issued (§ 5 Abs. 1 Nr. 6 DDG).
  vatId: undefined as string | undefined,
  // Named as processor on /privacy/ (plan 2.5).
  hostingProvider: 'netcup GmbH, Emmy-Noether-Straße 10, 76131 Karlsruhe, Germany',
};
