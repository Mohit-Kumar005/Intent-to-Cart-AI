/**
 * Dynamic Scoring Engine
 * Calculates optimization scores based on actual cart state
 * 40: Availability, 30: Delivery, 20: Budget, 10: Intent Match
 */

function calculateAvailabilityScore(products) {
  if (products.length === 0) return 0;
  const availableCount = products.filter(p => p.inStock).length;
  return Math.round((availableCount / products.length) * 40);
}

function calculateDeliveryScore(products, requiredMinutes) {
  if (products.length === 0) return 0;
  if (!requiredMinutes || requiredMinutes === 0) return 30;

  const avgDeliveryMinutes = products.reduce((sum, p) => {
    const match = String(p.deliveryTime || '').match(/(\d+)/);
    return sum + (match ? Number(match[1]) : 999);
  }, 0) / products.length;

  const meetsUrgency = avgDeliveryMinutes <= requiredMinutes;
  const scorePercentage = meetsUrgency ? 1 : Math.max(0, (requiredMinutes / avgDeliveryMinutes) * 0.8);
  return Math.round(scorePercentage * 30);
}

function calculateBudgetFitScore(total, targetBudget) {
  if (targetBudget === 0) return 20;
  if (total <= targetBudget) return 20;
  
  const overBudgetRatio = total / targetBudget;
  const penalizedScore = Math.max(0, 20 - ((overBudgetRatio - 1) * 10));
  return Math.round(penalizedScore);
}

function calculateIntentMatchScore(products, intentTokens) {
  if (products.length === 0 || intentTokens.length === 0) return 10;

  const matchingProducts = products.filter(p => {
    const productText = `${p.name} ${p.tags.join(' ')}`.toLowerCase();
    return intentTokens.some(token => productText.includes(token));
  });

  const matchPercentage = matchingProducts.length / products.length;
  return Math.round(matchPercentage * 10);
}

export function calculateOptimizationScore(cart, context = {}) {
  const {
    targetBudget = 0,
    requiredMinutes = 45,
    intentTokens = []
  } = context;

  const availability = calculateAvailabilityScore(cart);
  const delivery = calculateDeliveryScore(cart, requiredMinutes);
  const budget = calculateBudgetFitScore(cart.reduce((sum, p) => sum + p.price, 0), targetBudget);
  const intent = calculateIntentMatchScore(cart, intentTokens);

  const total = availability + delivery + budget + intent;

  return {
    total: Math.min(100, Math.max(0, total)),
    breakdown: {
      availability: { score: availability, label: 'Availability', reason: `${Math.round((availability / 40) * 100)}% of items in stock` },
      delivery: { score: delivery, label: 'Delivery Speed', reason: `Meets urgency: ${delivery >= 24 ? 'Yes' : 'No'}` },
      budget: { score: budget, label: 'Budget Fit', reason: `Within target budget` },
      intent: { score: intent, label: 'Intent Match', reason: `${Math.round((intent / 10) * 100)}% item relevance` }
    }
  };
}

export function getCartHealth(score) {
  if (score >= 95) return { status: 'Excellent', color: 'text-green-700', bg: 'bg-green-50' };
  if (score >= 80) return { status: 'Good', color: 'text-blue-700', bg: 'bg-blue-50' };
  if (score >= 60) return { status: 'Fair', color: 'text-yellow-700', bg: 'bg-yellow-50' };
  return { status: 'Needs Improvement', color: 'text-orange-700', bg: 'bg-orange-50' };
}

export default { calculateOptimizationScore, getCartHealth };
