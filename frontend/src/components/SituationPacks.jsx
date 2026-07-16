import React from 'react';
import { Sparkles, Shield, Timer, BadgeIndianRupee, CheckCircle2, Star } from 'lucide-react';

const TIER_STYLES = {
  Budget: 'text-blue-600 bg-blue-50',
  Standard: 'text-amazon-orange bg-orange-50',
  Premium: 'text-purple-600 bg-purple-50'
};

const TIER_BORDER = {
  Budget: 'border-blue-200',
  Standard: 'border-amazon-orange/40',
  Premium: 'border-purple-200'
};

function SituationPacks({ packs, selectedPackId, onSelectPack }) {
  if (!packs || packs.length === 0) return null;

  // Sort packs Budget → Standard → Premium for consistent display
  const tierOrder = { Budget: 0, Standard: 1, Premium: 2 };
  const sortedPacks = [...packs].sort((a, b) => (tierOrder[a.tier] ?? 1) - (tierOrder[b.tier] ?? 1));

  return (
    <div className="space-y-3 animate-slide-up">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {sortedPacks.map((pack) => {
          const isSelected = pack.id === selectedPackId;
          const tierStyle = TIER_STYLES[pack.tier] || TIER_STYLES.Standard;
          const tierBorder = TIER_BORDER[pack.tier] || TIER_BORDER.Standard;

          return (
            <button
              key={pack.id}
              onClick={() => onSelectPack(pack)}
              className={`text-left rounded-2xl border-2 p-4 transition-all ${
                isSelected
                  ? `${tierBorder} shadow-lg ring-2 ring-offset-1 ${
                      pack.tier === 'Budget' ? 'ring-blue-300 bg-blue-50/40'
                      : pack.tier === 'Premium' ? 'ring-purple-300 bg-purple-50/40'
                      : 'ring-amazon-orange/40 bg-orange-50/40'
                    }`
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${tierStyle}`}>
                      {pack.tier}
                    </span>
                    {pack.recommended && (
                      <span className="flex items-center gap-0.5 text-[10px] font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                        <Star className="w-3 h-3" />
                        Recommended
                      </span>
                    )}
                  </div>
                  <h5 className="font-bold text-gray-800 text-sm">{pack.title}</h5>
                  <p className="text-xs text-gray-500 mt-0.5">{pack.subtitle}</p>
                </div>
                {isSelected && <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                <div className="rounded-xl bg-gray-50 p-2 border border-gray-100 text-center">
                  <p className="text-[9px] uppercase text-gray-400 font-semibold flex items-center justify-center gap-1 mb-0.5">
                    <BadgeIndianRupee className="w-2.5 h-2.5" />Total
                  </p>
                  <p className="font-bold text-gray-800">₹{pack.totals.total}</p>
                </div>
                <div className="rounded-xl bg-gray-50 p-2 border border-gray-100 text-center">
                  <p className="text-[9px] uppercase text-gray-400 font-semibold flex items-center justify-center gap-1 mb-0.5">
                    <Shield className="w-2.5 h-2.5" />Items
                  </p>
                  <p className="font-bold text-gray-800">{pack.products.length}</p>
                </div>
                <div className="rounded-xl bg-gray-50 p-2 border border-gray-100 text-center">
                  <p className="text-[9px] uppercase text-gray-400 font-semibold flex items-center justify-center gap-1 mb-0.5">
                    <Sparkles className="w-2.5 h-2.5" />Score
                  </p>
                  <p className="font-bold text-gray-800">{pack.optimization_score}</p>
                </div>
              </div>

              {/* Products preview */}
              <div className="space-y-1.5 mb-3">
                {pack.products.slice(0, 3).map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between rounded-lg bg-white border border-gray-100 px-2.5 py-1.5"
                  >
                    <span className="text-xs text-gray-700 truncate flex-1 mr-2">{product.name}</span>
                    <span className="text-xs font-semibold text-gray-500 flex-shrink-0">₹{product.price}</span>
                  </div>
                ))}
                {pack.products.length > 3 && (
                  <p className="text-[10px] text-gray-400 text-center">
                    +{pack.products.length - 3} more items
                  </p>
                )}
              </div>

              {/* Explanation */}
              <p className="text-xs text-gray-500 leading-relaxed mb-3">{pack.explanation}</p>

              {/* Recommended reason */}
              {pack.recommended && pack.recommendedReason && (
                <div className="mb-3 bg-green-50 border border-green-100 rounded-lg px-2.5 py-2">
                  <p className="text-[10px] text-green-700">{pack.recommendedReason}</p>
                </div>
              )}

              {/* Select button */}
              <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                isSelected ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
              }`}>
                {isSelected ? '✓ Selected' : 'Tap to select'}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default SituationPacks;
