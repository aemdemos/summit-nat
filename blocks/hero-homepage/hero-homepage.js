// Options that do NOT show the ZIP Code input
const NO_ZIP_OPTIONS = ['business', 'life', 'pet', 'see all insurance'];

function shouldShowZip(optionText) {
  return !NO_ZIP_OPTIONS.includes(optionText.toLowerCase());
}

export default function decorate(block) {
  const textCol = block.querySelector(':scope > div:last-child');
  if (!textCol) return;

  const paragraphs = textCol.querySelectorAll('p');
  paragraphs.forEach((p) => {
    const links = p.querySelectorAll('a');
    if (links.length >= 3 && p.textContent.includes('|')) {
      const form = document.createElement('div');
      form.className = 'hero-quote-form';

      const select = document.createElement('select');
      select.className = 'hero-select';
      links.forEach((link) => {
        const option = document.createElement('option');
        option.value = link.href;
        option.textContent = link.textContent.trim();
        select.append(option);
      });

      const zipInput = document.createElement('input');
      zipInput.type = 'text';
      zipInput.className = 'hero-zip-input';
      zipInput.placeholder = 'ZIP Code';
      zipInput.setAttribute('aria-label', 'ZIP Code');

      const btn = document.createElement('a');
      btn.className = 'hero-quote-btn';
      btn.href = links[0].href;
      btn.textContent = 'Start your quote';

      select.addEventListener('change', () => {
        btn.href = select.value;
        const selectedText = select.options[select.selectedIndex].textContent;
        if (shouldShowZip(selectedText)) {
          zipInput.style.display = '';
        } else {
          zipInput.style.display = 'none';
        }
      });

      form.append(select, zipInput, btn);
      p.replaceWith(form);
    }
  });
}
