/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-action. Base: cards.
 * Source: https://www.nationwide.com/
 * 3 cards with icon + heading + description + form/CTA
 * Each row: col1 = icon image, col2 = text content
 */
export default function parse(element, { document }) {
  const cells = [];

  // Each .custom-tri-promo is one card
  const cards = element.closest('.row')
    ? element.closest('.row').querySelectorAll('.custom-tri-promo')
    : [element];

  cards.forEach((card) => {
    const icon = card.querySelector('.nw-fg-rebrand-vibrant-blue svg, .nw-fg-rebrand-vibrant-blue img');
    const heading = card.querySelector('h3, .nw-heading-sm, .custom-heading');
    const description = card.querySelector('p');

    // Build icon cell
    const iconCell = [];
    if (icon) {
      const img = document.createElement('img');
      img.src = '/icons/card-person.svg';
      img.alt = '';
      iconCell.push(img);
    }

    // Build text cell
    const textCell = [];
    if (heading) {
      const h3 = document.createElement('h3');
      h3.textContent = heading.textContent.trim();
      textCell.push(h3);
    }
    if (description) {
      const p = document.createElement('p');
      p.textContent = description.textContent.trim();
      textCell.push(p);
    }

    // Check for select/dropdown options
    const select = card.querySelector('select');
    if (select) {
      const options = [...select.options].map((o) => o.textContent.trim());
      const p = document.createElement('p');
      p.textContent = options.join(' | ');
      textCell.push(p);
    }

    // CTA button
    const cta = card.querySelector('a.button, input.button, .nw-button--expand');
    if (cta) {
      const p = document.createElement('p');
      const a = document.createElement('a');
      a.href = cta.href || '#';
      a.textContent = cta.textContent?.trim() || cta.value || 'Go';
      p.append(a);
      textCell.push(p);
    }

    if (iconCell.length > 0 || textCell.length > 0) {
      cells.push([iconCell, textCell]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-action', cells });
  element.replaceWith(block);
}
