/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Nationwide section breaks and section-metadata.
 * Runs in afterTransform only.
 * Selectors from page-templates.json sections for https://www.nationwide.com/
 */
const H = { after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.after) {
    const { template } = payload;
    if (!template || !template.sections || template.sections.length < 2) return;

    const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document };

    // Process sections in reverse order to avoid shifting DOM positions
    const sections = [...template.sections].reverse();

    sections.forEach((section, reverseIndex) => {
      const isFirst = reverseIndex === sections.length - 1;
      const sectionSelector = Array.isArray(section.selector) ? section.selector : [section.selector];

      let sectionEl = null;
      for (const sel of sectionSelector) {
        sectionEl = element.querySelector(sel);
        if (sectionEl) break;
      }

      if (!sectionEl) return;

      // Add section-metadata block if section has a style
      if (section.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.after(sectionMetadata);
      }

      // Add section break (hr) before each section except the first
      if (!isFirst) {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    });
  }
}
