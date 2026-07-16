import React from 'react';

const DIMENSION_ICONS = {
  intent: '🎯',
  availability: '📦',
  budget: '💰',
  delivery: '🚚'
};

const DIMENSION_LABELS = {
  intent: 'Intent Match',
  availability: 'Availability',
  budget: 'Budget Fit',
  delivery: 'Delivery Speed'
};

const DIMENSION_WEIGHTS = {
  intent: '40%',
  availability: '30%',
  budget: '20%',
  delivery: '10%'
};

function ScoreBreakdownTooltip({ breakdown }) {
  if (!breakdown) return null;

  // Order: intent → availability → budget → delivery (highest weight first)
  const orderedKeys = ['intent', 'availability', 'budget', 'delivery'];
  const entries = orderedKeys
    .filter(key => breakdown[key])
    .map(key => [key, breakdown[key]]);

  const finalScore = entries.reduce((sum, [, item]) => sum + (item.score || 0), 0);

  return (
    <div className="absolute z-30 right-0 mt-2 w-80 rounded-2xl border border-gray-200 bg-white p-4 shadow-2xl">
      <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-1">
        Cart Health Score Breakdown
      </p>
      <p className="text-[10px] text-gray-400 mb-3">
        Weighted: Intent Match 40% · Availability 30% · Budget 20% · Delivery 10%
      </p>

      <div className="space-y-3">
        {entries.map(([key, item]) => {
          const pct = item.percentage ?? Math.round((item.score / (item.max || 40)) * 100);
          return (
            <div key={key}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="font-semibold text-gray-700 flex items-center gap-1.5">
                  <span>{DIMENSION_ICONS[key] || '•'}</span>
                  <span>{DIMENSION_LABELS[key] || item.label || key}</span>
                  <span className="text-[10px] text-gray-400 font-normal">({DIMENSION_WEIGHTS[key] || ''})</span>
                </span>
                <span className="font-bold text-amazon-blue tabular-nums">
                  {pct}%
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 mb-1">
                <div
                  className="bg-amazon-orange h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">{item.reason || item.explanation}</p>
                <span className="text-[10px] text-gray-400 font-mono ml-2 flex-shrink-0">+{item.score}/{item.max}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
        <span className="text-sm font-bold text-gray-700">Final Score</span>
        <span className="text-sm font-bold text-amazon-blue">{Math.min(100, finalScore)}/100</span>
      </div>
    </div>
  );
}

export default ScoreBreakdownTooltip;
