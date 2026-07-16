import productCatalog from '../data/productCatalog.js';

/**
 * Matches AI-recommended products with the actual product catalog
 */
export function matchProducts(recommendedProducts, context = {}) {
  const matchedProducts = [];
  const allowedCategories = context.subjectDetection?.allowedCategories || [];

  for (const rec of recommendedProducts) {
    let bestMatch = null;
    let bestScore = 0;

    for (const product of productCatalog) {
      if (!product.inStock) continue;
      if (allowedCategories.length > 0 && !allowedCategories.some(category => product.category.toLowerCase() === category.toLowerCase())) continue;

      const matchingTags = rec.tags.filter(tag => 
        product.tags.includes(tag) || 
        product.name.toLowerCase().includes(tag)
      );
      
      const score = matchingTags.length;
      const nameMatch = product.name.toLowerCase().includes(rec.name.toLowerCase().split(' ')[0]);
      const adjustedScore = nameMatch ? score + 3 : score;

      if (adjustedScore > bestScore) {
        bestScore = adjustedScore;
        bestMatch = product;
      }
    }

    if (bestMatch && !matchedProducts.find(p => p.id === bestMatch.id)) {
      matchedProducts.push({
        ...bestMatch,
        reason: rec.reason,
        priority: rec.priority,
        matchScore: bestScore,
        matchedCategory: bestMatch.category
      });
    }
  }

  matchedProducts.sort((a, b) => a.priority - b.priority);
  return matchedProducts;
}

/**
 * Calculate cart totals
 */
export function calculateCartTotal(products) {
  const subtotal = products.reduce((sum, p) => sum + p.price, 0);
  const deliveryFee = subtotal > 499 ? 0 : 29;
  const total = subtotal + deliveryFee;

  return {
    subtotal,
    deliveryFee,
    total,
    freeDeliveryThreshold: 499,
    itemCount: products.length,
    estimatedDelivery: '10-15 mins'
  };
}

/**
 * Get all products by category
 */
export function getProductsByCategory(category) {
  return productCatalog.filter(p => 
    p.category.toLowerCase() === category.toLowerCase()
  );
}

/**
 * Search products by query
 */
export function searchProducts(query) {
  const terms = query.toLowerCase().split(' ');
  return productCatalog.filter(product => {
    const searchStr = `${product.name} ${product.category} ${product.tags.join(' ')}`.toLowerCase();
    return terms.some(term => searchStr.includes(term));
  });
}

export default { matchProducts, calculateCartTotal, getProductsByCategory, searchProducts };
