// Selected projects, rendered on the work page and teased on the home page.
// Clients are described by sector, not named. Periods are years only.
import type { Localized } from '../i18n';

export interface Project {
  // Anchor on the work page, the same in both languages.
  id: string;
  title: Localized;
  client: Localized;
  period: Localized;
  // One sentence on what came out of it, for the home page.
  summary: Localized;
  role: Localized;
  context: Localized;
  work: Localized<string[]>;
  stack: string[];
}

const marketResearch = { en: 'Global market research company', de: 'Globales Marktforschungsunternehmen' };

export const projects: Project[] = [
  {
    id: 'public-sector-design-system',
    title: {
      en: 'Accessible design system for the public sector',
      de: 'Barrierefreies Designsystem für den öffentlichen Sektor',
    },
    client: {
      en: 'Large German public-sector organisation',
      de: 'Große deutsche Organisation des öffentlichen Sektors',
    },
    period: { en: '2020 – 2022, since 2025', de: '2020 – 2022, seit 2025' },
    summary: {
      en: 'Framework-agnostic web components that teams on Angular, React and Vue share, tested with JAWS and Windows high-contrast mode and taken through BITV acceptance.',
      de: 'Framework-unabhängige Web Components, die Teams mit Angular, React und Vue gemeinsam nutzen, getestet mit JAWS und im Windows-Kontrastmodus und durch die BITV-Abnahme gebracht.',
    },
    role: {
      en: 'Senior web developer, first via a consultancy, now freelance',
      de: 'Senior-Webentwickler, zunächst über ein Beratungsunternehmen, heute freiberuflich',
    },
    context: {
      en: 'The organisation runs many applications for citizens and staff, built by different teams on different frameworks. A shared design system gives them one consistent, accessible look and feel, and it has to meet BITV 2.0 and WCAG 2.1.',
      de: 'Die Organisation betreibt viele Anwendungen für Bürgerinnen, Bürger und Beschäftigte, gebaut von verschiedenen Teams mit verschiedenen Frameworks. Ein gemeinsames Designsystem gibt ihnen ein einheitliches, barrierefreies Erscheinungsbild, und es muss BITV 2.0 und WCAG 2.1 erfüllen.',
    },
    work: {
      en: [
        'Building accessible, framework-agnostic web components with StencilJS, TypeScript and CSS',
        'Testing with the JAWS screen reader and Windows high-contrast mode, and accompanying BITV acceptance tests',
        'Reviewing and supporting teams that integrate the components into Angular, React and Vue applications',
        'Shaping architecture decisions and improving the developer experience, documentation and Storybook',
        'Securing quality with code reviews, test automation and CI/CD pipelines',
      ],
      de: [
        'Entwicklung barrierefreier, framework-unabhängiger Web Components mit StencilJS, TypeScript und CSS',
        'Tests mit dem Screenreader JAWS und im Windows-Kontrastmodus, Begleitung der BITV-Abnahmetests',
        'Reviews und Unterstützung der Teams, die die Komponenten in Angular-, React- und Vue-Anwendungen integrieren',
        'Mitgestaltung von Architekturentscheidungen, Verbesserung von Developer Experience, Dokumentation und Storybook',
        'Qualitätssicherung durch Code-Reviews, Testautomatisierung und CI/CD-Pipelines',
      ],
    },
    stack: ['StencilJS', 'TypeScript', 'Storybook', 'axe-core', 'Playwright', 'Jest', 'Pact', 'Jenkins', 'GitHub Actions'],
  },
  {
    id: 'enterprise-design-system',
    title: {
      en: 'Enterprise design system across three frameworks',
      de: 'Unternehmensweites Designsystem für drei Frameworks',
    },
    client: marketResearch,
    period: { en: '2022 – 2025', de: '2022 – 2025' },
    summary: {
      en: 'One accessible component library for product teams on three frameworks, with the UI standards, documentation and pipeline around it.',
      de: 'Eine barrierefreie Komponentenbibliothek für Produktteams mit drei Frameworks, samt UI-Standards, Dokumentation und Pipeline.',
    },
    role: { en: 'Lead frontend engineer', de: 'Lead-Frontend-Entwickler' },
    context: {
      en: 'Product teams across the company built on Angular, React and Vue. A framework-agnostic design system gave all of them a consistent, accessible and long-lived UI foundation.',
      de: 'Die Produktteams im Unternehmen arbeiteten mit Angular, React und Vue. Ein framework-unabhängiges Designsystem gab allen eine einheitliche, barrierefreie und langlebige UI-Grundlage.',
    },
    work: {
      en: [
        'Developing accessible web components with StencilJS, TypeScript and CSS, conforming to WCAG 2.1',
        'Defining UI architecture standards together with UX and developer-experience teams',
        'Supporting and reviewing integration in Angular, React and Vue projects',
        'Writing documentation and developer guides in Storybook and Confluence',
        'Running the CI/CD pipeline with GitLab CI and SonarQube',
      ],
      de: [
        'Entwicklung barrierefreier Web Components mit StencilJS, TypeScript und CSS nach WCAG 2.1',
        'Definition von UI-Architekturstandards gemeinsam mit UX- und Developer-Experience-Teams',
        'Unterstützung und Review der Integration in Angular-, React- und Vue-Projekte',
        'Dokumentation und Entwicklerleitfäden in Storybook und Confluence',
        'Betrieb der CI/CD-Pipeline mit GitLab CI und SonarQube',
      ],
    },
    stack: ['StencilJS', 'TypeScript', 'Storybook', 'Jest', 'Pact', 'axe-core', 'Playwright', 'GitLab CI', 'SonarQube'],
  },
  {
    id: 'data-warehouse-modernisation',
    title: {
      en: 'Modernising a business-critical data warehouse application',
      de: 'Modernisierung einer geschäftskritischen Data-Warehouse-Anwendung',
    },
    client: marketResearch,
    period: { en: '2022 – 2025', de: '2022 – 2025' },
    summary: {
      en: 'A Visual Basic 6 desktop application rebuilt as an Angular web app with a Node.js backend-for-frontend, running on Kubernetes.',
      de: 'Eine Desktop-Anwendung in Visual Basic 6, neu gebaut als Angular-Web-App mit Node.js-Backend-for-Frontend, betrieben auf Kubernetes.',
    },
    role: { en: 'Senior frontend engineer', de: 'Senior-Frontend-Entwickler' },
    context: {
      en: "The company's central data management ran on an ageing desktop application written in Visual Basic 6. It was rebuilt as a web application, with key user workflows redesigned for the web together with UX.",
      de: 'Das zentrale Datenmanagement des Unternehmens lief auf einer in die Jahre gekommenen Desktop-Anwendung in Visual Basic 6. Sie wurde als Webanwendung neu gebaut, zentrale Arbeitsabläufe wurden dabei gemeinsam mit UX für das Web neu gestaltet.',
    },
    work: {
      en: [
        'Building the new frontend with Angular, accessible, fast and responsive',
        'Developing a Node.js backend-for-frontend',
        'Unit tests with Jest, contract tests with Pact, accessibility checks with axe-core, end-to-end tests with Playwright',
        'Maintaining the GitLab CI/CD pipeline and running the application on Kubernetes',
      ],
      de: [
        'Entwicklung des neuen Frontends mit Angular: barrierefrei, schnell und responsiv',
        'Entwicklung eines Node.js-Backend-for-Frontend',
        'Unit-Tests mit Jest, Contract-Tests mit Pact, Barrierefreiheitsprüfungen mit axe-core, End-to-End-Tests mit Playwright',
        'Pflege der GitLab-CI/CD-Pipeline und Betrieb der Anwendung auf Kubernetes',
      ],
    },
    stack: ['Angular', 'TypeScript', 'Node.js', 'Jest', 'Pact', 'Playwright', 'GitLab CI', 'Kubernetes'],
  },
  {
    id: 'automotive-master-data',
    title: {
      en: 'Master data system for an automotive manufacturer',
      de: 'Stammdatensystem für einen Automobilhersteller',
    },
    client: {
      en: 'Automotive manufacturer, via a consultancy',
      de: 'Automobilhersteller, über ein Beratungsunternehmen',
    },
    period: { en: '2018 – 2020', de: '2018 – 2020' },
    summary: {
      en: 'Led the Angular frontend of a multi-team CQRS system and set the UI standards every team worked to.',
      de: 'Leitung des Angular-Frontends eines CQRS-Systems mit mehreren Teams, inklusive der UI-Standards, nach denen alle Teams arbeiteten.',
    },
    role: { en: 'Frontend lead', de: 'Frontend-Lead' },
    context: {
      en: 'A large, multi-team project built a scalable master data system that supplies many consuming systems, using the CQRS pattern to separate reads from writes.',
      de: 'Ein großes Projekt mit mehreren Teams baute ein skalierbares Stammdatensystem, das viele abnehmende Systeme versorgt, und trennte Lese- und Schreibzugriffe nach dem CQRS-Muster.',
    },
    work: {
      en: [
        'Leading feature development of the Angular user interface',
        'Defining UI coding and architecture standards used by all teams',
        "Advising and reviewing neighbouring teams' work",
        'Contributing to the Java backend',
      ],
      de: [
        'Leitung der Feature-Entwicklung der Angular-Oberfläche',
        'Definition von UI-Coding- und Architekturstandards für alle Teams',
        'Beratung und Reviews für benachbarte Teams',
        'Mitarbeit am Java-Backend',
      ],
    },
    stack: ['Angular', 'TypeScript', 'Java', 'CQRS', 'Jest'],
  },
];
