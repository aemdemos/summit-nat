/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-highlight. Base: columns.
 * Source: https://www.nationwide.com/
 * Selectors from captured DOM: #p43655 .row.nw-inner-bun--sm
 * Two-column: left = app features with checkmarks, right = QR code.
 */
export default function parse(element, { document }) {
  // Find the two column containers (large-6 divs)
  const columns = Array.from(element.querySelectorAll(':scope > div[class*="columns"], :scope > div[class*="large-6"]'));

  const row = [];

  columns.forEach((col) => {
    const cellContent = [];

    // Get all meaningful content from each column
    const heading = col.querySelector('h3, .nw-heading-tiempos-md');
    const introText = col.querySelector('.nw-text-lg, div:first-child');
    const images = Array.from(col.querySelectorAll('img'));
    const paragraphs = Array.from(col.querySelectorAll('p'));
    const divTexts = Array.from(col.querySelectorAll(':scope > span > div'));

    // Column 1: heading + checklist items
    if (heading) {
      if (introText && introText !== heading) cellContent.push(introText);
      cellContent.push(heading);
    }

    // Add checklist items or other div content
    divTexts.forEach((div) => {
      if (div.textContent.trim()) cellContent.push(div);
    });

    // Add images (QR code in column 2)
    images.forEach((img) => {
      if (!cellContent.includes(img) && img.src && !img.src.startsWith('data:')) {
        cellContent.push(img);
      }
    });

    // Add paragraphs
    paragraphs.forEach((p) => {
      if (p.textContent.trim() && !cellContent.includes(p)) {
        cellContent.push(p);
      }
    });

    if (cellContent.length > 0) {
      row.push(cellContent);
    }
  });

  const cells = [];
  if (row.length > 0) {
    cells.push(row);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-highlight', cells });
  element.replaceWith(block);
}
