import { defineHastPlugin } from 'satteri';

// Adds rel="noopener noreferrer" to Markdown links that leave the site.
export const externalLinks = (site: string) =>
  defineHastPlugin({
    name: 'external-links',
    element: {
      filter: ['a'],
      visit(node, context) {
        const href = String(node.properties.href ?? '');
        if (/^https?:\/\//.test(href) && !href.startsWith(site)) {
          context.setProperty(node, 'rel', 'noopener noreferrer');
        }
      },
    },
  });
