import type { APIContext } from 'astro';
import { SITE } from '../../config';

// RFC 9116. Expires is refreshed on every build and must stay under a year out.
const EXPIRES_IN_DAYS = 360;

export function GET(context: APIContext) {
  const expires = new Date(Date.now() + EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000);
  const canonical = new URL('/.well-known/security.txt', context.site);
  const body = [
    `Contact: mailto:${SITE.email}`,
    `Expires: ${expires.toISOString()}`,
    'Preferred-Languages: en, de',
    `Canonical: ${canonical}`,
    '',
  ].join('\n');
  return new Response(body);
}
