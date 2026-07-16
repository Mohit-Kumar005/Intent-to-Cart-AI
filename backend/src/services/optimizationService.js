import productCatalog from '../data/productCatalog.js';
import { mockInventory, mockDeliveryProfiles, replacementIntentGroups } from '../data/optimizationMockData.js';

const MIN_SCORE = 0;
const MAX_SCORE = 100;

function normalizeText(value) {
  return String(value || '').toLowerCase();
}

function getMinutesFromDelivery(value) {
  if (typeof value === 'number') return value;
  const match = String(value).match(/(\d+)/g);
  if (!match || match.length === 0) return 999;
  return Number(match[0]);
}

function getOrderBudget(intentResult) {
  const candidates = [
    intentResult?.budget,
    intentResult?.budget_amount,
    intentResult?.constraints?.budget,
    intentResult?.constraints?.budgetAmount,
    intentResult?.cart?.budget
  ];

  for (const candidate of candidates) {
    const parsed = Number(candidate);
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
  }

  return null;
}

function getBudgetFromText(userInput) {
  if (!userInput) return null;

  const text = String(userInput).toLowerCase();
  const budgetMatch = text.match(/(?:budget|under|within|max(?:imum)?|up to)\s*(?:rs\.?|inr|₹)?\s*(\d{2,6})/i);
  if (budgetMatch?.[1]) {
    return Number(budgetMatch[1]);
  }

  const rupeeMatch = text.match(/₹\s*(\d{2,6})/);
  if (rupeeMatch?.[1]) {
    return Number(rupeeMatch[1]);
  }

  return null;
}

function getRequiredMinutes(intentResult) {
  const estimatedNeedTime = String(intentResult?.cart?.estimatedNeedTime || intentResult?.estimated_need_time || '').toLowerCase();
  const intentType = String(intentResult?.intent?.type || '').toLowerCase();
  const urgency = String(intentResult?.intent?.urgency || '').toLowerCase();

  if (estimatedNeedTime.includes('immediately')) return 20;
  if (estimatedNeedTime.includes('within 15')) return 15;
  if (estimatedNeedTime.includes('within 20')) return 20;
  if (estimatedNeedTime.includes('within 30')) return 30;
  if (estimatedNeedTime.includes('today')) return 180;
  if (urgency === 'critical') return 20;
  if (urgency === 'high') return 30;
  if (intentType === 'food') return 20;
  return 45;
}

function getProductById(productId) {
  return productCatalog.find(product => product.id === productId) || null;
}

function getProductStockState(product) {
  const inventory = mockInventory[product.id];
  return inventory ? inventory.inStock : product.inStock !== false;
}

function getProductDeliveryMinutes(product) {
  if (mockDeliveryProfiles[product.id]) return mockDeliveryProfiles[product.id];
  return getMinutesFromDelivery(product.deliveryTime);
}

function isSameCategory(originalProduct, candidateProduct) {
  return normalizeText(originalProduct.category) === normalizeText(candidateProduct.category);
}

function getIntentKeywords(intentResult) {
  const words = new Set();

  const addText = (value) => {
    if (!value) return;
    String(value).toLowerCase().split(/[^a-z0-9]+/).filter(Boolean).forEach(word => words.add(word));
  };

  addText(intentResult?.intent?.type);
  addText(intentResult?.intent?.subject);
  addText(intentResult?.intent?.situation);
  addText(intentResult?.cart?.name);
  addText(intentResult?.reasoning);

  for (const product of intentResult?.cart?.products || []) {
    addText(product.name);
    addText(product.reason);
    for (const tag of product.tags || []) addText(tag);
  }

  return [...words];
}

function scoreProductForIntent(product, intentResult, requiredMinutes) {
  const keywords = getIntentKeywords(intentResult);
  const productText = `${product.name} ${product.category} ${product.subcategory} ${(product.tags || []).join(' ')}`.toLowerCase();
  let intentMatch = 0;

  for (const keyword of keywords) {
    if (keyword.length < 3) continue;
    if (productText.includes(keyword)) intentMatch += 8;
  }

  const deliveryMinutes = getProductDeliveryMinutes(product);
  const deliveryBonus = Math.max(0, 30 - deliveryMinutes);
  const urgencyBonus = Math.max(0, requiredMinutes - deliveryMinutes) * 2;

  return intentMatch + deliveryBonus + urgencyBonus;
}

