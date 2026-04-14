/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-tiles. Base: cards.
 * Source: https://www.nationwide.com/
 * Selectors from captured DOM: #p30097 (2-tile), #p30087 (3-tile)
 * Image tiles with overlay heading text and links.
 */
export default function parse(element, { document }) {
  // Find all tile links within the tile block section
  const tiles = Array.from(element.querySelectorAll('.nw-tile-block__tile'));

  const cells = [];

  tiles.forEach((tile) => {
    const image = tile.querySelector('.nw-tile-block__image img');
    const heading = tile.querySelector('.nw-tile-block__content-subheader, h2');
    const link = tile.closest('a') || tile.querySelector('a');

    const cardCell = [];

    // Row per card: image | heading with link
    if (image) {
      cardCell.push(image);
    }

    if (heading && link) {
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = heading.textContent.trim();
      cardCell.push(a);
    } else if (heading) {
      cardCell.push(heading);
    }

    if (cardCell.length > 0) {
      cells.push(cardCell);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-tiles', cells });
  element.replaceWith(block);
}
