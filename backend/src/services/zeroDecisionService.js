import productCatalog from '../data/productCatalog.js';
import scenarioCatalog from '../data/zeroDecisionPacks.js';
import { optimizeCart } from './optimizationService.js';

function normalizeText(value) {
  return String(value || '').toLowerCase().trim();
}

// ─── SCENARIO SELECTION ──────────────────────────────────────────────────────

/**
 * Maps situation/subject from classificationService to the correct scenario key.
 * Subject-detection-first approach: if subject is Pet, use pet_food_refill.
 */
const SITUATION_TO_SCENARIO = {
  'Pet Food Refill': 'pet_food_refill',
  'Study Session': 'exam_tomorrow',
  'House Party': 'house_party',
  'Movie Night': 'movie_night',
  'Snack Run': 'snack_run',
  'Rainy Day': 'rainy_day',
  'Baby Care': 'baby_care',
  'Medicine Run': 'medicine_run',
  'First Aid': 'first_aid',
  'Power Cut': 'power_cut',
  'Gym Recovery': 'gym_recovery',
  'Outdoor Adventure': 'outdoor_adventure',
  'Road Trip': 'road_trip',
  'Guest Arrival': 'guest_arrival',
  'Office Essentials': 'office_essentials',
  'Grocery Refill': 'grocery_refill',
  'Gifting': 'gifting'
};

function getScenario(intentResult, userInput) {
  // 0. Highest priority: scenario key supplied directly by the classifier topic.
  const topicKey = intentResult?.subjectDetection?.topics?.[0]?.scenarioKey;
  if (topicKey && scenarioCatalog[topicKey]) {
    return { key: topicKey, ...scenarioCatalog[topicKey] };
  }

  // 1. Use subject detection situation → scenario map.
  const detectedSituation = intentResult?.subjectDetection?.situation
    || intentResult?.intent?.situation
    || '';

  const mappedKey = SITUATION_TO_SCENARIO[detectedSituation];
  if (mappedKey && scenarioCatalog[mappedKey]) {
    return { key: mappedKey, ...scenarioCatalog[mappedKey] };
  }

  // 2. Fallback: keyword scan against intent signals + user input
  const text = normalizeText([
    userInput,
    intentResult?.intent?.type,
    intentResult?.intent?.subject,
    intentResult?.intent?.situation,
    intentResult?.cart?.name,
    intentResult?.reasoning,
    intentResult?.subjectDetection?.situation
  ].filter(Boolean).join(' '));

  const scoredScenarios = Object.entries(scenarioCatalog)
    .filter(([key]) => key !== 'default')
    .map(([key, scenario]) => ({
      key,
      scenario,
      score: scenario.keywords.reduce((sum, kw) => sum + (text.includes(kw) ? (kw.split(' ').length >= 2 ? 3 : 1) : 0), 0)
    }))
    .sort((a, b) => b.score - a.score);

  if (scoredScenarios[0]?.score > 0) {
    const best = scoredScenarios[0];
    return { key: best.key, ...best.scenario };
  }

  return { key: 'default', ...scenarioCatalog.default };
}

// ─── PRODUCT SELECTION ───────────────────────────────────────────────────────

function collectContext(intentResult, userInput) {
  const tokens = normalizeText([
    userInput,
    intentResult?.intent?.type,
    intentResult?.intent?.subject,
    intentResult?.intent?.situation,
    intentResult?.cart?.name,
    intentResult?.reasoning,
    intentResult?.subjectDetection?.situation
  ].filter(Boolean).join(' ')).split(/[^a-z0-9]+/).filter(t => t.length > 1);

  const urgency = normalizeText(intentResult?.intent?.urgency);
  const requiredMinutes = urgency === 'critical' ? 20 : urgency === 'high' ? 30 : 45;

  return { tokens, requiredMinutes };
}

function scoreCandidate(product, context) {
  const searchable = normalizeText([
    product.name, product.category, product.subcategory, ...(product.tags || [])
  ].join(' '));

  let score = 0;
  for (const token of context.tokens) {
    if (token.length > 2 && searchable.includes(token)) score += 10;
  }

  if (context.tier === 'Budget') score += Math.max(0, 200 - product.price);
  if (context.tier === 'Standard') score += Math.max(0, 150 - Math.abs(product.price - 150));
  if (context.tier === 'Premium') score += product.price * 0.5;

  const deliveryMatch = String(product.deliveryTime || '').match(/(\d+)/);
  const deliveryMinutes = deliveryMatch ? Number(deliveryMatch[1]) : 30;
  score += Math.max(0, context.requiredMinutes - deliveryMinutes) * 3;

  return score;
}

