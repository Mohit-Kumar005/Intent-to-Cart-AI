/**
 * Reactive Cart System - V3.1
 *
 * Every cart modification triggers recalculation of:
 * - Optimization Score (dynamic, not hardcoded)
 * - Cart Health
 * - Pack Scores
 * - Recommended Pack
 * - Missing Essentials
 * - Delivery Estimate
 * - Totals
 *
 * Score formula (Intent Match has HIGHEST weight):
 * Intent Match   = 40 pts (are these the RIGHT products for the situation?)
 * Availability   = 30 pts (are they in stock?)
 * Budget Fit     = 20 pts (does total fit the budget?)
 * Delivery Speed = 10 pts (can they arrive in time?)
 * Total          = 100 pts
 *
 * Quantities are respected in all calculations. Each product may have a
 * `quantity` field (defaults to 1). Totals, item counts, and budget
 * calculations all use effective quantity.
 */

/**
 * Calculate cart total respecting quantities.
 * Each product's contribution = price × (quantity || 1)
 */
export function calculateCartTotal(products) {
  return products.reduce((sum, p) => sum + p.price * (p.quantity || 1), 0);
}

/**
 * Get effective item count (sum of quantities).
 */
export function getEffectiveItemCount(products) {
  return products.reduce((sum, p) => sum + (p.quantity || 1), 0);
}

// ─── SCORE DIMENSIONS ────────────────────────────────────────────────────────
// Weights: Intent Match 40%, Availability 30%, Budget Fit 20%, Delivery Speed 10%

// ─── NEEDS-BASED INTENT MATCHING ─────────────────────────────────────────────
// Maps situations to the NEEDS they require. Intent match scores products by
// how well they satisfy detected needs — not by category name matching.
const SITUATION_NEEDS = {
  'Outdoor Adventure': ['hydration', 'energy', 'safety', 'power', 'light', 'first-aid', 'protein', 'electrolyte', 'ors', 'flashlight', 'torch', 'battery', 'charge'],
  'Road Trip': ['snacks', 'drinks', 'energy', 'power', 'charge', 'travel', 'coffee'],
  'Movie Night': ['snacks', 'drinks', 'popcorn', 'chips', 'entertainment', 'movie', 'dessert', 'cold'],
  'House Party': ['drinks', 'snacks', 'party', 'cups', 'plates', 'guests', 'celebration', 'balloons'],
  'Guest Arrival': ['hygiene', 'bath', 'towel', 'soap', 'cups', 'plates', 'guest', 'serving'],
  'Study Session': ['study', 'notes', 'writing', 'energy', 'coffee', 'awake', 'stationery', 'exam', 'highlight'],
  'Pet Food Refill': ['pet', 'dog', 'cat', 'food', 'treats', 'bowl', 'dental'],
  'Baby Care': ['baby', 'fever', 'thermometer', 'wipes', 'hygiene', 'ors', 'hydration', 'cotton'],
  'Medicine Run': ['health', 'fever', 'thermometer', 'ors', 'hydration', 'wipes', 'cotton', 'first-aid'],
  'First Aid': ['wound', 'bandage', 'first-aid', 'antiseptic', 'cotton', 'band-aid', 'clean'],
  'Power Cut': ['light', 'flashlight', 'candle', 'battery', 'power', 'charge', 'emergency'],
  'Gym Recovery': ['energy', 'protein', 'hydration', 'ors', 'recovery', 'gym', 'workout', 'milk'],
  'Rainy Day': ['rain', 'umbrella', 'raincoat', 'weather', 'dry', 'comfort'],
  'Snack Run': ['snacks', 'chips', 'popcorn', 'drinks', 'munchies', 'cold', 'juice'],
  'Office Essentials': ['notes', 'writing', 'pen', 'stationery', 'coffee', 'energy', 'work', 'reminder'],
  'Grocery Refill': ['milk', 'bread', 'eggs', 'butter', 'rice', 'food', 'breakfast', 'dairy', 'cooking'],
  'Gifting': ['gift', 'chocolate', 'premium', 'greeting', 'card', 'candle', 'scented', 'plant', 'mug', 'frame', 'pen', 'notebook', 'basket', 'hamper', 'tea', 'coffee', 'luxury', 'diffuser', 'keychain', 'soft-toy', 'dry-fruits', 'celebration', 'decor', 'organizer', 'soap']
};

