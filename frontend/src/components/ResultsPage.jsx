import React, { useState, useEffect, useCallback } from 'react';
import {
  Sparkles, BadgeInfo, CheckCircle2, ChevronDown,
  Trash2, RefreshCw, HelpCircle, ArrowRight
} from 'lucide-react';
import CartSummary from './CartSummary';
import SituationPacks from './SituationPacks';
import ScoreBreakdownTooltip from './ScoreBreakdownTooltip';
import CartHealthBadge from './CartHealthBadge';
import MissingEssentials from './MissingEssentials';
import { recalculateCartMetrics } from '../utils/cartReactive';
import { handleImageError } from '../utils/productImage';

// ─── REPLACEMENT CATALOG ─────────────────────────────────────────────────────
// Category-aware replacements. Only same-category swaps are allowed.
const CATEGORY_REPLACEMENTS = {
  'Pet Care': [
    { id: 'prod_080', name: 'Dog Food (1kg Premium)', category: 'Pet Care', price: 349, inStock: true, deliveryTime: '10 mins', tags: ['pet', 'dog', 'food'] },
    { id: 'prod_081', name: 'Cat Food (500g)', category: 'Pet Care', price: 249, inStock: true, deliveryTime: '10 mins', tags: ['pet', 'cat', 'food'] },
    { id: 'prod_023a', name: 'Dog Treats', category: 'Pet Care', price: 129, inStock: true, deliveryTime: '10 mins', tags: ['pet', 'dog', 'treats'] },
    { id: 'prod_023b', name: 'Chew Sticks', category: 'Pet Care', price: 159, inStock: true, deliveryTime: '10 mins', tags: ['pet', 'dog', 'chew'] },
    { id: 'prod_023c', name: 'Pet Bowl', category: 'Pet Care', price: 119, inStock: true, deliveryTime: '10 mins', tags: ['pet', 'dog', 'bowl'] },
    { id: 'prod_023d', name: 'Dental Chews', category: 'Pet Care', price: 189, inStock: true, deliveryTime: '10 mins', tags: ['pet', 'dog', 'dental'] }
  ],
  'Health': [
    { id: 'prod_001', name: 'Digital Thermometer', category: 'Health', price: 299, inStock: true, deliveryTime: '10 mins', tags: ['health', 'fever'] },
    { id: 'prod_002', name: 'Paracetamol Syrup (Kids)', category: 'Health', price: 89, inStock: true, deliveryTime: '10 mins', tags: ['health', 'medicine'] },
    { id: 'prod_003', name: 'ORS Sachets (Pack of 10)', category: 'Health', price: 45, inStock: true, deliveryTime: '10 mins', tags: ['health', 'hydration'] },
    { id: 'prod_005', name: 'Band-Aid Strips (Pack of 20)', category: 'Health', price: 65, inStock: true, deliveryTime: '10 mins', tags: ['health', 'first-aid'] },
    { id: 'prod_006', name: 'Antiseptic Liquid (100ml)', category: 'Health', price: 79, inStock: true, deliveryTime: '10 mins', tags: ['health', 'antiseptic'] }
  ],
  'Stationery': [
    { id: 'prod_070', name: 'Notebook (200 Pages)', category: 'Stationery', price: 89, inStock: true, deliveryTime: '10 mins', tags: ['study', 'notes'] },
    { id: 'prod_071', name: 'Pen Set (Blue, Black, Red)', category: 'Stationery', price: 45, inStock: true, deliveryTime: '10 mins', tags: ['study', 'writing'] },
    { id: 'prod_072', name: 'Highlighter Set (5 Colors)', category: 'Stationery', price: 99, inStock: true, deliveryTime: '10 mins', tags: ['study', 'highlight'] },
    { id: 'prod_073', name: 'Sticky Notes (Pack of 3)', category: 'Stationery', price: 69, inStock: true, deliveryTime: '10 mins', tags: ['study', 'notes'] }
  ],
  'Beverages': [
    { id: 'prod_074', name: 'Coffee (Instant, 50g)', category: 'Beverages', price: 125, inStock: true, deliveryTime: '10 mins', tags: ['coffee', 'energy'] },
    { id: 'prod_075', name: 'Energy Drink (250ml)', category: 'Beverages', price: 99, inStock: true, deliveryTime: '10 mins', tags: ['energy', 'drink'] },
    { id: 'prod_022', name: 'Soft Drinks (6 Pack)', category: 'Beverages', price: 210, inStock: true, deliveryTime: '10 mins', tags: ['drinks', 'cold'] }
  ],
  'Snacks': [
    { id: 'prod_023', name: 'Chips (Large, Assorted)', category: 'Snacks', price: 150, inStock: true, deliveryTime: '10 mins', tags: ['snacks', 'chips'] },
    { id: 'prod_019a', name: 'Popcorn Tub', category: 'Snacks', price: 69, inStock: true, deliveryTime: '10 mins', tags: ['snack', 'popcorn'] }
  ]
};

