/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroHomepageParser from './parsers/hero-homepage.js';
import cardsActionParser from './parsers/cards-action.js';
import cardstilesParser from './parsers/cards-tiles.js';
import columnsPromoParser from './parsers/columns-promo.js';
import columnsHighlightParser from './parsers/columns-highlight.js';

// TRANSFORMER IMPORTS
import nationwideCleanup from './transformers/nationwide-cleanup.js';
import nationwideSections from './transformers/nationwide-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-homepage': heroHomepageParser,
  'cards-action': cardsActionParser,
  'cards-tiles': cardstilesParser,
  'columns-promo': columnsPromoParser,
  'columns-highlight': columnsHighlightParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Nationwide homepage with hero banner, quick-action cards, promotional columns, image tiles, CTA banners, and mobile app promo',
  urls: [
    'https://www.nationwide.com/',
  ],
  blocks: [
    {
      name: 'hero-homepage',
      instances: ['.nw-home-quote-banner'],
    },
    {
      name: 'cards-action',
      instances: ['.custom-tri-promo'],
    },
    {
      name: 'columns-promo',
      instances: ['#p43486 .row.text-center.align-center'],
    },
    {
      name: 'cards-tiles',
      instances: ['#p30097', '#p30087'],
    },
    {
      name: 'columns-highlight',
      instances: ['#p43655 .row.nw-inner-bun--sm'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero Banner',
      selector: '.nw-home-quote-banner',
      style: 'blue',
      blocks: ['hero-homepage'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Tri-Promo Quick Actions',
      selector: '.custom-tri-promo',
      style: null,
      blocks: ['cards-action'],
      defaultContent: [],
    },
    {
      id: 'section-3',
      name: 'Multi-Option Promo',
      selector: '#p43486',
      style: 'light',
      blocks: ['columns-promo'],
      defaultContent: ['#p43486 .nw-heading-tiempos-md'],
    },
    {
      id: 'section-4',
      name: 'Member CTA Banner',
      selector: '#p45265',
      style: 'dark',
      blocks: [],
      defaultContent: ['#p45265 .nw-cta-small'],
    },
    {
      id: 'section-5',
      name: 'Image Tiles Two',
      selector: '#p30097',
      style: null,
      blocks: ['cards-tiles'],
      defaultContent: [],
    },
    {
      id: 'section-6',
      name: 'Image Tiles Three',
      selector: '#p30087',
      style: null,
      blocks: ['cards-tiles'],
      defaultContent: [],
    },
    {
      id: 'section-7',
      name: 'About Mission Text',
      selector: '#p45234',
      style: 'center',
      blocks: [],
      defaultContent: ['#p45234 h2', '#p45234 p'],
    },
    {
      id: 'section-8',
      name: 'Business CTA Banner',
      selector: '#p45310',
      style: 'dark',
      blocks: [],
      defaultContent: ['#p45310 .cta-text'],
    },
    {
      id: 'section-9',
      name: 'Mobile App Promo',
      selector: '#p43655',
      style: 'blue',
      blocks: ['columns-highlight'],
      defaultContent: [],
    },
    {
      id: 'section-10',
      name: 'Disclaimer',
      selector: '#p44604',
      style: null,
      blocks: [],
      defaultContent: ['#p44604 .nw-text-sm'],
    },
  ],
};

// TRANSFORMER REGISTRY
const transformers = [
  nationwideCleanup,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [nationwideSections] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

// EXPORT DEFAULT CONFIGURATION
export default {
  transform: (payload) => {
    const { document, url, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index',
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
