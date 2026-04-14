/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-action. Base: cards.
 * Source: https://www.nationwide.com/
 * Selectors from captured DOM: .custom-tri-promo
 */
export default function parse(element, { document }) {
  // Each .custom-tri-promo is one card column
  // Extract icon, heading, description, CTA from each card
  const icon = element.querySelector('.nw-fg-rebrand-vibrant-blue img, img[src*="data:image/svg"]');
  const heading = element.querySelector('h3, .nw-heading-sm, .custom-heading');
  const description = element.querySelector('p');
  const cta = element.querySelector('a.button, a[class*="nw-button"], input[class*="button"]');

  const cells = [];
  const contentCell = [];

  if (icon) contentCell.push(icon);
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  if (cta) {
    // Convert input buttons to anchor links where possible
    if (cta.tagName === 'INPUT') {
      const link = document.createElement('a');
      link.href = '#';
      link.textContent = cta.value || 'Go';
      contentCell.push(link);
    } else {
      contentCell.push(cta);
    }
  }

  if (contentCell.length > 0) {
    cells.push(contentCell);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-action', cells });
  element.replaceWith(block);
}
