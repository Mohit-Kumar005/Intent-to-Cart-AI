import React from 'react';
import { PlusCircle, Lightbulb } from 'lucide-react';

function MissingEssentials({ suggestions, onAddSuggestion }) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <div className="rounded-2xl border border-dashed border-orange-200 bg-orange-50/60 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="w-4 h-4 text-amazon-orange" />
        <p className="text-sm font-semibold text-gray-700">You might also need</p>
      </div>
      <div className="space-y-2">
        {suggestions.map((item, index) => (
          <div
            key={`${item.name}-${index}`}
            className="flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2.5 border border-orange-100 shadow-sm"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
              <p className="text-xs text-gray-500 mt-0.5">{item.reason}</p>
            </div>
            <button
              onClick={() => onAddSuggestion && onAddSuggestion(item)}
              className="flex-shrink-0 flex items-center gap-1 rounded-full bg-amazon-orange px-3 py-1.5 text-xs font-bold text-white hover:bg-amazon-darkOrange transition-colors"
            >
              <PlusCircle className="w-3 h-3" />
              Add ₹{item.price || '—'}
            </button>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-gray-400 mt-2 text-center">Optional — not automatically added to your cart</p>
    </div>
  );
}

export default MissingEssentials;
