// CV as data, rendered by src/pages/cv.astro. Dates are years only (open decision 1).

export interface Role {
  period: string;
  title: string;
}

export interface Testimonial {
  quote: string;
  role: string;
  company: string;
}

export const profile = {
  role: 'Software engineer',
  focus: ['Problem solving', 'Web client development', 'Systems design'],
  coreSkills: ['TypeScript (web, Node.js)', 'Accessibility', 'GitLab CI/CD', 'Kubernetes'],
};

export const experience: Role[] = [
  { period: 'since 2025', title: 'Freelance software engineer / IT consultant' },
  { period: '2022 – 2025', title: 'GfK SE (acquired by NielsenIQ)' },
  { period: '2017 – 2022', title: 'Capgemini Deutschland GmbH' },
  { period: '2015 – 2017', title: 'Mediendesign AG' },
];

export const education: Role[] = [
  { period: '2012 – 2014', title: 'Computer Science, M.Sc. (HS Regensburg)' },
  { period: '2009 – 2012', title: 'Business Information Technology, B.Sc. (HS Regensburg)' },
];

// Three varied quotes, anonymised as role + company (open decision 3). Each is an
// excerpt: the near-identical closing line ("Any team would be lucky…") is omitted.
export const testimonials: Testimonial[] = [
  {
    quote:
      'It was a true pleasure to work with Philipp for over two years. His initiative in creating reusable libraries and applications significantly benefited not only our team, but the entire department.',
    role: 'Principal Software Engineer / Tech Lead',
    company: 'GfK',
  },
  {
    quote:
      "I had the great pleasure of working with Philipp and can wholeheartedly recommend him. He's an outstanding engineer and a true team player with a strategic mindset.",
    role: 'Principal Research Scientist',
    company: 'NielsenIQ',
  },
  {
    quote:
      "I had the pleasure of working closely with Philipp in the same team, and I can confidently say that he's one of those rare engineers who consistently goes above and beyond.",
    role: 'Senior Software Engineer',
    company: 'Boku',
  },
];

export const teaching: Role[] = [
  { period: '2024 – 2025', title: 'Consumer-driven contract testing' },
  { period: '2023 – 2025', title: 'Web client security' },
  { period: '2020 – 2022', title: 'Web components' },
  { period: '2021 – 2022', title: 'Web client architecture' },
  { period: '2019 – 2021', title: 'Angular foundations' },
  { period: '2019 – 2021', title: 'Angular advanced' },
];

export const trainings: Role[] = [
  { period: '2019', title: 'Software engineering design advanced' },
  { period: '2018', title: 'Angular advanced' },
  { period: '2018', title: 'Collaborating with clients' },
  { period: '2018', title: 'Software engineering design principles' },
];

export const certificates: Role[] = [
  { period: '2020', title: 'Certified Architect, L1' },
  { period: '2018', title: 'Professional Scrum Master (PSM I)' },
];