function calcIntentMatch(cart, situation, intentResult) {
  if (!cart.length) return 0;

  // 1. Get needs for this situation
  const needs = SITUATION_NEEDS[situation] || [];

  // 2. Also gather tokens from the situation name as fallback
  const situationTokens = (situation || '').toLowerCase().split(/[^a-z0-9]+/).filter(t => t.length > 2);

  // 3. Combine: needs (high-quality) + situation tokens (fallback)
  const allNeedTokens = [...new Set([...needs, ...situationTokens])];

  if (allNeedTokens.length === 0) return 28; // neutral when truly unknown

  // 4. Score each product: does it satisfy at least one detected need?
  const matching = cart.filter(p => {
    const productText = `${p.name} ${(p.tags || []).join(' ')} ${p.category || ''} ${p.subcategory || ''}`.toLowerCase();
    return allNeedTokens.some(need => productText.includes(need));
  }).length;

  // 5. Intent score = proportion of cart that matches × 40
  return Math.round((matching / cart.length) * 40);
}

function calcAvailability(cart) {
  if (!cart.length) return 0;
  const available = cart.filter(p => p.inStock !== false).length;
  return Math.round((available / cart.length) * 30);
}

function calcBudgetFit(cart, targetBudget) {
  const total = calculateCartTotal(cart);
  if (!targetBudget || targetBudget <= 0) return 20; // no budget limit = perfect
  if (total <= targetBudget) return 20;
  const overshoot = (total - targetBudget) / targetBudget;
  return Math.max(0, Math.round(20 - overshoot * 20));
}

function calcDeliveryScore(cart) {
  if (!cart.length) return 0;
  const times = cart.map(p => {
    const match = String(p.deliveryTime || '').match(/(\d+)/);
    return match ? Number(match[1]) : 15;
  });
  const avgMins = times.reduce((a, b) => a + b, 0) / times.length;
  // 10 mins avg → 10 pts; 30 mins avg → 5 pts; 60+ mins → 2 pts
  const score = Math.round(10 * Math.min(1, 15 / Math.max(avgMins, 1)));
  return Math.max(2, Math.min(10, score));
}

// ─── MAIN METRICS CALCULATOR ─────────────────────────────────────────────────

export function calculateOptimizationMetrics(cart, intentResult) {
  if (!cart || cart.length === 0) {
    return {
      score: 0,
      scoreBreakdown: {
        intent: { score: 0, max: 40, label: 'Intent Match', reason: 'No products in cart' },
        availability: { score: 0, max: 30, label: 'Availability', reason: 'No products in cart' },
        budget: { score: 0, max: 20, label: 'Budget Fit', reason: 'No products in cart' },
        delivery: { score: 0, max: 10, label: 'Delivery Speed', reason: 'No products in cart' }
      },
      health: 'Needs Improvement',
      explanation: 'Cart is empty.'
    };
  }

  const situation = intentResult?.subjectDetection?.situation || intentResult?.intent?.situation || '';
  const targetBudget = intentResult?.zeroDecision?.packs?.[0]?.targetBudget || 0;

  const intent = calcIntentMatch(cart, situation, intentResult);
  const availability = calcAvailability(cart);
  const budget = calcBudgetFit(cart, targetBudget);
  const delivery = calcDeliveryScore(cart);

  const total = Math.min(100, intent + availability + budget + delivery);

  const avgDelivery = Math.round(
    cart.reduce((sum, p) => {
      const match = String(p.deliveryTime || '').match(/(\d+)/);
      return sum + (match ? Number(match[1]) : 15);
    }, 0) / cart.length
  );

  const subtotal = calculateCartTotal(cart);
  const effectiveCount = getEffectiveItemCount(cart);

  // Percentage representations for display
  const intentPct = Math.round((intent / 40) * 100);
  const availPct = Math.round((availability / 30) * 100);
  const budgetPct = Math.round((budget / 20) * 100);
  const delivPct = Math.round((delivery / 10) * 100);

  return {
    score: total,
    scoreBreakdown: {
      intent: {
        score: intent,
        max: 40,
        label: 'Intent Match',
        percentage: intentPct,
        reason: `${intentPct}% of products satisfy detected needs for "${situation || 'this situation'}"`
      },
      availability: {
        score: availability,
        max: 30,
        label: 'Availability',
        percentage: availPct,
        reason: `${cart.filter(p => p.inStock !== false).length}/${cart.length} items in stock (${availPct}%)`
      },
      budget: {
        score: budget,
        max: 20,
        label: 'Budget Fit',
        percentage: budgetPct,
        reason: targetBudget
          ? `₹${subtotal} vs ₹${targetBudget} target (${budgetPct}% fit)`
          : `No budget constraint (${budgetPct}%)`
      },
      delivery: {
        score: delivery,
        max: 10,
        label: 'Delivery Speed',
        percentage: delivPct,
        reason: `Avg ${avgDelivery} min delivery (${delivPct}%)`
      }
    },
    health: getHealth(total),
    explanation: buildExplanation(total, intent, availability, budget, delivery)
  };
}

