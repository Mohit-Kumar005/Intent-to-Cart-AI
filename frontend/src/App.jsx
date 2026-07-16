import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import QuickSearches from './components/QuickSearches';
import ProductBrowse from './components/ProductBrowse';
import CartDrawer from './components/CartDrawer';
import ResultsPage from './components/ResultsPage';
import OrderConfirmation from './components/OrderConfirmation';
import LoadingSequence from './components/LoadingSequence';
import { analyzeIntent, createCart, checkout, fetchCategories } from './utils/api';

// Maps short clarification answers to concrete keywords so that selecting an
// option always re-runs Smart Cart generation into a real, category-correct
// scenario (prevents the "button does nothing" dead-end).
const CLARIFICATION_KEYWORDS = {
  Work: 'office supplies and stationery for work',
  Food: 'snacks and drinks',
  Health: 'medicine for fever',
  Comfort: 'coffee and snacks for comfort',
  Medicine: 'medicine for fever',
  Diapers: 'baby diapers and wipes',
  Feeding: 'baby feeding and milk',
  Hygiene: 'baby wet wipes for hygiene',
  Drinks: 'soft drinks',
  Snacks: 'snacks',
  Toys: 'pet treats and chew sticks',
  Treats: 'pet treats and dental chews',
  Grooming: 'pet grooming supplies',
  'Serving Items': 'party cups and paper plates',
  Toiletries: 'soap and shampoo toiletries',
  'Study Supplies': 'study notebook and pen stationery',
  Groceries: 'groceries like milk bread and eggs',
  Cleaning: 'cleaning floor cleaner and supplies',
  Cooking: 'cooking rice and pasta'
};

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [intentResult, setIntentResult] = useState(null);
  const [orderInfo, setOrderInfo] = useState(null);
  const [error, setError] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [clarification, setClarification] = useState(null);

  // Storefront state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [categories, setCategories] = useState([]);

  // Shopping cart (browse) state
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  const cartCount = cart.reduce((sum, p) => sum + p.quantity, 0);

  // ── Load categories once ──────────────────────────────────────────────────
  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  // ── CART OPERATIONS ─────────────────────────────────────────────────────
  const handleAddToCart = useCallback((product) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      if (existing) {
        return prev.map((p) => (p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p));
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const incQty = useCallback((id) => {
    setCart((prev) => prev.map((p) => (p.id === id ? { ...p, quantity: p.quantity + 1 } : p)));
  }, []);

  const decQty = useCallback((id) => {
    setCart((prev) =>
      prev
        .map((p) => (p.id === id ? { ...p, quantity: p.quantity - 1 } : p))
        .filter((p) => p.quantity > 0)
    );
  }, []);

  const removeFromCart = useCallback((id) => {
    setCart((prev) => prev.filter((p) => p.id !== id));
  }, []);

  // ── INTENT (SMART CART) SUBMISSION ───────────────────────────────────────
  const handleIntentSubmit = async (input, { skipClarification = false } = {}) => {
    setUserInput(input);
    setError(null);
    setCartOpen(false);
    setCurrentView('loading');

    try {
      const result = await analyzeIntent(input, { skipClarification });

      if (result.needsClarification) {
        console.info('[SmartCart] Clarification needed for:', input);
        setClarification(result.data);
        setCurrentView('clarify');
        return;
      }

      if (!result.data) {
        throw new Error('No cart data returned from the server.');
      }

      console.info('[SmartCart] Cart generated for:', input);
      setIntentResult(result.data);
      setTimeout(() => setCurrentView('results'), 4200);
    } catch (err) {
      console.error('[SmartCart] Failed to generate smart cart:', err);
      setError(err.message || 'Failed to analyze intent. Please try again.');
      setCurrentView('home');
    }
  };

  // ── BROWSE CART CHECKOUT ──────────────────────────────────────────────────
  const handleBrowseCheckout = async () => {
    try {
      // Flatten by quantity so totals reflect the chosen amounts
      const flatProducts = cart.flatMap((item) =>
        Array.from({ length: item.quantity }, () => ({
          id: item.id, name: item.name, category: item.category,
          price: item.price, image: item.image, deliveryTime: item.deliveryTime
        }))
      );

      const cartResult = await createCart(flatProducts, 'My Cart', 'My Cart', 'Custom');
      const orderResult = await checkout(cartResult.data.id);

      setOrderInfo({
        ...orderResult.data,
        missionName: 'My Cart',
        selectedPackTier: 'Custom',
        products: flatProducts,
        totals: {
          subtotal: flatProducts.reduce((s, p) => s + p.price, 0),
          total: orderResult.data?.totals?.total ?? flatProducts.reduce((s, p) => s + p.price, 0)
        }
      });

      setCart([]);
      setCartOpen(false);
      setCurrentView('ordered');
    } catch (err) {
      setError(err.message || 'Checkout failed. Please try again.');
      setCartOpen(false);
    }
  };

  // ── AI RESULTS CHECKOUT ───────────────────────────────────────────────────
  const handleCheckout = async (cartProducts, selectedPack) => {
    try {
      const missionName = intentResult?.zeroDecision?.scenario?.missionName
        || intentResult?.subjectDetection?.missionName
        || 'Shopping Mission';

      const cartResult = await createCart(
        cartProducts, missionName, missionName, selectedPack?.tier || 'Custom'
      );
      const orderResult = await checkout(cartResult.data.id);

      setOrderInfo({
        ...orderResult.data,
        missionName,
        selectedPackTier: selectedPack?.tier || 'Custom',
        products: cartProducts,
        totals: {
          subtotal: cartProducts.reduce((s, p) => s + p.price, 0),
          total: orderResult.data?.totals?.total ?? cartProducts.reduce((s, p) => s + p.price, 0)
        }
      });

      setCurrentView('ordered');
    } catch (err) {
      setError(err.message || 'Checkout failed. Please try again.');
    }
  };

  // ── RESET / NAV ────────────────────────────────────────────────────────────
  const handleReset = () => {
    setCurrentView('home');
    setIntentResult(null);
    setOrderInfo(null);
    setClarification(null);
    setError(null);
    setUserInput('');
    setSearchQuery('');
    setActiveCategory('All');
  };

  const handleClarificationSubmit = async (answer) => {
    if (!userInput) return;
    // Map the short clarification label to concrete keywords so the re-run
    // resolves to a real situation and always produces a Smart Cart. The
    // skipClarification flag is a safety net: even if an option can't be mapped
    // to a known situation, the re-run still generates a cart (no dead-end).
    const mapped = CLARIFICATION_KEYWORDS[answer] || answer;
    console.info('[SmartCart] Clarification selected:', answer, '->', mapped);
    setClarification(null);
    await handleIntentSubmit(`${userInput}. I need ${mapped}.`, { skipClarification: true });
  };

  // Header search submit (plain product search) sends us to the storefront
  const handleSearchSubmit = (q) => {
    setSearchQuery(q);
    setActiveCategory('All');
    if (currentView !== 'home') setCurrentView('home');
  };

  const handleSearchChange = (q) => {
    setSearchQuery(q);
    if (currentView !== 'home') setCurrentView('home');
  };

  const handleCategorySelect = (cat) => {
    setActiveCategory(cat);
    if (currentView !== 'home') setCurrentView('home');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onReset={handleReset}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
        onSmartSearch={handleIntentSubmit}
        cartCount={cartCount}
        onCartClick={() => setCartOpen(true)}
        categories={categories}
        activeCategory={activeCategory}
        onCategorySelect={handleCategorySelect}
      />

      <CartDrawer
        open={cartOpen}
        items={cart}
        onClose={() => setCartOpen(false)}
        onInc={incQty}
        onDec={decQty}
        onRemove={removeFromCart}
        onCheckout={handleBrowseCheckout}
      />

      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-5">

        {/* Error Banner */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 animate-fade-in">
            <p className="font-medium">Something went wrong</p>
            <p className="text-sm mt-1">{error}</p>
            <button onClick={() => setError(null)} className="mt-2 text-xs text-red-500 hover:text-red-700 underline">
              Dismiss
            </button>
          </div>
        )}

        {/* ── HOME / STOREFRONT ── */}
        {currentView === 'home' && (
          <div className="animate-fade-in">
            {/* Hero strip */}
            <div className="rounded-2xl gradient-bg text-white px-4 py-5 lg:px-8 lg:py-6 mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-xl lg:text-2xl font-bold">Everything you need, delivered in minutes</h2>
                <p className="text-sm text-gray-300 mt-1">
                  Shop thousands of essentials — or describe a situation and let AI build your cart.
                </p>
              </div>
              <span className="self-start sm:self-center text-xs font-semibold bg-amazon-orange text-amazon-darkBlue px-3 py-1.5 rounded-full">
                ⚡ 10–15 min delivery
              </span>
            </div>

            {/* Quick searches BELOW the search box */}
            <QuickSearches onSelect={handleIntentSubmit} />

            {/* Product storefront */}
            <ProductBrowse
              searchQuery={searchQuery}
              activeCategory={activeCategory}
              cartItems={cart}
              onAddToCart={handleAddToCart}
            />
          </div>
        )}

        {/* ── LOADING ── */}
        {currentView === 'loading' && <LoadingSequence />}

        {/* ── CLARIFICATION ── */}
        {currentView === 'clarify' && clarification && (
          <div className="mx-auto max-w-2xl animate-fade-in">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xl">
              <p className="text-sm font-semibold uppercase tracking-wide text-amazon-orange mb-2">
                Quick clarification
              </p>
              <h2 className="text-2xl font-bold text-amazon-blue mb-3">
                {clarification.clarification?.question || 'What do you need help with?'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(clarification.clarification?.options || ['Food', 'Medicine', 'Toys', 'Other']).map((option) => (
                  <button
                    key={option}
                    onClick={() => handleClarificationSubmit(option)}
                    className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-left font-medium text-gray-700 hover:border-amazon-orange hover:bg-orange-50 transition-all"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── AI RESULTS ── */}
        {currentView === 'results' && intentResult && (
          <div className="max-w-4xl mx-auto">
            <ResultsPage
              intentResult={intentResult}
              userInput={userInput}
              onCheckout={handleCheckout}
              onReset={handleReset}
              onRefine={(refinedQuery) => handleIntentSubmit(refinedQuery)}
            />
          </div>
        )}

        {/* ── ORDER CONFIRMATION ── */}
        {currentView === 'ordered' && orderInfo && (
          <div className="max-w-4xl mx-auto">
            <OrderConfirmation orderInfo={orderInfo} onReset={handleReset} />
          </div>
        )}

      </main>
    </div>
  );
}

export default App;
