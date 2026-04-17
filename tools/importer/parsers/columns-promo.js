/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-promo. Base: columns.
 * Source: https://www.nationwide.com/
 * Selectors from captured DOM: #p43486 .row.text-center.align-center
 * Three icon + heading + description + CTA columns.
 */
export default function parse(element, { document }) {
  // Find the three column containers
  const columns = Array.from(element.querySelectorAll(':scope > .column, :scope > div[class*="column"]'));

  // Build a single row with one cell per column
  const row = [];

  columns.forEach((col) => {
    const icon = col.querySelector('img');
    const heading = col.querySelector('h3, .mopHeading, .nw-heading-sm');
    const description = col.querySelector('p, .mopDesc');
    const cta = col.querySelector('a.button, a[class*="nw-button"]');

    const cellContent = [];
    if (icon) cellContent.push(icon);
    if (heading) cellContent.push(heading);
    if (description) cellContent.push(description);
    if (cta) cellContent.push(cta);

    if (cellContent.length > 0) {
      row.push(cellContent);
    }
  });

  const cells = [];
  if (row.length > 0) {
    cells.push(row);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-promo', cells });
  element.replaceWith(block);
}
