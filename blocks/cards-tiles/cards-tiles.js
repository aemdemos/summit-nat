export default function decorate(block) {
  const rows = [...block.children];

  const container = document.createElement('div');
  container.className = 'cards-tiles-grid';

  rows.forEach((row, i) => {
    const tile = document.createElement('a');
    tile.className = 'cards-tiles-tile';

    const cols = [...row.children];

    // Column 1: image
    const img = cols[0] ? cols[0].querySelector('img') : null;
    if (img) {
      const imgWrapper = document.createElement('div');
      imgWrapper.className = 'cards-tiles-img';
      img.loading = 'eager';
      imgWrapper.append(img);
      tile.append(imgWrapper);
    }

    // Column 2: link text
    const link = cols[1] ? cols[1].querySelector('a') : null;
    if (link) {
      tile.href = link.href;
      const label = document.createElement('div');
      label.className = 'cards-tiles-label';
      label.textContent = link.textContent.trim();
      tile.append(label);
    }

    // Wide tile: second row for "left" variant, first row for others
    const wideIndex = block.classList.contains('left') ? 1 : 0;
    if (i === wideIndex) {
      tile.classList.add('cards-tiles-wide');
    }

    container.append(tile);
  });

  block.textContent = '';
  block.append(container);
}