function findBestProduct(itemSearch, tokenHint, allowedCategories, context, excludeIds) {
  const searchNorm = normalizeText(itemSearch);
  const tokenNorm = normalizeText(tokenHint);

  const candidates = productCatalog.filter(product => {
    if (excludeIds.has(product.id)) return false;
    if (!product.inStock) return false;

    // Strict category validation
    if (allowedCategories.length > 0) {
      const inAllowed = allowedCategories.some(cat =>
        normalizeText(product.category) === normalizeText(cat) ||
        normalizeText(product.subcategory) === normalizeText(cat)
      );
      if (!inAllowed) return false;
    }

    const searchable = normalizeText([
      product.name, product.category, product.subcategory, ...(product.tags || [])
    ].join(' '));

    return searchable.includes(searchNorm) ||
           searchable.includes(tokenNorm) ||
           (product.tags || []).some(tag => normalizeText(tag).includes(tokenNorm));
  });

  if (candidates.length === 0) return null;

  candidates.sort((a, b) => scoreCandidate(b, context) - scoreCandidate(a, context));
  return candidates[0];
}

function buildPackProducts(packDefinition, scenarioAllowedCategories, intentResult, userInput) {
  const context = {
    ...collectContext(intentResult, userInput),
    tier: packDefinition.tier,
    allowedCategories: packDefinition.allowedCategories || scenarioAllowedCategories || []
  };

  const selectedIds = new Set();
  const products = [];

  for (const [searchText, tokenHint] of packDefinition.items) {
    const best = findBestProduct(
      searchText, tokenHint,
      packDefinition.allowedCategories || scenarioAllowedCategories || [],
      context, selectedIds
    );
    if (best) {
      selectedIds.add(best.id);
      products.push(best);
    }
  }

  const optimized = optimizeCart(intentResult, products, {
    userInput,
    packBudget: packDefinition.targetBudget
  });

  return optimized;
}

// ─── PRICE TIER ENFORCEMENT ──────────────────────────────────────────────────

/**
 * Ensures Budget < Standard < Premium price ordering.
 * If Premium costs less than Standard (due to product availability),
 * we boost the Premium pack by adding an extra item from the catalog.
 */
function enforcePackPriceOrdering(packs, scenario) {
  const tierOrder = ['Budget', 'Standard', 'Premium'];
  const sorted = tierOrder.map(tier => packs.find(p => p.tier === tier)).filter(Boolean);

  if (sorted.length < 2) return packs;

  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const curr = sorted[i];

    if (curr.totals.subtotal <= prev.totals.subtotal) {
      // Try to add a relevant extra product to bump cost
      const currCategories = curr.allowedCategories || scenario.allowedCategories || [];
      const addableProducts = productCatalog.filter(p =>
        p.inStock &&
        currCategories.some(cat => normalizeText(p.category) === normalizeText(cat)) &&
        !curr.products.some(existing => existing.id === p.id)
      ).sort((a, b) => b.price - a.price);

      if (addableProducts.length > 0) {
        const extra = addableProducts[0];
        curr.products = [...curr.products, extra];
        const newSubtotal = curr.products.reduce((sum, p) => sum + p.price, 0);
        curr.totals = {
          subtotal: newSubtotal,
          deliveryFee: newSubtotal > 499 ? 0 : 29,
          total: newSubtotal > 499 ? newSubtotal : newSubtotal + 29,
          itemCount: curr.products.length
        };
      }
    }
  }

  return packs;
}

// ─── RECOMMENDATION LOGIC ────────────────────────────────────────────────────

/**
 * Determine recommended pack based on:
 * 1. Optimization score (primary)
 * 2. Value (score / price ratio)
 * 3. Completeness (item count relative to tier)
 */
function determineRecommendedPack(packs) {
  if (!packs || packs.length === 0) return null;

  const scored = packs.map(pack => {
    const valueScore = pack.optimization_score / Math.max(1, pack.totals.total / 100);
    const completenessScore = Math.min(10, pack.products.length * 2);
    const finalScore = (pack.optimization_score * 0.6) + (valueScore * 0.3) + (completenessScore * 0.1);
    return { pack, finalScore };
  }).sort((a, b) => b.finalScore - a.finalScore);

  return scored[0]?.pack || packs[1] || packs[0]; // default to Standard if available
}

// ─── MAIN ENGINE ─────────────────────────────────────────────────────────────

