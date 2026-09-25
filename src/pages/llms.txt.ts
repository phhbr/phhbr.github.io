import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../config';

// Summary of the site for language models, following https://llmstxt.org.
export async function GET(context: APIContext) {
  const url = (path: string) => new URL(path, context.site).href;
  const services = (await getCollection('services')).sort((a, b) => a.data.order - b.data.order);
  const posts = (await getCollection('posts', ({ data }) => !data.noindex)).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );

  const body = [
    `# ${SITE.author}`,
    '',
    `> ${SITE.description}`,
    '',
    `Contact: ${SITE.email}. Code: ${SITE.github}.`,
    '',
    '## Services',
    '',
    `- [Services](${url('/services/')}): what I offer and ways to work together`,
    ...services.map(({ id, data }) => `  - [${data.title}](${url(`/services/${id}/`)}): ${data.summary}`),
    `- [Work](${url('/work/')}): selected projects, clients described by sector`,
    '',
    '## About',
    '',
    `- [CV](${url('/cv/')}): experience, education, teaching, certificates and recommendations`,
    '',
    '## Writing',
    '',
    ...posts.map(
      ({ id, data }) =>
        `- [${data.title}](${url(`/${id}/`)}): ${data.description}${data.archived ? ' (archived)' : ''}`,
    ),
    '',
    '## Optional',
    '',
    `- [Legal notice](${url('/legal/')}): Impressum`,
    `- [Privacy policy](${url('/privacy/')})`,
    '',
  ].join('\n');

  return new Response(body);
}