function findReplacement(originalProduct, intentResult, requiredMinutes, maxPrice) {
  const originalTags = (originalProduct.tags || []).map(tag => String(tag).toLowerCase());
  const originalName = originalProduct.name.toLowerCase();
  const intentKeywords = getIntentKeywords(intentResult);

  const candidateIds = new Set();
  for (const group of replacementIntentGroups) {
    if (group.keywords.some(keyword => intentKeywords.some(word => word.includes(keyword) || keyword.includes(word)))) {
      group.alternates.forEach(id => candidateIds.add(id));
    }
  }

  productCatalog.forEach(product => {
    if (product.id === originalProduct.id) return;
    const searchableText = `${product.name} ${product.category} ${product.subcategory} ${(product.tags || []).join(' ')}`.toLowerCase();
    const overlaps = originalTags.some(tag => searchableText.includes(tag));
    const similarName = originalName.split(' ').some(word => word.length > 3 && searchableText.includes(word));
    if (overlaps || similarName || candidateIds.has(product.id)) {
      if (getProductStockState(product)) candidateIds.add(product.id);
    }
  });

  const candidates = [...candidateIds]
    .map(getProductById)
    .filter(Boolean)
    .filter(product => isSameCategory(originalProduct, product))
    .filter(product => product.inStock !== false || getProductStockState(product))
    .filter(product => getProductDeliveryMinutes(product) <= requiredMinutes)
    .filter(product => maxPrice === null || product.price <= maxPrice);

  if (candidates.length === 0) {
    return null;
  }

  candidates.sort((a, b) => {
    const aScore = scoreProductForIntent(a, intentResult, requiredMinutes);
    const bScore = scoreProductForIntent(b, intentResult, requiredMinutes);
    return bScore - aScore || a.price - b.price;
  });

  const replacement = candidates[0];
  return {
    ...replacement,
    optimizedFrom: originalProduct.id,
    optimizedReason: `Replaced ${originalProduct.name} with ${replacement.name} because it is available and fits the delivery window.`
  };
}

function optimizeBudget(products, budget, intentResult, requiredMinutes) {
  if (!budget) return { products, changes: [], budgetRemaining: null };

  let runningTotal = products.reduce((sum, product) => sum + product.price, 0);
  const optimized = [...products];
  const changes = [];

  if (runningTotal <= budget) {
    return { products: optimized, changes, budgetRemaining: budget - runningTotal };
  }

  const sortedIndexes = optimized
    .map((product, index) => ({ product, index }))
    .sort((a, b) => b.product.price - a.product.price);

  for (const item of sortedIndexes) {
    if (runningTotal <= budget) break;

    const cheaperCandidates = productCatalog
      .filter(candidate => candidate.price < item.product.price)
      .filter(candidate => isSameCategory(item.product, candidate))
      .filter(candidate => getProductStockState(candidate))
      .filter(candidate => getProductDeliveryMinutes(candidate) <= requiredMinutes || requiredMinutes > 30)
      .filter(candidate => {
        const text = `${candidate.name} ${candidate.category} ${candidate.subcategory} ${(candidate.tags || []).join(' ')}`.toLowerCase();
        const originalText = `${item.product.name} ${item.product.category} ${item.product.subcategory} ${(item.product.tags || []).join(' ')}`.toLowerCase();
        const sharedTags = (item.product.tags || []).some(tag => text.includes(String(tag).toLowerCase()));
        return sharedTags || originalText.split(' ').some(word => word.length > 3 && text.includes(word));
      })
      .sort((a, b) => scoreProductForIntent(b, intentResult, requiredMinutes) - scoreProductForIntent(a, intentResult, requiredMinutes) || a.price - b.price);

    const betterCandidate = cheaperCandidates.find(candidate => runningTotal - item.product.price + candidate.price <= budget) || cheaperCandidates[0];

    if (betterCandidate && betterCandidate.id !== item.product.id) {
      const oldProduct = optimized[item.index];
      optimized[item.index] = {
        ...betterCandidate,
        optimizedFrom: oldProduct.id,
        optimizedReason: `Replaced ${oldProduct.name} with ${betterCandidate.name} to stay within the budget while preserving intent.`
      };
      runningTotal = runningTotal - oldProduct.price + betterCandidate.price;
      changes.push({
        type: 'budget',
        from: oldProduct,
        to: optimized[item.index],
        reason: optimized[item.index].optimizedReason
      });
    } else if (runningTotal > budget) {
      changes.push({
        type: 'budget',
        from: item.product,
        to: null,
        reason: `No suitable alternative available for ${item.product.name}.`
      });
    }
  }

  return {
    products: optimized,
    changes,
    budgetRemaining: Math.max(0, budget - runningTotal)
  };
}

function buildOptimizationScore({ intentMatchScore, availabilityScore, deliveryScore, budgetScore }) {
  const total = availabilityScore + deliveryScore + budgetScore + intentMatchScore;
  return Math.max(MIN_SCORE, Math.min(MAX_SCORE, Math.round(total)));
}

function getCartHealth(score) {
  if (score >= 95) return 'Excellent';
  if (score >= 80) return 'Good';
  if (score >= 60) return 'Fair';
  return 'Needs Improvement';
}