export function generateZeroDecisionEngine(intentResult, userInput = '') {
  // Multi-intent → generate a single combined cart drawing from each topic.
  const topics = intentResult?.subjectDetection?.topics;
  if (Array.isArray(topics) && topics.length >= 2) {
    return generateCombinedZeroDecision(topics, intentResult, userInput);
  }

  const scenario = getScenario(intentResult, userInput);
  const packDefinitions = padPackDefinitions(scenario.packs.slice(0, 3), scenario.key);
  const { packs, recommendedPackId } = assemblePacks(scenario, packDefinitions, intentResult, userInput);

  return {
    scenario: {
      key: scenario.key,
      label: scenario.label,
      missionName: scenario.missionName,
      prompt: scenario.prompt
    },
    packs,
    recommended_pack_id: recommendedPackId,
    primary_pack_id: recommendedPackId,
    explanation: `Generated 3 zero-decision packs for ${scenario.missionName}.`
  };
}

/**
 * Combined (multi-intent) pack generation.
 * For each tier, merge the item lists from every detected topic's scenario so a
 * single pack contains products from all detected categories (e.g. Snacks +
 * Medicine). Category validation is the union of all topic categories.
 */
function generateCombinedZeroDecision(topics, intentResult, userInput = '') {
  const scenarios = topics
    .map(t => (scenarioCatalog[t.scenarioKey] ? { key: t.scenarioKey, ...scenarioCatalog[t.scenarioKey] } : null))
    .filter(Boolean);

  if (scenarios.length < 2) {
    // Degrade gracefully to single-scenario generation.
    const single = scenarios[0] || { key: 'default', ...scenarioCatalog.default };
    const defs = padPackDefinitions(single.packs.slice(0, 3), single.key);
    const { packs, recommendedPackId } = assemblePacks(single, defs, intentResult, userInput);
    return {
      scenario: { key: single.key, label: single.label, missionName: single.missionName, prompt: single.prompt },
      packs,
      recommended_pack_id: recommendedPackId,
      primary_pack_id: recommendedPackId,
      explanation: `Generated 3 zero-decision packs for ${single.missionName}.`
    };
  }

  const unionCategories = [...new Set(scenarios.flatMap(s => s.allowedCategories || []))];
  const missionName = scenarios.map(s => s.missionName).join(' + ');
  const label = scenarios.map(s => s.label).join(' & ');

  const combinedScenario = {
    key: 'combined',
    label,
    missionName,
    allowedCategories: unionCategories,
    prompt: `Combined pack covering ${label}.`,
    missingEssentials: []
  };

  const TIERS = ['Budget', 'Standard', 'Premium'];
  const combinedDefinitions = TIERS.map(tier => {
    const mergedItems = [];
    let targetBudget = 0;
    for (const scenario of scenarios) {
      const tierPack = scenario.packs.find(p => p.tier === tier) || scenario.packs[0];
      if (tierPack) {
        mergedItems.push(...tierPack.items);
        targetBudget += tierPack.targetBudget || 0;
      }
    }
    return {
      id: `combined-${tier.toLowerCase()}`,
      title: `${tier} Pack`,
      subtitle: `${label} essentials`,
      tier,
      targetBudget: targetBudget || (tier === 'Budget' ? 499 : tier === 'Standard' ? 799 : 1199),
      allowedCategories: unionCategories,
      items: mergedItems
    };
  });

  const { packs, recommendedPackId } = assemblePacks(combinedScenario, combinedDefinitions, intentResult, userInput);

  return {
    scenario: {
      key: combinedScenario.key,
      label: combinedScenario.label,
      missionName: combinedScenario.missionName,
      prompt: combinedScenario.prompt
    },
    packs,
    recommended_pack_id: recommendedPackId,
    primary_pack_id: recommendedPackId,
    explanation: `Generated 3 combined packs covering ${label}.`
  };
}

/**
 * Ensures exactly 3 pack definitions in Budget/Standard/Premium order.
 */
function padPackDefinitions(definitions, scenarioKey) {
  const packDefinitions = [...definitions];
  while (packDefinitions.length < 3) {
    const tier = packDefinitions.length === 0 ? 'Budget'
               : packDefinitions.length === 1 ? 'Standard'
               : 'Premium';
    const baseTargetBudget = tier === 'Budget' ? 399 : tier === 'Standard' ? 699 : 1199;
    const template = definitions[0] || { items: [], allowedCategories: [] };
    packDefinitions.push({
      ...template,
      id: `${scenarioKey}-${tier.toLowerCase()}`,
      title: `${tier} Pack`,
      tier,
      targetBudget: baseTargetBudget
    });
  }
  return packDefinitions;
}

/**
 * Builds pack objects from definitions, enforces price ordering, and flags the
 * recommended pack. Shared by single-intent and combined generation.
 */
