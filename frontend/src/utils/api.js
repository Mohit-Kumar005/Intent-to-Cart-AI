const API_BASE = import.meta.env.VITE_API_URL || '/api';

/**
 * Analyzes user intent and returns a complete cart result in one call.
 * Returns: { success, needsClarification, data }
 */
export async function analyzeIntent(input, { skipClarification = false } = {}) {
  const response = await fetch(`${API_BASE}/intent/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input, skipClarification })
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'Failed to analyze intent');
  }
  return response.json();
}

/**
 * Creates a cart from a list of products with mission metadata.
 */
export async function createCart(products, cartName, missionName, selectedPackTier) {
  const response = await fetch(`${API_BASE}/cart/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ products, cartName, missionName, selectedPackTier })
  });
  if (!response.ok) throw new Error('Failed to create cart');
  return response.json();
}

/**
 * Places the order for an existing cart.
 */
export async function checkout(cartId) {
  const response = await fetch(`${API_BASE}/cart/${cartId}/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!response.ok) throw new Error('Checkout failed');
  return response.json();
}

/**
 * Refines intent with additional feedback.
 */
export async function refineIntent(originalInput, feedback) {
  const response = await fetch(`${API_BASE}/intent/refine`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ originalInput, feedback })
  });
  if (!response.ok) throw new Error('Failed to refine recommendations');
  return response.json();
}

/**
 * Generates zero-decision packs from an existing intent result.
 * (Kept for backwards compatibility — the analyze endpoint now includes this.)
 */
export async function generateZeroDecisionPacks(intentResult, userInput) {
  const response = await fetch(`${API_BASE}/zero-decision/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ intentResult, userInput })
  });
  if (!response.ok) throw new Error('Failed to generate zero-decision packs');
  return response.json();
}


/**
 * Fetches products from the catalog. Optionally filtered by a text query or category.
 * Returns an array of product objects.
 */
export async function fetchProducts({ search, category } = {}) {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (category && category !== 'All') params.set('category', category);
  const qs = params.toString();
  const response = await fetch(`${API_BASE}/products${qs ? `?${qs}` : ''}`);
  if (!response.ok) throw new Error('Failed to load products');
  const json = await response.json();
  return json.data || [];
}

/**
 * Fetches the list of available product categories.
 */
export async function fetchCategories() {
  const response = await fetch(`${API_BASE}/products/categories`);
  if (!response.ok) throw new Error('Failed to load categories');
  const json = await response.json();
  return json.data || [];
}
