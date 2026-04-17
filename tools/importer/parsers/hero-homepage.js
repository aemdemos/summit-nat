/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-homepage. Base: hero.
 * Source: https://www.nationwide.com/
 * Two-column layout: Row 1 = image + caption, Row 2 = text + form links
 */
export default function parse(element, { document }) {
  // Extract hero image
  const heroImage = element.querySelector('.bg-image-container img, .large-shrink img, .large-shrink-custom img');

  // Extract caption text
  const captionEl = element.querySelector('.custom-img-text');
  const captionText = captionEl ? captionEl.textContent.trim() : '';

  // Extract heading and subtitle
  const heading = element.querySelector('h1, .banner-title');
  const subtitle = element.querySelector('h2');

  // Extract form options (select dropdown values)
  const selectEl = element.querySelector('select');
  const options = selectEl ? [...selectEl.options].map((o) => o.textContent.trim()) : [];
  const optionsText = options.join(' | ');

  // Extract CTA links
  const ctaLinks = Array.from(element.querySelectorAll('.find-an-agent-link, .nw-banner-inpage__content > div > a'));

  const cells = [];

  // Row 1: Image column (image + caption)
  const imageCell = [];
  if (heroImage) imageCell.push(heroImage);
  if (captionText) {
    const strong = document.createElement('strong');
    strong.textContent = captionText;
    imageCell.push(strong);
  }
  if (imageCell.length > 0) cells.push(imageCell);

  // Row 2: Text column (heading + subtitle + form options + CTA links)
  const textCell = [];
  if (heading) textCell.push(heading);
  if (subtitle) textCell.push(subtitle);
  if (optionsText) {
    const optionsP = document.createElement('p');
    // Build pipe-separated links for each option
    const formLinks = options.map((opt) => {
      const a = document.createElement('a');
      a.href = '/personal/insurance/auto/';
      a.textContent = opt;
      return a;
    });
    formLinks.forEach((a, i) => {
      optionsP.append(a);
      if (i < formLinks.length - 1) optionsP.append(' | ');
    });
    textCell.push(optionsP);
  }
  ctaLinks.forEach((link) => {
    const p = document.createElement('p');
    p.append(link);
    textCell.push(p);
  });
  if (textCell.length > 0) cells.push(textCell);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-homepage', cells });
  element.replaceWith(block);
}
