/**
 * Frontend image fallback helper.
 *
 * Product images are served by the backend as self-contained SVG data URIs, so
 * they are always available. This helper mirrors that styling and is used as a
 * last-line-of-defense `onError` fallback (which should essentially never fire),
 * producing a category-coloured, icon + label tile — never a broken image.
 */

const CATEGORY_PALETTE = {
  Health: ['#e7f5ec', '#1f8a4c'],
  'Baby Care': ['#fdeef5', '#c2557f'],
  Food: ['#fff3e2', '#c9791a'],
  Dessert: ['#fde7ef', '#bd4a75'],
  Snacks: ['#fff6df', '#b8870b'],
  Beverages: ['#e7f0fb', '#2563a8'],
  Party: ['#f4eafb', '#7e40b2'],
  Home: ['#eef2f7', '#566b86'],
  'Pet Care': ['#e9f6ee', '#388a52'],
  Cleaning: ['#e4f6f8', '#1c8a99'],
  'Personal Care': ['#eceffb', '#4a54aa'],
  Electronics: ['#eceff4', '#3a4253'],
  Accessories: ['#e8f3fb', '#2f6aaa'],
  Stationery: ['#fdf2e6', '#bf7a1e'],
  Gifting: ['#fce4ec', '#c2185b']
};

const DEFAULT_ICON =
  '<path d="m7.5 4.3 9 5.1"/><path d="M21 8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>';

const CATEGORY_ICONS = {
  Health:
    '<path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/>',
  'Baby Care':
    '<path d="M8 2h8"/><path d="M9 2v2.8a4 4 0 0 1-.7 2.2l-.6 1A4 4 0 0 0 7 10.2V20a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-9.8a4 4 0 0 0-.7-2.2l-.6-1A4 4 0 0 1 15 4.8V2"/><path d="M7 15a6.5 6.5 0 0 1 5 0 6.5 6.5 0 0 0 5 0"/>',
  Food:
    '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>',
  Dessert:
    '<path d="m7 11 4.08 10.35a1 1 0 0 0 1.84 0L17 11"/><path d="M17 7A5 5 0 0 0 7 7"/><path d="M17 7a2 2 0 0 1 0 4H7a2 2 0 0 1 0-4"/>',
  Snacks:
    '<path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/><path d="M8.5 8.5v.01"/><path d="M16 15.5v.01"/><path d="M12 12v.01"/><path d="M11 17v.01"/><path d="M7 14v.01"/>',
  Beverages:
    '<path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/>',
  Party:
    '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5C9 3 12 5 12 8c0-3 3-5 4.5-5a2.5 2.5 0 0 1 0 5"/>',
  Home:
    '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  'Pet Care':
    '<circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="20" cy="16" r="2"/><path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.8 1Q6.5 17.5 4.5 16.8A3.5 3.5 0 0 1 5.5 10Z"/>',
  Cleaning:
    '<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C4 11.1 3 13 3 15a7 7 0 0 0 7 7z"/>',
  'Personal Care':
    '<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C4 11.1 3 13 3 15a7 7 0 0 0 7 7z"/>',
  Electronics:
    '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  Accessories:
    '<path d="M22 12a10.06 10.06 0 0 0-20 0Z"/><path d="M12 12v8a2 2 0 0 0 4 0"/><path d="M12 2v1"/>',
  Stationery:
    '<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>'
};

function escapeXml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function wrapName(name, maxChars = 17, maxLines = 3) {
  const words = String(name || 'Product').split(/\s+/);
  const lines = [];
  let current = '';
  for (const word of words) {
    if (!current) current = word;
    else if ((current + ' ' + word).length <= maxChars) current += ' ' + word;
    else {
      lines.push(current);
      current = word;
    }
    if (lines.length === maxLines) break;
  }
  if (current && lines.length < maxLines) lines.push(current);
  return lines;
}

function buildTile(name, category) {
  const [bg, fg] = CATEGORY_PALETTE[category] || ['#eef2f7', '#64748b'];
  const icon = CATEGORY_ICONS[category] || DEFAULT_ICON;
  const lines = wrapName(name);

  const iconGroup =
    `<g transform="translate(140,86) scale(5)" fill="none" stroke="${fg}" ` +
    `stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${icon}</g>`;

  const categoryLabel =
    `<text x="200" y="48" font-family="Arial, Helvetica, sans-serif" font-size="18" ` +
    `font-weight="700" letter-spacing="1" fill="${fg}" fill-opacity="0.65" ` +
    `text-anchor="middle">${escapeXml((category || 'Product').toUpperCase())}</text>`;

  const startY = 268;
  const nameText = lines
    .map(
      (line, i) =>
        `<text x="200" y="${startY + i * 30}" font-family="Arial, Helvetica, sans-serif" ` +
        `font-size="24" font-weight="700" fill="${fg}" text-anchor="middle">${escapeXml(line)}</text>`
    )
    .join('');

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">` +
    `<rect width="400" height="400" fill="${bg}"/>` +
    `<rect x="56" y="118" width="288" height="120" rx="20" fill="#ffffff" fill-opacity="0.55"/>` +
    categoryLabel +
    iconGroup +
    nameText +
    `</svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function getFallbackImage(category, name) {
  return buildTile(name || category, category);
}

/**
 * onError handler factory. Prevents infinite error loops and substitutes a
 * category-appropriate tile.
 */
export function handleImageError(category, name) {
  return (event) => {
    const img = event.currentTarget;
    img.onerror = null;
    img.src = getFallbackImage(category, name);
  };
}

export default { getFallbackImage, handleImageError };
