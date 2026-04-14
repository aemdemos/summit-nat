/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-homepage. Base: hero.
 * Source: https://www.nationwide.com/
 * Selectors from captured DOM: .nw-home-quote-banner
 */
export default function parse(element, { document }) {
  // Extract hero image (Peyton Manning banner)
  const heroImage = element.querySelector('.bg-image-container img, .large-shrink img, .large-shrink-custom img');

  // Extract heading
  const heading = element.querySelector('h1, .banner-title');

  // Extract subtitle
  const subtitle = element.querySelector('h2, .nw-banner-inpage__content h2');

  // Extract CTA links (find agent, explore financial products)
  const ctaLinks = Array.from(element.querySelectorAll('.find-an-agent-link, .nw-banner-inpage__content a'));

  // Build cells: Row 1 = image, Row 2 = content
  const cells = [];

  // Row 1: Hero image
  if (heroImage) {
    cells.push([heroImage]);
  }

  // Row 2: Content - heading, subtitle, CTAs
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (subtitle) contentCell.push(subtitle);
  ctaLinks.forEach((link) => contentCell.push(link));
  if (contentCell.length > 0) {
    cells.push(contentCell);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-homepage', cells });
  element.replaceWith(block);
}
