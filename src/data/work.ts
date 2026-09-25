// Selected projects, rendered on /work/ and teased on the home page. Clients are
// described by sector, not named. Periods are years only.

export interface Project {
  id: string;
  title: string;
  client: string;
  period: string;
  // One sentence on what came out of it, for the home page.
  summary: string;
  role: string;
  context: string;
  work: string[];
  stack: string[];
}

export const projects: Project[] = [
  {
    id: 'public-sector-design-system',
    title: 'Accessible design system for the public sector',
    client: 'Large German public-sector organisation',
    period: '2020 – 2022, since 2025',
    summary:
      'Framework-agnostic web components that teams on Angular, React and Vue share, tested with JAWS and Windows high-contrast mode and taken through BITV acceptance.',
    role: 'Senior web developer, first via a consultancy, now freelance',
    context:
      'The organisation runs many applications for citizens and staff, built by different teams on different frameworks. A shared design system gives them one consistent, accessible look and feel, and it has to meet BITV 2.0 and WCAG 2.1.',
    work: [
      'Building accessible, framework-agnostic web components with StencilJS, TypeScript and CSS',
      'Testing with the JAWS screen reader and Windows high-contrast mode, and accompanying BITV acceptance tests',
      'Reviewing and supporting teams that integrate the components into Angular, React and Vue applications',
      'Shaping architecture decisions and improving the developer experience, documentation and Storybook',
      'Securing quality with code reviews, test automation and CI/CD pipelines',
    ],
    stack: ['StencilJS', 'TypeScript', 'Storybook', 'axe-core', 'Playwright', 'Jest', 'Pact', 'Jenkins', 'GitHub Actions'],
  },
  {
    id: 'enterprise-design-system',
    title: 'Enterprise design system across three frameworks',
    client: 'Global market research company',
    period: '2022 – 2025',
    summary:
      'One accessible component library for product teams on three frameworks, with the UI standards, documentation and pipeline around it.',
    role: 'Lead frontend engineer',
    context:
      'Product teams across the company built on Angular, React and Vue. A framework-agnostic design system gave all of them a consistent, accessible and long-lived UI foundation.',
    work: [
      'Developing accessible web components with StencilJS, TypeScript and CSS, conforming to WCAG 2.1',
      'Defining UI architecture standards together with UX and developer-experience teams',
      'Supporting and reviewing integration in Angular, React and Vue projects',
      'Writing documentation and developer guides in Storybook and Confluence',
      'Running the CI/CD pipeline with GitLab CI and SonarQube',
    ],
    stack: ['StencilJS', 'TypeScript', 'Storybook', 'Jest', 'Pact', 'axe-core', 'Playwright', 'GitLab CI', 'SonarQube'],
  },
  {
    id: 'data-warehouse-modernisation',
    title: 'Modernising a business-critical data warehouse application',
    client: 'Global market research company',
    period: '2022 – 2025',
    summary:
      'A Visual Basic 6 desktop application rebuilt as an Angular web app with a Node.js backend-for-frontend, running on Kubernetes.',
    role: 'Senior frontend engineer',
    context:
      "The company's central data management ran on an ageing desktop application written in Visual Basic 6. It was rebuilt as a web application, with key user workflows redesigned for the web together with UX.",
    work: [
      'Building the new frontend with Angular, accessible, fast and responsive',
      'Developing a Node.js backend-for-frontend',
      'Unit tests with Jest, contract tests with Pact, accessibility checks with axe-core, end-to-end tests with Playwright',
      'Maintaining the GitLab CI/CD pipeline and running the application on Kubernetes',
    ],
    stack: ['Angular', 'TypeScript', 'Node.js', 'Jest', 'Pact', 'Playwright', 'GitLab CI', 'Kubernetes'],
  },
  {
    id: 'automotive-master-data',
    title: 'Master data system for an automotive manufacturer',
    client: 'Automotive manufacturer, via a consultancy',
    period: '2018 – 2020',
    summary:
      'Led the Angular frontend of a multi-team CQRS system and set the UI standards every team worked to.',
    role: 'Frontend lead',
    context:
      'A large, multi-team project built a scalable master data system that supplies many consuming systems, using the CQRS pattern to separate reads from writes.',
    work: [
      'Leading feature development of the Angular user interface',
      'Defining UI coding and architecture standards used by all teams',
      "Advising and reviewing neighbouring teams' work",
      'Contributing to the Java backend',
    ],
    stack: ['Angular', 'TypeScript', 'Java', 'CQRS', 'Jest'],
  },
];
