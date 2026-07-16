import React from 'react';
import { Star, Clock, Plus, Check } from 'lucide-react';
import { handleImageError } from '../utils/productImage';

// Deterministic pseudo-rating so each product shows a stable rating/review count
function pseudoRating(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) % 100000;
  const rating = (3.8 + (hash % 12) / 10).toFixed(1); // 3.8 – 4.9
  const reviews = 120 + (hash % 4200);
  return { rating, reviews };
}

function StoreProductCard({ product, inCart, onAdd }) {
  const { rating, reviews } = pseudoRating(product.id);
  const mrp = Math.round(product.price * 1.25); // fake "list price" for a discount badge
  const discount = Math.round(((mrp - product.price) / mrp) * 100);

  return (
    <div className="group flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden transition-all">
      {/* Image */}
      <div className="relative bg-gray-50 aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          onError={handleImageError(product.category, product.name)}
          className="w-full h-full object-cover transition-transform duration-300"
        />
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            {discount}% OFF
          </span>
        )}
        <span className="absolute bottom-2 left-2 flex items-center gap-1 bg-white/90 backdrop-blur text-green-700 text-[10px] font-semibold px-1.5 py-0.5 rounded">
          <Clock className="w-3 h-3" />
          {product.deliveryTime}
        </span>
      </div>

      {/* Details */}
      <div className="flex flex-col flex-1 p-3">
        <p className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold mb-0.5">
          {product.category}
        </p>
        <h3 className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2 mb-1.5 min-h-[2.5rem]">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <span className="flex items-center gap-0.5 bg-green-700 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            {rating} <Star className="w-2.5 h-2.5 fill-white" />
          </span>
          <span className="text-[11px] text-gray-400">({reviews.toLocaleString()})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3 mt-auto">
          <span className="text-lg font-bold text-amazon-blue">₹{product.price}</span>
          {discount > 0 && (
            <span className="text-xs text-gray-400 line-through">₹{mrp}</span>
          )}
        </div>

        {/* Add to cart */}
        <button
          onClick={() => onAdd(product)}
          className={`w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
            inCart
              ? 'bg-green-100 text-green-700 border border-green-200'
              : 'amazon-gradient text-white hover:shadow-md active:scale-[0.98]'
          }`}
        >
          {inCart ? (
            <><Check className="w-4 h-4" /> Added</>
          ) : (
            <><Plus className="w-4 h-4" /> Add to Cart</>
          )}
        </button>
      </div>
    </div>
  );
}

export default StoreProductCard;
