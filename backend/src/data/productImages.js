/**
 * Centralized Product Image System — Hybrid Approach
 * --------------------------------------------------------------------------
 * Strategy:
 *   1. PRODUCT-SPECIFIC photo (`.jpg` served from `/images/products/`)
 *   2. CATEGORY PLACEHOLDER photo (category-representative `.jpg`)
 *   3. SVG FALLBACK (only if `.jpg` fails to load — handled by frontend onError)
 *
 * Every product card ALWAYS shows a meaningful visual. No empty boxes.
 * The frontend `onError` handler swaps in a styled SVG tile if a .jpg ever 404s.
 */

const IMAGE_BASE = '/images/products';

// ─── PER-PRODUCT IMAGE KEYS ─────────────────────────────────────────────────
// Maps product ID → image key (resolves to /images/products/{key}.jpg)
// Priority 1: exact product image
export const PRODUCT_IMAGES = {
  // Health & Medicine
  prod_001: 'thermometer',     // Digital Thermometer
  prod_002: 'medicine',        // Paracetamol Syrup (Kids)
  prod_003: 'ors',             // ORS Sachets
  prod_005: 'bandaid',         // Band-Aid Strips
  prod_006: 'medicine',        // Antiseptic Liquid
  prod_007: 'bandaid',         // Cotton Balls

  // Baby Care
  prod_004: 'babycare',        // Wet Wipes

  // Food & Cooking
  prod_010: 'noodles',         // Instant Noodles
  prod_011: 'bread',           // Bread
  prod_012: 'eggs',            // Eggs
  prod_013: 'butter',          // Butter
  prod_014: 'milk',            // Milk
  prod_014a: 'milk',           // Mother Dairy Milk
  prod_015: 'pasta',           // Pasta
  prod_016: 'pastasauce',      // Pasta Sauce
  prod_017: 'rice',            // Rice

  // Dessert
  prod_018: 'icecream',        // Ice Cream Tub
  prod_019: 'cake',            // Chocolate Cake Slice

  // Snacks
  prod_019a: 'popcorn',        // Popcorn Tub
  prod_023: 'chips',           // Chips

  // Party & Celebration
  prod_019b: 'party',          // Disposable Cups
  prod_020: 'party',           // Party Cups
  prod_021: 'party',           // Paper Plates
  prod_024: 'candles',         // Birthday Candles
  prod_025: 'party',           // Balloons
  prod_031a: 'party',          // Disposable Plates

  // Home
  prod_019c: 'tissues',        // Tissues Box
  prod_052: 'candles',         // Candles (Pack of 6)

  // Beverages
  prod_022: 'softdrinks',      // Soft Drinks
  prod_074: 'coffee',          // Coffee (Instant)
  prod_075: 'softdrinks',      // Energy Drink
  prod_075a: 'proteinbar',     // Protein Bar

  // Pet Care
  prod_023a: 'pet',            // Dog Treats
  prod_023b: 'pet',            // Chew Sticks
  prod_023c: 'pet',            // Pet Bowl
  prod_023d: 'pet',            // Dental Chews
  prod_080: 'pet',             // Dog Food
  prod_081: 'pet',             // Cat Food
  prod_082: 'pet',             // Pet Poop Bags

  // Cleaning
  prod_030: 'cleaning',        // Floor Cleaner
  prod_031: 'cleaning',        // Paper Towels
  prod_032: 'cleaning',        // Garbage Bags
  prod_033: 'cleaning',        // Mop with Bucket

  // Personal Care
  prod_040: 'personalcare',    // Toothbrush + Toothpaste
  prod_041: 'towel',           // Towel
  prod_042: 'personalcare',    // Shampoo Sachet
  prod_043: 'personalcare',    // Soap Bar

  // Electronics
  prod_050: 'electronics',     // Power Bank
  prod_051: 'electronics',     // USB-C Cable
  prod_053: 'electronics',     // LED Flashlight
  prod_054: 'electronics',     // AA Batteries
  prod_054a: 'electronics',    // Power Bank (Fast Charge)

  // Accessories
  prod_060: 'umbrella',        // Umbrella
  prod_061: 'umbrella',        // Raincoat

  // Stationery
  prod_070: 'stationery',      // Notebook
  prod_071: 'stationery',      // Pen Set
  prod_072: 'stationery',      // Highlighter Set
  prod_073: 'stationery',      // Sticky Notes

  // Gifting
  prod_g01: 'cake',            // Premium Chocolate Box
  prod_g02: 'cake',            // Luxury Chocolate Collection
  prod_g03: 'coffee',          // Coffee Gift Pack
  prod_g04: 'coffee',          // Premium Tea Collection
  prod_g05: 'stationery',      // Greeting Card
  prod_g06: 'candles',         // Scented Candle
  prod_g07: 'cake',            // Mini Indoor Plant (uses cake as closest)
  prod_g08: 'coffee',          // Decorative Ceramic Mug
  prod_g09: 'personalcare',    // Photo Frame
  prod_g10: 'stationery',      // Desk Organizer Set
  prod_g11: 'stationery',      // Premium Notebook Set
  prod_g12: 'stationery',      // Premium Pen Set
  prod_g13: 'cake',            // Gift Basket
  prod_g14: 'personalcare',    // Keychain
  prod_g15: 'babycare',        // Soft Toy
  prod_g16: 'personalcare',    // Scented Soap Set
  prod_g17: 'bread',           // Dry Fruits Box
  prod_g18: 'candles'          // Aromatic Diffuser Set
};

