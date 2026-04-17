/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Nationwide cleanup.
 * Selectors from captured DOM of https://www.nationwide.com/
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Remove cookie/consent banners, tracking pixels, chat widgets (from captured DOM)
    WebImporter.DOMUtils.remove(element, [
      '#truste-consent-track',
      '#consent_blackbar',
      '[id*="CybotCookiebot"]',
      '[class*="trustarc"]',
      '.nw-header__skip',
      'noscript',
    ]);

    // Remove hidden inputs that are not authorable
    element.querySelectorAll('input[type="hidden"], input#isPandP, input#isNvit').forEach((el) => el.remove());
  }

  if (hookName === H.after) {
    // Remove non-authorable site shell: header, footer, nav
    WebImporter.DOMUtils.remove(element, [
      'bolt-header',
      '#header',
      'footer',
      '#p37659',
      '.nw-footer',
      'iframe',
      'link',
      'script',
    ]);

    // Remove tracking/analytics attributes
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('onclick');
      el.removeAttribute('data-track');
      el.removeAttribute('data-analytics');
    });

    // Remove empty divs that have no content
    element.querySelectorAll('div:empty').forEach((el) => el.remove());
  }
}
