import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 900px)');

function toggleAllNavSections(sections, expanded = false) {
  if (!sections) return;
  sections.querySelectorAll('.nav-menu > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navMenu = nav.querySelector('.nav-menu');
    if (!navMenu) return;
    const expanded = navMenu.querySelector('[aria-expanded="true"]');
    if (expanded && isDesktop.matches) {
      toggleAllNavSections(navMenu);
      expanded.focus();
    }
  }
}

function cleanButtonClasses(container) {
  container.querySelectorAll('.button-container').forEach((bc) => {
    bc.classList.remove('button-container');
    const btn = bc.querySelector('.button');
    if (btn) btn.classList.remove('button');
  });
}

function decorateUtility(navUtility) {
  const wrapper = navUtility.querySelector('.default-content-wrapper');
  if (!wrapper) return;
  const leftLinks = wrapper.querySelector('ul');
  const rightLink = wrapper.querySelector('p');
  if (leftLinks) leftLinks.classList.add('nav-utility-left');
  if (rightLink) rightLink.classList.add('nav-utility-right');
}

function buildSearchForm() {
  const form = document.createElement('form');
  form.className = 'nav-search-form';
  form.action = '/search';
  form.method = 'get';
  const input = document.createElement('input');
  input.type = 'text';
  input.name = 'query';
  input.placeholder = 'Search';
  input.className = 'nav-search-input';
  input.setAttribute('aria-label', 'Search');
  const btn = document.createElement('button');
  btn.type = 'submit';
  btn.className = 'nav-search-submit';
  btn.setAttribute('aria-label', 'Submit search');
  form.append(input, btn);
  return form;
}

function decorateBrand(navBrand) {
  const wrapper = navBrand.querySelector('.default-content-wrapper');
  if (!wrapper) return;
  wrapper.querySelectorAll('p').forEach((p) => {
    const img = p.querySelector('img');
    const link = p.querySelector('a');
    const text = p.textContent.trim();
    if (img) {
      p.classList.add('nav-logo');
      if (link) link.className = '';
    } else if (p.classList.contains('button-wrapper') && link) {
      link.className = 'nav-login-btn';
      p.className = 'nav-login';
    } else if (text === ':search:' || p.querySelector('.icon-search') || (link && link.textContent.trim().toLowerCase() === 'search')) {
      p.classList.add('nav-search');
      p.textContent = '';
      p.append(buildSearchForm());
    }
  });
}

function decorateSections(navSections) {
  const wrapper = navSections.querySelector('.default-content-wrapper');
  if (!wrapper) return;
  const ul = wrapper.querySelector('ul');
  const ctaContainer = document.createElement('div');
  ctaContainer.className = 'nav-cta-group';

  // EDS converts <strong><a> to <p class="button-wrapper"><a class="button primary">
  wrapper.querySelectorAll('p.button-wrapper, p.button-container').forEach((p) => {
    const link = p.querySelector('a');
    if (!link) return;
    link.className = 'nav-cta-btn';
    ctaContainer.append(link);
    p.remove();
  });

  if (ul) {
    const navMenu = document.createElement('div');
    navMenu.className = 'nav-menu';
    ul.parentNode.insertBefore(navMenu, ul);
    navMenu.append(ul);
    if (ctaContainer.children.length > 0) navMenu.append(ctaContainer);

    ul.querySelectorAll(':scope > li').forEach((li) => {
      if (!li.querySelector('ul')) return;
      li.classList.add('nav-drop');
      li.addEventListener('click', () => {
        if (!isDesktop.matches) return;
        const exp = li.getAttribute('aria-expanded') === 'true';
        toggleAllNavSections(navMenu);
        li.setAttribute('aria-expanded', exp ? 'false' : 'true');
      });
    });
  }
  cleanButtonClasses(navSections);
}

/**
 * Nationwide 3-bar header.
 * Nav sections: utility → brand → sections
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const classes = ['utility', 'brand', 'sections'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  const navUtility = nav.querySelector('.nav-utility');
  if (navUtility) decorateUtility(navUtility);

  const navBrand = nav.querySelector('.nav-brand');
  if (navBrand) decorateBrand(navBrand);

  const navSections = nav.querySelector('.nav-sections');
  if (navSections) decorateSections(navSections);

  nav.setAttribute('aria-expanded', 'false');
  window.addEventListener('keydown', closeOnEscape);

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
