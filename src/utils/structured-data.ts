import type { CollectionEntry } from 'astro:content';
import { SITE } from '../config';
import { certificates } from '../data/cv';
import { stack } from '../data/stack';
import { locales, postPath, routes, tr, type Lang } from '../i18n';
import { serviceLang, servicePath } from './services';

// schema.org data for search engines. Nodes share `@id`s, so pages can refer
// to the person and the business without repeating them. Both languages
// describe the same person and business, so the `@id`s are shared too.

const SITE_URL = 'https://bruchner.dev/';
const url = (path: string) => new URL(path, SITE_URL).href;

export const ids = {
  person: `${SITE_URL}#person`,
  service: `${SITE_URL}#service`,
  website: `${SITE_URL}#website`,
};

// Region only; the street address stays on the legal notice.
const address = {
  '@type': 'PostalAddress',
  addressLocality: SITE.locality,
  addressRegion: SITE.region,
  addressCountry: 'DE',
};

const areaServed = (lang: Lang) => [{ '@type': 'Country', name: tr({ en: 'Germany', de: 'Deutschland' }, lang) }, 'Remote'];

const businessName = (lang: Lang) => `${SITE.author}, ${tr({ en: 'software engineering', de: 'Softwareentwicklung' }, lang)}`;

const personRef = { '@type': 'Person', '@id': ids.person, name: SITE.author, url: SITE_URL };

export const graph = (...nodes: object[]) => ({ '@context': 'https://schema.org', '@graph': nodes });

export const person = (lang: Lang) => ({
  '@type': 'Person',
  '@id': ids.person,
  name: SITE.author,
  url: SITE_URL,
  jobTitle: tr({ en: 'Freelance senior frontend engineer', de: 'Freiberuflicher Senior-Frontend-Entwickler' }, lang),
  email: `mailto:${SITE.email}`,
  telephone: SITE.phone,
  address,
  sameAs: [SITE.github],
  knowsAbout: stack,
  knowsLanguage: ['de', 'en'],
  alumniOf: { '@type': 'CollegeOrUniversity', name: 'Technische Hochschule Regensburg' },
  hasCredential: certificates.map(({ title }) => ({
    '@type': 'EducationalOccupationalCredential',
    credentialCategory: 'certificate',
    name: tr(title, lang),
  })),
});

export const professionalService = (services: CollectionEntry<'services'>[], lang: Lang) => ({
  '@type': 'ProfessionalService',
  '@id': ids.service,
  name: businessName(lang),
  description: SITE.description[lang],
  url: url(routes.services[lang]),
  email: SITE.email,
  telephone: SITE.phone,
  founder: { '@id': ids.person },
  address,
  areaServed: areaServed(lang),
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: tr({ en: 'Services', de: 'Leistungen' }, lang),
    itemListElement: services.map((entry) => ({ '@type': 'Offer', itemOffered: service(entry) })),
  },
});

export const service = (entry: CollectionEntry<'services'>) => {
  const lang = serviceLang(entry);
  return {
    '@type': 'Service',
    name: entry.data.title,
    serviceType: entry.data.title,
    description: entry.data.summary,
    url: url(servicePath(entry)),
    inLanguage: locales[lang],
    provider: { '@type': 'ProfessionalService', '@id': ids.service, name: businessName(lang) },
    areaServed: areaServed(lang),
  };
};

export const website = () => ({
  '@type': 'WebSite',
  '@id': ids.website,
  url: SITE_URL,
  name: SITE.title,
  inLanguage: [locales.en, locales.de],
  publisher: { '@id': ids.person },
});

export const profilePage = (lang: Lang) => ({
  '@type': 'ProfilePage',
  url: url(routes.cv[lang]),
  inLanguage: locales[lang],
  mainEntity: person(lang),
});

export const blogPosting = ({ id, data }: CollectionEntry<'posts'>, modified: Date) => ({
  '@type': 'BlogPosting',
  headline: data.title,
  description: data.description,
  url: url(postPath(id)),
  mainEntityOfPage: url(postPath(id)),
  datePublished: data.pubDate.toISOString(),
  dateModified: modified.toISOString(),
  inLanguage: locales.en,
  author: personRef,
  publisher: personRef,
});
