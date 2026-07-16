import React, { useState, useEffect, useMemo } from 'react';
import { PackageSearch, Loader2, SlidersHorizontal } from 'lucide-react';
import StoreProductCard from './StoreProductCard';
import { fetchProducts } from '../utils/api';

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name', label: 'Name: A to Z' }
];

function ProductBrowse({ searchQuery, activeCategory, cartItems, onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState('featured');

  // Fetch products whenever the search query or category changes (debounced for search)
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const run = () => {
      fetchProducts({ search: searchQuery, category: activeCategory })
        .then((data) => { if (!cancelled) setProducts(data); })
        .catch((err) => { if (!cancelled) setError(err.message || 'Failed to load products'); })
        .finally(() => { if (!cancelled) setLoading(false); });
    };

    const timer = setTimeout(run, searchQuery ? 250 : 0);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [searchQuery, activeCategory]);

  const cartIds = useMemo(() => new Set(cartItems.map((p) => p.id)), [cartItems]);

  const sortedProducts = useMemo(() => {
    const list = [...products];
    switch (sort) {
      case 'price-asc': return list.sort((a, b) => a.price - b.price);
      case 'price-desc': return list.sort((a, b) => b.price - a.price);
      case 'name': return list.sort((a, b) => a.name.localeCompare(b.name));
      default: return list;
    }
  }, [products, sort]);

  return (
    <section className="mt-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-bold text-amazon-blue">
            {activeCategory && activeCategory !== 'All' ? activeCategory : 'All Products'}
            {searchQuery ? <span className="text-gray-500 font-normal"> · results for “{searchQuery}”</span> : null}
          </h2>
          {!loading && !error && (
            <p className="text-xs text-gray-500">{sortedProducts.length} items · delivered in minutes</p>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <SlidersHorizontal className="w-4 h-4 text-gray-400" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="text-xs font-medium text-gray-700 border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-amazon-orange/40"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* States */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin mb-3" />
          <p className="text-sm">Loading products…</p>
        </div>
      ) : error ? (
        <div className="py-16 text-center text-red-500 text-sm">{error}</div>
      ) : sortedProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <PackageSearch className="w-10 h-10 mb-3" />
          <p className="text-sm font-medium text-gray-600">No products found</p>
          <p className="text-xs">Try a different search or category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 lg:gap-4">
          {sortedProducts.map((product) => (
            <StoreProductCard
              key={product.id}
              product={product}
              inCart={cartIds.has(product.id)}
              onAdd={onAddToCart}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default ProductBrowse;
