// Loaded as a blocking script in <head>: applies the saved theme before first
// paint (no flash of the wrong theme), then wires up the toggle once the DOM is
// ready. External on purpose: the CSP allows no inline scripts.
(() => {
  const KEY = 'theme';
  const root = document.documentElement;
  const prefersDark = matchMedia('(prefers-color-scheme: dark)');

  try {
    const saved = localStorage.getItem(KEY);
    if (saved === 'light' || saved === 'dark') root.dataset.theme = saved;
  } catch {
    // Storage blocked: fall back to the system preference.
  }

  const current = () => root.dataset.theme ?? (prefersDark.matches ? 'dark' : 'light');

  document.addEventListener('DOMContentLoaded', () => {
    const button = document.querySelector('[data-theme-toggle]');
    if (!button) return;

    const sync = () => button.setAttribute('aria-pressed', String(current() === 'dark'));
    button.addEventListener('click', () => {
      const next = current() === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      try {
        localStorage.setItem(KEY, next);
      } catch {
        // Not persisted; the choice still applies to this page.
      }
      sync();
    });
    prefersDark.addEventListener('change', sync);
    sync();
    button.hidden = false;
  });
})();
