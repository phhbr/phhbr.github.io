import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../config';
import { postPath, routes } from '../i18n';
import { servicePath, servicesIn } from '../utils/services';

// Summary of the site for language models, following https://llmstxt.org.
export async function GET(context: APIContext) {
  const url = (path: string) => new URL(path, context.site).href;
  const services = await servicesIn('en');
  const posts = (await getCollection('posts', ({ data }) => !data.noindex)).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );

  const body = [
    `# ${SITE.author}`,
    '',
    `> ${SITE.description.en}`,
    '',
    `Contact: ${SITE.email}, ${SITE.phone}. Code: ${SITE.github}.`,
    '',
    `The site is in English (${url(routes.home.en)}) and German (${url(routes.home.de)}); posts are English only.`,
    '',
    '## Services',
    '',
    `- [Services](${url(routes.services.en)}): what I offer and ways to work together`,
    ...services.map((entry) => `  - [${entry.data.title}](${url(servicePath(entry))}): ${entry.data.summary}`),
    `- [Work](${url(routes.work.en)}): selected projects, clients described by sector`,
    '',
    '## About',
    '',
    `- [CV](${url(routes.cv.en)}): experience, education, teaching, certificates and recommendations`,
    '',
    '## Writing',
    '',
    ...posts.map(
      ({ id, data }) =>
        `- [${data.title}](${url(postPath(id))}): ${data.description}${data.archived ? ' (archived)' : ''}`,
    ),
    '',
    '## Optional',
    '',
    `- [German version](${url(routes.home.de)}): Leistungen, Projekte, Lebenslauf`,
    `- [Legal notice](${url(routes.legal.en)}): Impressum, also in German at ${url(routes.legal.de)}`,
    `- [Privacy policy](${url(routes.privacy.en)})`,
    '',
  ].join('\n');

  return new Response(body);
}
