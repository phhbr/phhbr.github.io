// CV as data, rendered by src/views/Cv.astro. Dates are years only, on purpose.
// Employers and clients are described by sector, never named.
import type { Localized } from '../i18n';

type Text = string | Localized;

export interface Role {
  period: Text;
  title: Text;
}

export interface Testimonial {
  // Quotes stay in the language they were written in (English).
  quote: string;
  // The most specific sentence of the quote, shown on the home page.
  highlight: string;
  role: string;
  context: Localized;
}

export const profile = {
  role: { en: 'Senior frontend engineer, freelance', de: 'Senior-Frontend-Entwickler, freiberuflich' },
  focus: {
    en: ['Problem solving', 'Web client development', 'Systems design'],
    de: ['Problemlösung', 'Web-Client-Entwicklung', 'Systemdesign'],
  },
  coreSkills: {
    en: [
      'TypeScript (web, Node.js)',
      'Design systems and web components (StencilJS)',
      'Accessibility (BITV 2.0, WCAG)',
      'Angular',
      'Test automation (Jest, Pact, Playwright, axe-core)',
      'CI/CD (GitLab, GitHub Actions, Jenkins)',
      'Kubernetes',
    ],
    de: [
      'TypeScript (Web, Node.js)',
      'Designsysteme und Web Components (StencilJS)',
      'Barrierefreiheit (BITV 2.0, WCAG)',
      'Angular',
      'Testautomatisierung (Jest, Pact, Playwright, axe-core)',
      'CI/CD (GitLab, GitHub Actions, Jenkins)',
      'Kubernetes',
    ],
  },
} satisfies Record<string, Localized<string | string[]>>;

export const experience: Role[] = [
  {
    period: { en: 'since 2025', de: 'seit 2025' },
    title: { en: 'Freelance software engineer / IT consultant', de: 'Freiberuflicher Softwareentwickler / IT-Berater' },
  },
  {
    period: '2022 – 2025',
    title: {
      en: 'Senior frontend software engineer, global market research company',
      de: 'Senior-Frontend-Entwickler, globales Marktforschungsunternehmen',
    },
  },
  {
    period: '2017 – 2022',
    title: {
      en: 'Frontend engineer, later senior web developer (consulting), global IT consultancy',
      de: 'Frontend-Entwickler, später Senior-Webentwickler (Beratung), internationales IT-Beratungsunternehmen',
    },
  },
  { period: '2015 – 2017', title: { en: 'Software engineer', de: 'Softwareentwickler' } },
];

export const education: Role[] = [
  {
    period: '2012 – 2014',
    title: {
      en: 'Computer Science, M.Sc. (Technische Hochschule Regensburg)',
      de: 'Informatik, M.Sc. (Technische Hochschule Regensburg)',
    },
  },
  {
    period: '2009 – 2012',
    title: {
      en: 'Business Information Technology, B.Sc. (Technische Hochschule Regensburg)',
      de: 'Wirtschaftsinformatik, B.Sc. (Technische Hochschule Regensburg)',
    },
  },
];

const marketResearch = { en: 'global market research company', de: 'globales Marktforschungsunternehmen' };

// Anonymised as role + context. Each is an excerpt: the near-identical closing
// line ("Any team would be lucky…") is omitted. The CV shows `quote`; the home
// page shows `highlight`, which skips the "pleasure to work with" openers.
export const testimonials: Testimonial[] = [
  {
    quote:
      'It was a true pleasure to work with Philipp for over two years. His initiative in creating reusable libraries and applications significantly benefited not only our team, but the entire department.',
    highlight:
      'His initiative in creating reusable libraries and applications significantly benefited not only our team, but the entire department.',
    role: 'Principal Software Engineer / Tech Lead',
    context: marketResearch,
  },
  {
    quote:
      "I had the great pleasure of working with Philipp and can wholeheartedly recommend him. He's an outstanding engineer and a true team player with a strategic mindset.",
    highlight: "He's an outstanding engineer and a true team player with a strategic mindset.",
    role: 'Principal Research Scientist',
    context: marketResearch,
  },
  {
    quote:
      "I had the pleasure of working closely with Philipp in the same team, and I can confidently say that he's one of those rare engineers who consistently goes above and beyond.",
    highlight: "He's one of those rare engineers who consistently goes above and beyond.",
    role: 'Senior Software Engineer',
    context: { en: 'former teammate', de: 'aus meinem früheren Team' },
  },
];

export const teaching: Role[] = [
  { period: '2024 – 2025', title: 'Consumer-driven contract testing' },
  { period: '2023 – 2025', title: { en: 'Web client security', de: 'Web-Client-Sicherheit' } },
  { period: '2020 – 2022', title: { en: 'Web components', de: 'Web Components' } },
  { period: '2021 – 2022', title: { en: 'Web client architecture', de: 'Web-Client-Architektur' } },
  { period: '2019 – 2021', title: { en: 'Angular foundations', de: 'Angular-Grundlagen' } },
  { period: '2019 – 2021', title: { en: 'Angular advanced', de: 'Angular für Fortgeschrittene' } },
];

export const trainings: Role[] = [
  {
    period: '2019',
    title: { en: 'Software engineering design advanced', de: 'Software-Engineering-Design für Fortgeschrittene' },
  },
  { period: '2018', title: { en: 'Angular advanced', de: 'Angular für Fortgeschrittene' } },
  { period: '2018', title: { en: 'Collaborating with clients', de: 'Zusammenarbeit mit Kunden' } },
  {
    period: '2018',
    title: { en: 'Software engineering design principles', de: 'Designprinzipien im Software-Engineering' },
  },
];

export const certificates: Role[] = [
  { period: '2020', title: 'Certified Architect, L1' },
  { period: '2018', title: 'Professional Scrum Master (PSM I)' },
];