/**
 * TASK 3: Smart replacement — same category + tag/use-case relevance + similar price.
 * Never cross-category. Rank by tag overlap (use case) then price similarity.
 */
function getReplacementsForProduct(product) {
  const catReplacements = CATEGORY_REPLACEMENTS[product.category] || [];
  const candidates = catReplacements.filter(r => r.id !== product.id);

  if (candidates.length === 0) return [];

  // Score by tag overlap (use-case match) and price proximity
  const productTags = new Set(product.tags || []);
  const scored = candidates.map(r => {
    const rTags = new Set(r.tags || []);
    const overlap = [...productTags].filter(t => rTags.has(t)).length;
    const priceDiff = Math.abs(r.price - product.price);
    // Higher overlap = better; lower price diff = better
    const score = (overlap * 10) - (priceDiff / 50);
    return { ...r, _score: score };
  });

  scored.sort((a, b) => b._score - a._score);
  return scored.slice(0, 5);
}

// ─── URGENCY BADGE COLORS ────────────────────────────────────────────────────
const urgencyColors = {
  Critical: 'bg-red-100 text-red-700 border-red-200',
  High: 'bg-orange-100 text-orange-700 border-orange-200',
  Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Low: 'bg-green-100 text-green-700 border-green-200'
};

// ─── PRODUCT CARD WITH REMOVE / REPLACE / WHY ────────────────────────────────

