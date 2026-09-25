import type { CollectionEntry } from 'astro:content';
import { SITE } from '../config';
import { certificates } from '../data/cv';
import { stack } from '../data/stack';

// schema.org data for search engines. Nodes share `@id`s, so pages can refer
// to the person and the business without repeating them.

const SITE_URL = 'https://bruchner.dev/';
const url = (path: string) => new URL(path, SITE_URL).href;

export const ids = {
  person: `${SITE_URL}#person`,
  service: `${SITE_URL}#service`,
  website: `${SITE_URL}#website`,
};

// Region only; the street address stays on /legal/.
const address = {
  '@type': 'PostalAddress',
  addressLocality: SITE.locality,
  addressRegion: SITE.region,
  addressCountry: 'DE',
};

const areaServed = [{ '@type': 'Country', name: 'Germany' }, 'Remote'];

const personRef = { '@type': 'Person', '@id': ids.person, name: SITE.author, url: SITE_URL };

export const graph = (...nodes: object[]) => ({ '@context': 'https://schema.org', '@graph': nodes });

export const person = () => ({
  '@type': 'Person',
  '@id': ids.person,
  name: SITE.author,
  url: SITE_URL,
  jobTitle: 'Freelance senior frontend engineer',
  email: `mailto:${SITE.email}`,
  address,
  sameAs: [SITE.github],
  knowsAbout: stack,
  knowsLanguage: ['de', 'en'],
  alumniOf: { '@type': 'CollegeOrUniversity', name: 'Technische Hochschule Regensburg' },
  hasCredential: certificates.map(({ title }) => ({
    '@type': 'EducationalOccupationalCredential',
    credentialCategory: 'certificate',
    name: title,
  })),
});

export const professionalService = (services: CollectionEntry<'services'>[]) => ({
  '@type': 'ProfessionalService',
  '@id': ids.service,
  name: `${SITE.author}, software engineering`,
  description: SITE.description,
  url: url('/services/'),
  email: SITE.email,
  founder: { '@id': ids.person },
  address,
  areaServed,
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Services',
    itemListElement: services.map((entry) => ({ '@type': 'Offer', itemOffered: service(entry) })),
  },
});

export const service = ({ id, data }: CollectionEntry<'services'>) => ({
  '@type': 'Service',
  name: data.title,
  serviceType: data.title,
  description: data.summary,
  url: url(`/services/${id}/`),
  provider: { '@type': 'ProfessionalService', '@id': ids.service, name: `${SITE.author}, software engineering` },
  areaServed,
});

export const website = () => ({
  '@type': 'WebSite',
  '@id': ids.website,
  url: SITE_URL,
  name: SITE.title,
  inLanguage: SITE.lang,
  publisher: { '@id': ids.person },
});

export const profilePage = () => ({
  '@type': 'ProfilePage',
  url: url('/cv/'),
  inLanguage: SITE.lang,
  mainEntity: person(),
});

export const blogPosting = ({ id, data }: CollectionEntry<'posts'>, modified: Date) => ({
  '@type': 'BlogPosting',
  headline: data.title,
  description: data.description,
  url: url(`/${id}/`),
  mainEntityOfPage: url(`/${id}/`),
  datePublished: data.pubDate.toISOString(),
  dateModified: modified.toISOString(),
  inLanguage: SITE.lang,
  author: personRef,
  publisher: personRef,
});
