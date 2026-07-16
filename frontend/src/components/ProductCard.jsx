import React from 'react';
import { X, Clock, CheckCircle } from 'lucide-react';

function ProductCard({ product, onRemove, index }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm transition-all animate-bounce-in group" style={{ animationDelay: `${index * 100}ms` }}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-3 h-3 text-green-600" />
            </span>
            <h4 className="font-semibold text-sm text-gray-800 line-clamp-1">{product.name}</h4>
          </div>
          <p className="text-xs text-gray-500 ml-7 mb-2 line-clamp-1">{product.reason}</p>
          <div className="flex items-center justify-between ml-7">
            <span className="text-lg font-bold text-amazon-blue">₹{product.price}</span>
            <div className="flex items-center gap-1 text-green-600">
              <Clock className="w-3 h-3" />
              <span className="text-[10px] font-semibold">{product.deliveryTime}</span>
            </div>
          </div>
        </div>
        <button onClick={() => onRemove(product.id)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded-lg" title="Remove from cart">
          <X className="w-4 h-4 text-red-400" />
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
