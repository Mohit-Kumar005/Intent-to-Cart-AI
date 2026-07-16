import React from 'react';

const HEALTH_CONFIG = {
  Excellent: {
    style: 'bg-green-100 text-green-700 border-green-200',
    icon: '🟢',
    range: '95-100'
  },
  Good: {
    style: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    icon: '🟡',
    range: '80-94'
  },
  Fair: {
    style: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    icon: '🟠',
    range: '60-79'
  },
  'Needs Improvement': {
    style: 'bg-red-100 text-red-700 border-red-200',
    icon: '🔴',
    range: '<60'
  }
};

function CartHealthBadge({ health, score }) {
  if (!health) return null;

  const config = HEALTH_CONFIG[health] || HEALTH_CONFIG.Fair;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${config.style}`}>
      <span>{config.icon}</span>
      Cart Health: {health}
      {score !== undefined && <span className="opacity-60">({score}/100)</span>}
    </span>
  );
}

export default CartHealthBadge;
