/**
 * Category Validation & Matching
 * Ensures products match the detected situation category
 */

export function validateProductCategory(product, allowedCategories) {
  if (!allowedCategories || allowedCategories.length === 0) return true;
  const normalized = String(product.category || '').toLowerCase();
  return allowedCategories.some(cat => normalized === cat.toLowerCase());
}

export function filterProductsByCategory(products, allowedCategories) {
  if (!allowedCategories || allowedCategories.length === 0) return products;
  return products.filter(p => validateProductCategory(p, allowedCategories));
}

export function detectMissingEssentials(cart, situation) {
  const essentials = {
    'Pet Food Refill': [
      { name: 'Dog Treats', category: 'Pet Care', reason: 'Treats complement food refills' },
      { name: 'Pet Bowl', category: 'Pet Care', reason: 'Essential feeding equipment' }
    ],
    'Movie Night': [
      { name: 'Disposable Cups', category: 'Party', reason: 'For serving drinks during the movie' },
      { name: 'Popcorn Tub', category: 'Snacks', reason: 'Classic movie night snack' }
    ],
    'Guest Arrival': [
      { name: 'Tissues Box', category: 'Home', reason: 'Guests appreciate tissues in common areas' },
      { name: 'Soap Bar', category: 'Personal Care', reason: 'Guest hygiene essentials' }
    ],
    'Baby Care': [
      { name: 'ORS Sachets', category: 'Health', reason: 'Hydration support' },
      { name: 'Wet Wipes', category: 'Baby Care', reason: 'Essential baby hygiene' }
    ],
    'Study Session': [
      { name: 'Highlighter Set', category: 'Stationery', reason: 'Essential for exam prep' },
      { name: 'Sticky Notes', category: 'Stationery', reason: 'Quick memory reminders' }
    ],
    'Power Cut': [
      { name: 'Candles', category: 'Home', reason: 'Backup emergency lighting' },
      { name: 'Power Bank', category: 'Electronics', reason: 'Phone charging during outage' }
    ],
    'First Aid': [
      { name: 'Antiseptic Liquid', category: 'Health', reason: 'Wound cleaning is essential' },
      { name: 'Band-Aid Strips', category: 'Health', reason: 'Wound coverage and protection' }
    ],
    'Rainy Day': [
      { name: 'Umbrella', category: 'Accessories', reason: 'Rain protection' },
      { name: 'Raincoat', category: 'Accessories', reason: 'Extended weather protection' }
    ],
    'House Party': [
      { name: 'Party Cups', category: 'Party', reason: 'Essential for serving drinks' },
      { name: 'Paper Plates', category: 'Party', reason: 'Easy serving and cleanup' }
    ],
    'Office Essentials': [
      { name: 'Pen Set', category: 'Stationery', reason: 'Basic writing tools' },
      { name: 'Notebook', category: 'Stationery', reason: 'Note-taking essential' }
    ],
    'Gym Recovery': [
      { name: 'Protein Bar', category: 'Beverages', reason: 'Post-workout recovery' },
      { name: 'Electrolyte Drink', category: 'Beverages', reason: 'Hydration and recovery' }
    ],
    'Road Trip': [
      { name: 'Chips', category: 'Snacks', reason: 'Travel snack staple' },
      { name: 'Power Bank', category: 'Electronics', reason: 'Phone charging for navigation' }
    ]
  };

  if (!essentials[situation]) return [];

  const cartItemNames = new Set(cart.map(item => item.name.toLowerCase()));
  return essentials[situation]
    .filter(ess => !cartItemNames.has(ess.name.toLowerCase()))
    .slice(0, 2);
}

export default { validateProductCategory, filterProductsByCategory, detectMissingEssentials };
