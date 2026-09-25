import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  loader: glob({
    pattern: '*.md',
    base: './src/content/posts',
    // `2022-03-01-still-alive.md` → `still-alive`, matching the posts' original URLs.
    generateId: ({ entry }) => entry.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, ''),
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    // Everything before the relaunch is an archive; new posts set `archived: false`.
    archived: z.boolean().default(true),
    // Too thin to be worth a search result; the URL keeps working.
    noindex: z.boolean().default(false),
  }),
});

const services = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    // Meta description for the service's own page (about 120–160 characters).
    description: z.string(),
    order: z.number(),
    skills: z.array(z.string()),
  }),
});

export const collections = { posts, services };