// ─── CATEGORY PLACEHOLDER KEYS ──────────────────────────────────────────────
// Priority 2: if no product-specific mapping exists, use category representative
const CATEGORY_DEFAULT_KEY = {
  Health: 'medicine',
  'Baby Care': 'babycare',
  Food: 'bread',
  Dessert: 'cake',
  Snacks: 'chips',
  Beverages: 'softdrinks',
  Party: 'party',
  Home: 'tissues',
  'Pet Care': 'pet',
  Cleaning: 'cleaning',
  'Personal Care': 'personalcare',
  Electronics: 'electronics',
  Accessories: 'umbrella',
  Stationery: 'stationery',
  Gifting: 'cake'
};

function photoUrl(key) {
  return `${IMAGE_BASE}/${key}.jpg`;
}

// ─── SVG FALLBACK (Priority 3 — only used by frontend onError) ──────────────
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

function escapeXml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function svgTile(label, category) {
  const [bg, fg] = CATEGORY_PALETTE[category] || ['#eef2f7', '#64748b'];
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">` +
    `<rect width="400" height="400" fill="${bg}"/>` +
    `<text x="200" y="200" font-family="Arial, Helvetica, sans-serif" font-size="26" ` +
    `font-weight="700" fill="${fg}" text-anchor="middle" dominant-baseline="middle">` +
    `${escapeXml(label || category || 'Product')}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function getCategoryFallbackImage(category) {
  return svgTile(category, category);
}

export const GENERIC_PLACEHOLDER = svgTile('Product', 'Product');

// ─── RESOLVER ────────────────────────────────────────────────────────────────
/**
 * Resolves a product to its best available image.
 *
 * Priority 1: Product-specific .jpg (from PRODUCT_IMAGES registry)
 * Priority 2: Category placeholder .jpg (from CATEGORY_DEFAULT_KEY)
 * Priority 3: SVG tile fallback (never empty — always shows something)
 *
 * The frontend `onError` handler (productImage.js) provides the final safety net:
 * if a .jpg 404s at runtime, it swaps in a category-colored SVG tile with the
 * product name — so the user NEVER sees an empty/broken image box.
 */
export function resolveProductImage(product) {
  if (!product) return GENERIC_PLACEHOLDER;

  // Priority 1: exact product image
  const productKey = PRODUCT_IMAGES[product.id];
  if (productKey) {
    return photoUrl(productKey);
  }

  // Priority 2: category placeholder image
  const categoryKey = CATEGORY_DEFAULT_KEY[product.category];
  if (categoryKey) {
    return photoUrl(categoryKey);
  }

  // Priority 3: inline SVG (never empty)
  return getCategoryFallbackImage(product.category || 'Product');
}

export default { PRODUCT_IMAGES, resolveProductImage, getCategoryFallbackImage, GENERIC_PLACEHOLDER };
