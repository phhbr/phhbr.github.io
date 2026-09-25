import { getCollection, type CollectionEntry } from 'astro:content';
import { routes, type Lang, type Localized } from '../i18n';

type Service = CollectionEntry<'services'>;

// Entry ids are `<lang>/<slug>`, from the folder layout in src/content/services.
export const serviceLang = ({ id }: Service) => id.split('/')[0] as Lang;
export const serviceSlug = ({ id }: Service) => id.split('/')[1];
export const servicePath = (entry: Service) => `${routes.services[serviceLang(entry)]}${serviceSlug(entry)}/`;

export const servicesIn = async (lang: Lang) =>
  (await getCollection('services', (entry) => serviceLang(entry) === lang)).sort(
    (a, b) => a.data.order - b.data.order,
  );

// The same service in every language that has it, for the language switch and hreflang.
export const serviceAlternates = async (entry: Service): Promise<Partial<Localized>> => {
  const translations = await getCollection('services', ({ data }) => data.key === entry.data.key);
  return Object.fromEntries(translations.map((t) => [serviceLang(t), servicePath(t)]));
};
