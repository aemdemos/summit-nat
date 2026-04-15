function buildDropdown(options) {
  const select = document.createElement('select');
  select.className = 'cards-action-select';
  options.forEach((text) => {
    const o = document.createElement('option');
    o.textContent = text;
    o.value = text;
    select.append(o);
  });
  return select;
}

function buildZipRow(ctaLink) {
  const formRow = document.createElement('div');
  formRow.className = 'cards-action-zip-row';
  const zipInput = document.createElement('input');
  zipInput.type = 'text';
  zipInput.placeholder = 'ZIP Code';
  zipInput.className = 'cards-action-zip';
  zipInput.setAttribute('aria-label', 'ZIP Code');
  formRow.append(zipInput);
  if (ctaLink) {
    const goBtn = ctaLink.cloneNode(true);
    goBtn.classList.add('cards-action-go');
    formRow.append(goBtn);
  }
  return formRow;
}

function decorateCard(bodyDiv) {
  const heading = bodyDiv.querySelector('h3');
  const headingText = heading ? heading.textContent.trim().toLowerCase() : '';
  const ctaParagraph = bodyDiv.querySelector('p:last-of-type');
  const ctaLink = ctaParagraph ? ctaParagraph.querySelector('a') : null;

  if (headingText.includes('no login')) {
    // Find the paragraph with pipe-separated option labels (plain text)
    const paragraphs = bodyDiv.querySelectorAll('p');
    let optionsParagraph = null;
    paragraphs.forEach((p) => {
      if (p.textContent.includes('|') && !p.querySelector('a')) {
        optionsParagraph = p;
      }
    });
    if (optionsParagraph) {
      const options = optionsParagraph.textContent.split('|').map((t) => t.trim()).filter(Boolean);
      const select = buildDropdown(options);
      optionsParagraph.replaceWith(select);
    }
  } else if (headingText.includes('find a local')) {
    const formRow = buildZipRow(ctaLink);
    if (ctaParagraph) ctaParagraph.replaceWith(formRow);
    return;
  }

  if (ctaLink) {
    ctaLink.classList.add('cards-action-cta');
    ctaLink.classList.remove('button', 'primary');
    const wrapper = ctaLink.closest('.button-container, .button-wrapper');
    if (wrapper) wrapper.classList.remove('button-container', 'button-wrapper');
  }
}

export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    const cols = [...row.children];

    if (cols[0]) {
      const iconDiv = document.createElement('div');
      iconDiv.className = 'cards-action-icon';
      const img = cols[0].querySelector('img');
      if (img) iconDiv.append(img);
      li.append(iconDiv);
    }

    if (cols[1]) {
      const bodyDiv = document.createElement('div');
      bodyDiv.className = 'cards-action-body';
      while (cols[1].firstChild) bodyDiv.append(cols[1].firstChild);
      decorateCard(bodyDiv);
      li.append(bodyDiv);
    }

    ul.append(li);
  });

  block.textContent = '';
  block.append(ul);
}