export function optimizeCart(intentResult, originalProducts = [], context = {}) {
  const original_cart = originalProducts.map(product => ({ ...product }));
  const requiredMinutes = getRequiredMinutes(intentResult);
  const budget = context.packBudget ?? getOrderBudget(intentResult) ?? getBudgetFromText(context.userInput);

  let changes_made = [];
  const availabilityAdjusted = [];

  for (const product of originalProducts) {
    const isAvailable = getProductStockState(product);
    const deliveryMinutes = getProductDeliveryMinutes(product);
    const withinTime = deliveryMinutes <= requiredMinutes;

    if (isAvailable && withinTime) {
      availabilityAdjusted.push({ ...product, deliveryMinutes });
      continue;
    }

    const replacement = findReplacement(product, intentResult, requiredMinutes, budget ? budget - availabilityAdjusted.reduce((sum, item) => sum + item.price, 0) : null);
    if (replacement) {
      const replacementDelivery = getProductDeliveryMinutes(replacement);
      availabilityAdjusted.push({ ...replacement, deliveryMinutes: replacementDelivery });
      changes_made.push({
        type: !isAvailable ? 'availability' : 'delivery',
        from: product,
        to: replacement,
        reason: replacement.optimizedReason || `Replaced ${product.name} with ${replacement.name} to satisfy optimization rules.`
      });
    } else {
      availabilityAdjusted.push({ ...product, deliveryMinutes });
    }
  }

  const budgetOptimized = optimizeBudget(availabilityAdjusted, budget, intentResult, requiredMinutes);
  changes_made = [...changes_made, ...budgetOptimized.changes];

  const optimized_cart = budgetOptimized.products.map(product => ({
    ...product,
    deliveryTime: product.deliveryTime || `${product.deliveryMinutes || getProductDeliveryMinutes(product)} mins`
  }));

  const itemCount = Math.max(1, optimized_cart.length);
  const inStockCount = optimized_cart.filter(product => getProductStockState(product)).length;
  const onTimeCount = optimized_cart.filter(product => getProductDeliveryMinutes(product) <= requiredMinutes).length;
  const totalPrice = optimized_cart.reduce((sum, product) => sum + product.price, 0);
  const intentAggregate = optimized_cart.reduce((sum, product) => sum + scoreProductForIntent(product, intentResult, requiredMinutes), 0);

  const availabilityRaw = Math.round((inStockCount / itemCount) * 100);
  const deliveryRaw = Math.round((onTimeCount / itemCount) * 100);
  const budgetRaw = budget ? Math.max(0, Math.round(((budget - totalPrice) / Math.max(budget, totalPrice)) * 100)) : 100;
  const intentRaw = Math.round((intentAggregate / Math.max(1, itemCount * 40)) * 100);

  const availabilityScore = Math.round((availabilityRaw / 100) * 40);
  const deliveryScore = Math.round((deliveryRaw / 100) * 30);
  const budgetScore = Math.round((Math.min(100, budgetRaw) / 100) * 20);
  const intentMatchScore = Math.round((Math.min(100, intentRaw) / 100) * 10);

  const optimization_score = buildOptimizationScore({
    intentMatchScore,
    availabilityScore,
    deliveryScore,
    budgetScore
  });

  const score_breakdown = {
    availability: {
      score: availabilityScore,
      max: 40,
      explanation: `${inStockCount}/${itemCount} items available in inventory.`
    },
    delivery: {
      score: deliveryScore,
      max: 30,
      explanation: `${onTimeCount}/${itemCount} items can be delivered within the urgency window.`
    },
    budget: {
      score: budgetScore,
      max: 20,
      explanation: budget ? `Pack total is ₹${totalPrice}${totalPrice <= budget ? ` within the ₹${budget} budget.` : `, above the ₹${budget} budget.`}` : 'No budget limit provided.'
    },
    intent: {
      score: intentMatchScore,
      max: 10,
      explanation: 'Items match the detected shopping intent and subject.'
    }
  };

  const explanationParts = [];
  if (changes_made.some(change => change.type === 'availability')) explanationParts.push('availability issues were resolved');
  if (changes_made.some(change => change.type === 'delivery')) explanationParts.push('delivery speed was improved');
  if (changes_made.some(change => change.type === 'budget')) explanationParts.push('budget fit was improved');

  return {
    original_cart,
    optimized_cart,
    changes_made,
    optimization_score,
    score_breakdown,
    cart_health: getCartHealth(optimization_score),
    explanation: explanationParts.length > 0
      ? `Cart optimized because ${explanationParts.join(', ')} while preserving the original intent.`
      : 'Cart optimized for urgency, availability, and budget.'
  };
}

export default { optimizeCart };