import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Replaces plain "|" text nodes inside a container with styled separator spans.
 */
function stylePipeSeparators(container) {
  container.querySelectorAll('p').forEach((p) => {
    const nodes = [...p.childNodes];
    nodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.includes('|')) {
        const parts = node.textContent.split('|');
        const fragment = document.createDocumentFragment();
        parts.forEach((part, i) => {
          if (part) fragment.append(document.createTextNode(part));
          if (i < parts.length - 1) {
            const sep = document.createElement('span');
            sep.className = 'footer-separator';
            sep.textContent = '|';
            fragment.append(sep);
          }
        });
        node.replaceWith(fragment);
      }
    });
  });
}

/**
 * Nationwide footer — 6 sections:
 *   1. footer-brand (logo + phone)
 *   2. footer-social (social icons)
 *   3. footer-about (about links)
 *   4. footer-partners (business partner links)
 *   5. footer-legal (underwriting text)
 *   6. footer-privacy (privacy links + trust images)
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  const classes = ['brand', 'social', 'about', 'partners', 'legal', 'privacy'];
  classes.forEach((c, i) => {
    const section = footer.children[i];
    if (section) section.classList.add(`footer-${c}`);
  });

  // Clean up button classes EDS may have added
  footer.querySelectorAll('.button-container').forEach((bc) => {
    bc.classList.remove('button-container');
    const btn = bc.querySelector('.button');
    if (btn) btn.classList.remove('button');
  });

  // Style pipe separators in about, partners, and privacy sections
  const about = footer.querySelector('.footer-about');
  const partners = footer.querySelector('.footer-partners');
  const privacy = footer.querySelector('.footer-privacy');
  if (about) stylePipeSeparators(about);
  if (partners) stylePipeSeparators(partners);
  if (privacy) stylePipeSeparators(privacy);

  block.append(footer);
}