function assemblePacks(scenario, packDefinitions, intentResult, userInput) {
  let packs = packDefinitions.map(packDefinition => {
    const optimized = buildPackProducts(packDefinition, scenario.allowedCategories, intentResult, userInput);
    const total = optimized.optimized_cart.reduce((sum, p) => sum + p.price, 0);

    // Task 4: Dynamic pack names based on situation
    const dynamicTitle = getDynamicPackTitle(scenario.key, packDefinition.tier) || packDefinition.title;

    return {
      id: packDefinition.id,
      scenarioKey: scenario.key,
      missionName: scenario.missionName,
      allowedCategories: packDefinition.allowedCategories || scenario.allowedCategories || [],
      title: dynamicTitle,
      subtitle: packDefinition.subtitle,
      tier: packDefinition.tier,
      targetBudget: packDefinition.targetBudget,
      products: optimized.optimized_cart,
      original_products: optimized.original_cart,
      changes_made: optimized.changes_made,
      optimization_score: optimized.optimization_score,
      score_breakdown: optimized.score_breakdown,
      cart_health: optimized.cart_health,
      explanation: buildPackExplanation(packDefinition.tier, scenario.missionName, total),
      missing_essentials: scenario.missingEssentials || [],
      totals: {
        subtotal: total,
        deliveryFee: total > 499 ? 0 : 29,
        total: total > 499 ? total : total + 29,
        itemCount: optimized.optimized_cart.length
      }
    };
  });

  packs = enforcePackPriceOrdering(packs, scenario);

  const recommendedPack = determineRecommendedPack(packs);
  const recommendedPackId = recommendedPack?.id || packs[1]?.id || packs[0]?.id;

  packs = packs.map(p => ({
    ...p,
    recommended: p.id === recommendedPackId,
    recommendedReason: p.id === recommendedPackId
      ? 'Recommended because it offers the best balance between cost, completeness, and delivery speed.'
      : null
  }));

  return { packs, recommendedPackId };
}

// ─── TASK 4: DYNAMIC PACK NAMES ─────────────────────────────────────────────
// Situation-specific pack titles that adapt to the detected scenario.
const DYNAMIC_PACK_NAMES = {
  movie_night: { Budget: 'Movie Night Starter', Standard: 'Movie Night Complete', Premium: 'Movie Night Ultimate' },
  snack_run: { Budget: 'Quick Snack Fix', Standard: 'Snack Combo Pack', Premium: 'Snack Party Bundle' },
  house_party: { Budget: 'Party Starter', Standard: 'Party Ready Pack', Premium: 'Ultimate Party Bundle' },
  exam_tomorrow: { Budget: 'Focus Essentials', Standard: 'Study Success Kit', Premium: 'Productivity Bundle' },
  first_aid: { Budget: 'Basic Wound Care', Standard: 'Complete First Aid', Premium: 'Emergency Response Kit' },
  medicine_run: { Budget: 'Health Basics', Standard: 'Wellness Essentials', Premium: 'Complete Health Kit' },
  baby_care: { Budget: 'Baby Basics', Standard: 'Baby Care Essentials', Premium: 'Complete Baby Kit' },
  pet_food_refill: { Budget: 'Pet Food Basics', Standard: 'Pet Care Bundle', Premium: 'Complete Pet Pack' },
  power_cut: { Budget: 'Emergency Basics', Standard: 'Power Outage Kit', Premium: 'Full Emergency Pack' },
  rainy_day: { Budget: 'Rain Essentials', Standard: 'Rainy Day Comfort', Premium: 'Full Weather Shield' },
  gym_recovery: { Budget: 'Quick Recovery', Standard: 'Recovery Recharge', Premium: 'Complete Recovery Bundle' },
  outdoor_adventure: { Budget: 'Trail Basics', Standard: 'Adventure Ready Kit', Premium: 'Complete Outdoor Pack' },
  gifting: { Budget: 'Budget Gift Box', Standard: 'Standard Gift Hamper', Premium: 'Premium Celebration Box' },
  road_trip: { Budget: 'Travel Starter', Standard: 'Road Trip Ready', Premium: 'Ultimate Road Trip Pack' },
  guest_arrival: { Budget: 'Guest Basics', Standard: 'Welcome Pack', Premium: 'Premium Hosting Bundle' },
  office_essentials: { Budget: 'Office Basics', Standard: 'Productivity Pack', Premium: 'Executive Essentials' },
  grocery_refill: { Budget: 'Kitchen Basics', Standard: 'Weekly Staples', Premium: 'Full Pantry Restock' }
};

function getDynamicPackTitle(scenarioKey, tier) {
  const names = DYNAMIC_PACK_NAMES[scenarioKey];
  return names?.[tier] || null;
}

function buildPackExplanation(tier, missionName, total) {
  if (tier === 'Budget') return `Essential items for ${missionName} at minimal cost (₹${total}).`;
  if (tier === 'Standard') return `Balanced bundle for ${missionName} with good value at ₹${total}.`;
  return `Complete ${missionName} bundle with all essentials and extras at ₹${total}.`;
}

export default { generateZeroDecisionEngine };