function buildExplanation(total, intent, availability, budget, delivery) {
  const parts = [];
  if (intent >= 32) parts.push('high intent match');
  if (availability >= 24) parts.push('strong availability');
  if (budget >= 16) parts.push('within budget');
  if (delivery >= 8) parts.push('fast delivery');

  if (parts.length > 0) {
    return `Cart optimized with ${parts.join(', ')}. Score: ${total}/100.`;
  }
  if (total >= 80) return 'Good cart quality with solid intent match and availability.';
  if (total >= 60) return 'Decent cart quality. Consider replacing items for a better intent match.';
  return 'Cart could be improved — some items may not match the detected situation.';
}

// ─── HEALTH ──────────────────────────────────────────────────────────────────

export function getHealth(score) {
  if (score >= 90) return 'Excellent';
  if (score >= 75) return 'Good';
  if (score >= 60) return 'Fair';
  return 'Needs Improvement';
}

// ─── PACK SCORES ─────────────────────────────────────────────────────────────

export function recalculatePackScores(currentCart, packs, intentResult) {
  if (!packs || packs.length === 0) return [];

  return packs.map(pack => {
    const metrics = calculateOptimizationMetrics(pack.products, intentResult);
    return {
      ...pack,
      optimization_score: metrics.score,
      cart_health: metrics.health,
      score_breakdown: metrics.scoreBreakdown,
      explanation: metrics.explanation
    };
  });
}

// ─── RECOMMENDED PACK ────────────────────────────────────────────────────────

/**
 * Recommend based on: optimization score (60%), value ratio (30%), completeness (10%)
 * Never randomly assign. Never recommend empty packs.
 */
function pickRecommendedPack(packs) {
  if (!packs || packs.length === 0) return null;

  const scored = packs.map(pack => {
    if (!pack.products || pack.products.length === 0) return { pack, score: 0 };
    const valueRatio = pack.optimization_score / Math.max(1, pack.totals?.total / 100);
    const completeness = Math.min(10, pack.products.length * 2);
    return {
      pack,
      score: (pack.optimization_score * 0.6) + (valueRatio * 0.3) + (completeness * 0.1)
    };
  }).sort((a, b) => b.score - a.score);

  return scored[0]?.pack || null;
}

// ─── MISSING ESSENTIALS ──────────────────────────────────────────────────────