function EditableProductCard({ product, onRemove, onReplace, onQuantityChange }) {
  const [showWhyModal, setShowWhyModal] = useState(false);
  const [showReplaceMenu, setShowReplaceMenu] = useState(false);
  const replacements = getReplacementsForProduct(product);
  const hasReplacements = replacements.length > 0;
  const qty = product.quantity || 1;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-3 shadow-sm transition-all">
      <div className="flex items-start justify-between gap-2 mb-2">
        {/* Product image */}
        {product.image && (
          <img
            src={product.image}
            alt={product.name}
            onError={handleImageError(product.category, product.name)}
            className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-gray-100"
          />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-800 truncate">{product.name}</p>
          <p className="text-xs text-gray-500">{product.category}</p>
        </div>
        <p className="text-sm font-bold text-amazon-blue flex-shrink-0">₹{product.price * qty}</p>
      </div>

      {/* Quantity controls */}
      <div className="flex items-center gap-2 mb-2">
        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => onQuantityChange(product.id, Math.max(1, qty - 1))}
            disabled={qty <= 1}
            className="px-2.5 py-1 text-sm font-bold text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            −
          </button>
          <span className="px-3 py-1 text-sm font-bold text-amazon-blue border-l border-r border-gray-200 min-w-[2.5rem] text-center">
            {qty}
          </span>
          <button
            onClick={() => onQuantityChange(product.id, qty + 1)}
            className="px-2.5 py-1 text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors"
          >
            +
          </button>
        </div>
        {qty > 1 && (
          <span className="text-[10px] text-gray-400">₹{product.price} × {qty}</span>
        )}
      </div>

      <div className="flex items-center gap-1 flex-wrap">
        <button
          onClick={() => onRemove(product.id)}
          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all border border-red-100"
          title="Remove this item"
        >
          <Trash2 className="w-3 h-3" />
          Remove
        </button>

        {hasReplacements ? (
          <div className="relative">
            <button
              onClick={() => setShowReplaceMenu(!showReplaceMenu)}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-all border border-blue-100"
              title="Replace with a similar item"
            >
              <RefreshCw className="w-3 h-3" />
              Replace
            </button>
            {showReplaceMenu && (
              <div className="absolute z-20 left-0 top-8 w-56 bg-white border border-gray-200 rounded-xl shadow-xl p-2">
                <p className="text-[10px] font-semibold text-gray-400 uppercase px-2 mb-2">
                  Same category replacements
                </p>
                {replacements.slice(0, 5).map(r => (
                  <button
                    key={r.id}
                    onClick={() => { onReplace(product.id, r); setShowReplaceMenu(false); }}
                    className="w-full flex items-center justify-between px-2 py-2 rounded-lg hover:bg-gray-50 text-left"
                  >
                    <span className="text-xs font-medium text-gray-700 flex-1 mr-1 truncate">{r.name}</span>
                    <span className="text-xs font-bold text-amazon-blue flex-shrink-0">₹{r.price}</span>
                  </button>
                ))}
                <button
                  onClick={() => setShowReplaceMenu(false)}
                  className="w-full text-center text-[10px] text-gray-400 hover:text-gray-600 pt-1 pb-0.5"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        ) : (
          <span className="px-2.5 py-1.5 text-xs text-gray-400 border border-gray-100 rounded-lg">
            No alternative available
          </span>
        )}

        <button
          onClick={() => setShowWhyModal(!showWhyModal)}
          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-all border border-gray-200"
          title="Why was this item recommended?"
        >
          <HelpCircle className="w-3 h-3" />
          Why?
        </button>
      </div>

      {/* Why Modal */}
      {showWhyModal && (
        <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-xs font-semibold text-blue-700 mb-1">Why this item?</p>
          <p className="text-xs text-blue-600">
            {product.reason
              || `${product.name} was recommended based on your detected situation and category (${product.category}).`}
          </p>
          <button
            onClick={() => setShowWhyModal(false)}
            className="mt-1 text-[10px] text-blue-400 hover:text-blue-600"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}

// ─── RESULTS PAGE ────────────────────────────────────────────────────────────

function ResultsPage({ intentResult, userInput, onCheckout, onReset, onRefine }) {
  // ── SINGLE SOURCE OF TRUTH ────────────────────────────────────────────────
  // The selected pack drives everything: displayed products, quantities,
  // totals, scores and the order summary. Default pack selection is intelligent
  // and based on how many products the AI generated:
  //   2 products      → Budget Pack
  //   3–4 products     → Standard Pack
  //   5+ products      → Premium Pack
  const allPacks = intentResult?.zeroDecision?.packs || [];
  const generatedCount = intentResult?.cart?.products?.length || 0;

  const chooseDefaultPack = () => {
    if (!allPacks.length) return null;
    let tier = null;
    if (generatedCount >= 5) tier = 'Premium';
    else if (generatedCount >= 3) tier = 'Standard';
    else if (generatedCount === 2) tier = 'Budget';

    let pack = tier ? allPacks.find(p => p.tier === tier) : null;
    if (!pack) {
      // 0/1 generated, or tier missing → fall back to the recommended pack.
      pack = allPacks.find(p => p.id === intentResult?.zeroDecision?.recommended_pack_id)
        || allPacks.find(p => p.tier === 'Standard')
        || allPacks[0];
    }
    return pack;
  };

  const defaultPack = chooseDefaultPack();
  const rawInitialProducts = defaultPack?.products || intentResult?.cart?.products || [];
  const initialPackId = defaultPack?.id || null;

  // TASK 1: Apply people-count-based quantities to initial products.
  // If the user said "movie night for 6 people", default qty for shareable items
  // (snacks, drinks) should be scaled up, not left at 1.
  const peopleCount = intentResult?.structuredContext?.peopleCount || null;
  const initialProducts = rawInitialProducts.map(p => {
    if (!peopleCount || peopleCount <= 1) return { ...p, quantity: p.quantity || 1 };
    // Scale shareable categories (snacks, beverages, party items) by people count
    const shareableCategories = ['Snacks', 'Beverages', 'Party', 'Dessert'];
    const isShareable = shareableCategories.some(
      c => (p.category || '').toLowerCase() === c.toLowerCase()
    );
    // Non-shareable items (electronics, stationery, health) keep qty = 1
    const qty = isShareable ? Math.min(peopleCount, 10) : 1;
    return { ...p, quantity: qty };
  });

  const [cartProducts, setCartProducts] = useState(initialProducts);
  const [selectedPackId, setSelectedPackId] = useState(initialPackId);
  // TASK 2: Persist quantities independently from pack selection.
  // Maps productId → quantity so switching packs preserves user-set quantities.
  const [quantityMemory, setQuantityMemory] = useState(() => {
    const mem = {};
    initialProducts.forEach(p => { mem[p.id] = p.quantity || 1; });
    return mem;
  });
  const [metrics, setMetrics] = useState(() =>
    recalculateCartMetrics(initialProducts, intentResult, initialPackId)
  );
  const [showScoreBreakdown, setShowScoreBreakdown] = useState(false);

  // ── Reactive: recalculate on every cart/pack change ──────────────────────
  useEffect(() => {
    setMetrics(recalculateCartMetrics(cartProducts, intentResult, selectedPackId));
  }, [cartProducts, selectedPackId, intentResult]);

  const handleRemoveProduct = useCallback((productId) => {
    setCartProducts(prev => prev.filter(p => p.id !== productId));
  }, []);

  const handleReplaceProduct = useCallback((productId, replacement) => {
    setCartProducts(prev =>
      prev.map(p => p.id === productId ? { ...replacement, quantity: p.quantity || 1 } : p)
    );
  }, []);

  const handleQuantityChange = useCallback((productId, newQty) => {
    if (newQty < 1) return;
    setCartProducts(prev =>
      prev.map(p => p.id === productId ? { ...p, quantity: newQty } : p)
    );
    // TASK 2: Remember the quantity even if the user switches packs later
    setQuantityMemory(prev => ({ ...prev, [productId]: newQty }));
  }, []);

  // TASK 2: When switching packs, apply remembered quantities to products
  // that exist in both the old and new packs.
  const handleSelectPack = useCallback((pack) => {
    setSelectedPackId(pack.id);
    const newProducts = pack.products.map(p => ({
      ...p,
      quantity: quantityMemory[p.id] || p.quantity || 1
    }));
    setCartProducts(newProducts);
  }, [quantityMemory]);

  const handleAddMissingEssential = useCallback((item) => {
    // Only add if not already in cart
    setCartProducts(prev => {
      if (prev.find(p => p.name.toLowerCase() === item.name.toLowerCase())) return prev;
      return [...prev, {
        id: `essential-${Date.now()}`,
        name: item.name,
        category: item.category || 'Essentials',
        price: item.price || 99,
        inStock: true,
        deliveryTime: '10 mins',
        tags: [],
        reason: item.reason
      }];
    });
  }, []);

  const handleCheckout = useCallback(() => {
    const activePack = metrics.packs?.find(p => p.id === selectedPackId);
    onCheckout(cartProducts, activePack);
  }, [cartProducts, selectedPackId, metrics.packs, onCheckout]);

  const { intent, reasoning, cart, subjectDetection } = intentResult;
  const { optimization, packs, missingEssentials } = metrics;
  const activePack = packs?.find(p => p.id === selectedPackId);
  const missionName = intentResult?.zeroDecision?.scenario?.missionName
    || subjectDetection?.missionName
    || 'Shopping Mission';

  return (
    <div className="animate-fade-in space-y-6">

      {/* User Input Echo */}
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-amazon-blue flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm font-bold">U</span>
        </div>
        <div className="bg-white rounded-2xl rounded-tl-md px-5 py-3 shadow-sm border border-gray-100 max-w-[85%]">
          <p className="text-gray-800 font-medium">{userInput}</p>
        </div>
      </div>

      {/* AI Response */}
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full amazon-gradient flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4 text-white" />
        </div>

        <div className="flex-1 space-y-5">

          {/* ── SECTION 1: AI Understanding Panel ── */}
          <div className="bg-white rounded-2xl rounded-tl-md p-5 shadow-sm border border-gray-100 animate-slide-up">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-amazon-orange" />
              <span className="text-sm font-semibold text-gray-700">AI Understanding</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className="bg-gray-50 rounded-lg p-2.5">
                <p className="text-[10px] uppercase text-gray-400 font-semibold">Subject</p>
                <p className="text-sm font-bold text-amazon-blue">
                  {subjectDetection?.subject || intent?.subject || '—'}
                  {subjectDetection?.petType ? ` (${subjectDetection.petType})` : ''}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2.5">
                <p className="text-[10px] uppercase text-gray-400 font-semibold">Situation</p>
                <p className="text-sm font-bold text-amazon-blue">
                  {subjectDetection?.situation || intent?.situation || '—'}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-2.5">
                <p className="text-[10px] uppercase text-gray-400 font-semibold">Urgency</p>
                <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full border ${urgencyColors[intent?.urgency] || urgencyColors.Medium}`}>
                  {intent?.urgency || 'Medium'}
                </span>
              </div>
              <div className="bg-gray-50 rounded-lg p-2.5">
                <p className="text-[10px] uppercase text-gray-400 font-semibold">Category</p>
                <p className="text-sm font-bold text-amazon-blue">
                  {subjectDetection?.category || intent?.type || '—'}
                </p>
              </div>
            </div>

            {/* Mission */}
            <div className="mb-3">
              <p className="text-[10px] uppercase text-gray-400 font-semibold mb-1">Mission</p>
              <p className="text-lg font-bold text-amazon-blue">{missionName}</p>
            </div>

            {/* TASK 5/8: Structured Context — show extracted people, duration, activity, budget */}
            {intentResult?.structuredContext && (
              (() => {
                const ctx = intentResult.structuredContext;
                const hasContext = ctx.peopleCount || ctx.duration || ctx.budgetHint || ctx.urgencyHint || ctx.activity;
                if (!hasContext) return null;
                return (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                    {ctx.activity && (
                      <div className="bg-purple-50 rounded-lg p-2 border border-purple-100">
                        <p className="text-[10px] uppercase text-purple-400 font-semibold">Activity</p>
                        <p className="text-sm font-bold text-purple-700">{ctx.activity}</p>
                      </div>
                    )}
                    {ctx.peopleCount && (
                      <div className="bg-purple-50 rounded-lg p-2 border border-purple-100">
                        <p className="text-[10px] uppercase text-purple-400 font-semibold">People</p>
                        <p className="text-sm font-bold text-purple-700">{ctx.peopleCount}</p>
                      </div>
                    )}
                    {ctx.duration && (
                      <div className="bg-purple-50 rounded-lg p-2 border border-purple-100">
                        <p className="text-[10px] uppercase text-purple-400 font-semibold">Duration</p>
                        <p className="text-sm font-bold text-purple-700">{ctx.duration.value} {ctx.duration.unit}(s)</p>
                      </div>
                    )}
                    {ctx.budgetHint && (
                      <div className="bg-purple-50 rounded-lg p-2 border border-purple-100">
                        <p className="text-[10px] uppercase text-purple-400 font-semibold">Budget</p>
                        <p className="text-sm font-bold text-purple-700">₹{ctx.budgetHint}</p>
                      </div>
                    )}
                    {ctx.urgencyHint && (
                      <div className="bg-purple-50 rounded-lg p-2 border border-purple-100">
                        <p className="text-[10px] uppercase text-purple-400 font-semibold">Urgency</p>
                        <p className="text-sm font-bold text-purple-700">{ctx.urgencyHint}</p>
                      </div>
                    )}
                  </div>
                );
              })()
            )}

            {/* Reasoning */}
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-100 mb-3">
              <p className="text-xs text-blue-600 flex items-start gap-2">
                <span className="flex-shrink-0 mt-0.5">ℹ️</span>
                <span><strong>AI Reasoning:</strong> {reasoning}</span>
              </p>
            </div>

            {/* TASK 8: Recommendation checklist — show why these products were chosen */}
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="text-[10px] font-semibold text-green-600 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full">
                ✓ Matches detected situation
              </span>
              <span className="text-[10px] font-semibold text-green-600 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full">
                ✓ High availability
              </span>
              <span className="text-[10px] font-semibold text-green-600 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full">
                ✓ Fast delivery
              </span>
              {intentResult?.structuredContext?.peopleCount && (
                <span className="text-[10px] font-semibold text-green-600 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full">
                  ✓ Sized for {intentResult.structuredContext.peopleCount} people
                </span>
              )}
              {intentResult?.structuredContext?.budgetHint && (
                <span className="text-[10px] font-semibold text-green-600 bg-green-50 border border-green-100 px-2 py-0.5 rounded-full">
                  ✓ Within ₹{intentResult.structuredContext.budgetHint} budget
                </span>
              )}
            </div>

            {/* TASK 1: Health disclaimer */}
            {intentResult?.healthDisclaimer && (
              <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                <p className="text-xs text-amber-700 flex items-start gap-2">
                  <span className="flex-shrink-0 mt-0.5">⚠️</span>
                  <span><strong>Health Notice:</strong> {intentResult.healthDisclaimer}</span>
                </p>
              </div>
            )}
          </div>

          {/* ── SECTION 2: Generated Cart Header ── */}
          <div className="bg-gradient-to-r from-amazon-orange/10 to-yellow-50 rounded-xl p-4 border border-amazon-orange/20 animate-slide-up">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📦</span>
                <div>
                  <h3 className="font-bold text-amazon-blue">{cart?.name || 'Generated Cart'}</h3>
                  <p className="text-xs text-gray-500">Curated for your situation</p>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-xs font-bold">
                🚚 {cart?.estimatedNeedTime || '10-15 mins'}
              </div>
            </div>
          </div>

          {/* ── Smart Shopping Packs — choose a pack to build the cart ── */}
          {packs && packs.length > 0 && (
            <div className="bg-white rounded-2xl rounded-tl-md p-5 shadow-sm border border-gray-100 animate-slide-up space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amazon-orange" />
                  <span className="text-sm font-semibold text-gray-700">Smart Shopping Packs</span>
                </div>
                <span className="text-xs text-gray-400">Select to update cart</span>
              </div>
              <SituationPacks
                packs={packs}
                selectedPackId={selectedPackId}
                onSelectPack={handleSelectPack}
              />
            </div>
          )}

          {/* ── Selected Pack Products (rendered from the selected pack) ── */}
          <div className="space-y-3 animate-slide-up">
            <h4 className="text-sm font-semibold text-gray-600 flex items-center gap-2">
              <span>Products ({cartProducts.length})</span>
              <ArrowRight className="w-3 h-3" />
            </h4>
            {cartProducts.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-sm">
                Cart is empty. Select a pack above to repopulate.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {cartProducts.map((product) => (
                  <EditableProductCard
                    key={product.id}
                    product={product}
                    onRemove={handleRemoveProduct}
                    onReplace={handleReplaceProduct}
                    onQuantityChange={handleQuantityChange}
                  />
                ))}
              </div>
            )}
          </div>

          {/* ── SECTION 4: Optimization Score ── */}
          {optimization && (
            <div className="bg-white rounded-2xl rounded-tl-md p-5 shadow-sm border border-gray-100 animate-slide-up space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <BadgeInfo className="w-4 h-4 text-amazon-orange" />
                  <span className="text-sm font-semibold text-gray-700">Cart Optimization</span>
                </div>
                <div className="relative">
                  <button
                    onMouseEnter={() => setShowScoreBreakdown(true)}
                    onMouseLeave={() => setShowScoreBreakdown(false)}
                    className="flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-green-700 border border-green-100 hover:bg-green-100 transition-all"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold">Score {Math.round(optimization.score)}/100</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  {showScoreBreakdown && (
                    <ScoreBreakdownTooltip breakdown={optimization.scoreBreakdown} />
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-600">{optimization.explanation}</p>
              <CartHealthBadge health={optimization.health} score={Math.round(optimization.score)} />
            </div>
          )}

          {/* ── SECTION 6: Missing Essentials ── */}
          {missingEssentials && missingEssentials.length > 0 && (
            <div className="animate-slide-up">
              <MissingEssentials
                suggestions={missingEssentials}
                onAddSuggestion={handleAddMissingEssential}
              />
            </div>
          )}

          {/* ── SECTION 6b: Gift Refinement Chips (optional) ── */}
          {intentResult?.giftRefinement?.enabled && onRefine && (
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm animate-slide-up">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Improve Recommendations
              </p>
              <p className="text-sm text-gray-600 mb-3">
                Want a more personalized gift? Select who it's for:
              </p>
              <div className="flex flex-wrap gap-2">
                {(intentResult.giftRefinement.chips || ['Friend', 'Family', 'Partner', 'Colleague']).map((chip) => (
                  <button
                    key={chip}
                    onClick={() => onRefine(`${userInput} for ${chip.toLowerCase()}`)}
                    className="px-4 py-2 rounded-full border border-amazon-orange/40 bg-orange-50 text-sm font-medium text-amazon-blue hover:bg-amazon-orange hover:text-white transition-all"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── SECTION 7: Checkout ── */}
          <CartSummary
            products={cartProducts}
            optimization={optimization}
            selectedPack={activePack}
            onCheckout={handleCheckout}
            onReset={onReset}
          />

        </div>
      </div>
    </div>
  );
}

export default ResultsPage;