const ESSENTIALS_MAP = {
  'Pet Food Refill': [
    { name: 'Dog Treats', reason: 'Complement food refills with rewarding treats.', price: 129 },
    { name: 'Dental Chews', reason: 'Dental hygiene is often overlooked during food refills.', price: 189 }
  ],
  'Movie Night': [
    { name: 'Popcorn Tub', reason: 'A classic movie-night snack.', price: 69 },
    { name: 'Disposable Cups', reason: 'Useful for sharing drinks during movie night.', price: 29 }
  ],
  'Guest Arrival': [
    { name: 'Tissues Box', reason: 'Guests often expect tissues in common areas.', price: 39 },
    { name: 'Soap Bar (Pack of 3)', reason: 'Guest hygiene essential.', price: 75 }
  ],
  'House Party': [
    { name: 'Party Cups (Pack of 25)', reason: 'Essential for serving drinks.', price: 99 },
    { name: 'Paper Plates (Pack of 20)', reason: 'Easy serving and cleanup.', price: 79 }
  ],
  'Baby Care': [
    { name: 'ORS Sachets (Pack of 10)', reason: 'Hydration support for baby.', price: 45 },
    { name: 'Wet Wipes (Pack of 72)', reason: 'Essential baby hygiene.', price: 149 }
  ],
  'Study Session': [
    { name: 'Highlighter Set (5 Colors)', reason: 'Essential for exam revision.', price: 99 },
    { name: 'Sticky Notes (Pack of 3)', reason: 'Quick memory reminders.', price: 69 }
  ],
  'Power Cut': [
    { name: 'Candles (Pack of 6)', reason: 'Backup ambient lighting during outage.', price: 49 },
    { name: 'Power Bank (10000mAh)', reason: 'Phone charging is critical during outages.', price: 799 }
  ],
  'First Aid': [
    { name: 'Antiseptic Liquid (100ml)', reason: 'Wound cleaning is essential for infection prevention.', price: 79 },
    { name: 'Band-Aid Strips (Pack of 20)', reason: 'Wound coverage and protection.', price: 65 }
  ],
  'Rainy Day': [
    { name: 'Umbrella (Compact)', reason: 'Rain protection for commuting.', price: 299 },
    { name: 'Raincoat (Disposable)', reason: 'Extended weather protection.', price: 49 }
  ]
};

export function detectMissingEssentials(cart, situation) {
  if (!situation) return [];
  const essentials = ESSENTIALS_MAP[situation] || [];
  const cartNames = new Set(cart.map(p => p.name.toLowerCase()));
  return essentials.filter(e => !cartNames.has(e.name.toLowerCase()));
}

// ─── FULL REACTIVE RECALCULATION ─────────────────────────────────────────────

export function recalculateCartMetrics(cartProducts, intentResult, selectedPackId) {
  if (!cartProducts || cartProducts.length === 0) {
    return {
      optimization: { score: 0, health: 'Needs Improvement', explanation: 'Cart is empty.', scoreBreakdown: {} },
      packs: intentResult?.zeroDecision?.packs || [],
      recommendedPackId: selectedPackId || null,
      missingEssentials: [],
      totals: { subtotal: 0, deliveryFee: 29, total: 29, itemCount: 0 }
    };
  }

  // Recalculate optimization metrics from current cart
  const optimization = calculateOptimizationMetrics(cartProducts, intentResult);

  // Recalculate pack scores
  const rawPacks = recalculatePackScores(
    cartProducts,
    intentResult?.zeroDecision?.packs || [],
    intentResult
  );

  // Pick recommended pack
  const recommendedPack = pickRecommendedPack(rawPacks);
  const recommendedPackId = recommendedPack?.id || selectedPackId;

  const packs = rawPacks.map(p => ({
    ...p,
    recommended: p.id === recommendedPackId,
    recommendedReason: p.id === recommendedPackId
      ? 'Recommended because it offers the best balance between cost, completeness, and delivery speed.'
      : null
  }));

  // Detect missing essentials based on current cart
  const situation = intentResult?.subjectDetection?.situation || intentResult?.intent?.situation;
  const missingEssentials = detectMissingEssentials(cartProducts, situation);

  const subtotal = calculateCartTotal(cartProducts);
  const effectiveCount = getEffectiveItemCount(cartProducts);

  return {
    optimization,
    packs,
    recommendedPackId,
    missingEssentials,
    totals: {
      subtotal,
      deliveryFee: subtotal > 499 ? 0 : 29,
      total: subtotal + (subtotal > 499 ? 0 : 29),
      itemCount: effectiveCount
    }
  };
}

export default {
  calculateCartTotal,
  getEffectiveItemCount,
  calculateOptimizationMetrics,
  getHealth,
  recalculatePackScores,
  recalculateCartMetrics,
  detectMissingEssentials
};
