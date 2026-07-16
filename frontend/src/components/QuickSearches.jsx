import React from 'react';

// Quick searches shown directly below the search box.
// Clicking one runs the AI "smart cart" flow for that situation.
const quickSearches = [
  { label: 'Baby Care', emoji: '👶', query: 'My baby has a high fever and needs medicine' },
  { label: 'Guests Arriving', emoji: '🎉', query: 'Friends coming over in 30 mins, need snacks and drinks' },
  { label: 'Movie Night', emoji: '🎬', query: 'Setting up for movie night, need snacks' },
  { label: 'Study Session', emoji: '📚', query: 'Exam tomorrow, need coffee and stationery' },
  { label: 'Pet Care', emoji: '🐶', query: 'Ran out of dog food' },
  { label: 'Power Cut', emoji: '⚡', query: 'Power cut at home, need candles and flashlight' },
  { label: 'Rainy Day', emoji: '🌧️', query: "It's raining and I need to go out" },
  { label: 'First Aid', emoji: '🩹', query: 'I cut my finger and need first aid supplies' }
];

function QuickSearches({ onSelect }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto scroll-hidden">
      <span className="text-xs font-semibold text-gray-500 flex-shrink-0">Quick searches:</span>
      <div className="flex items-center gap-2">
        {quickSearches.map((item) => (
          <button
            key={item.label}
            onClick={() => onSelect(item.query)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 bg-white text-xs font-medium text-gray-700 whitespace-nowrap hover:border-amazon-orange hover:bg-orange-50 hover:text-amazon-blue transition-all shadow-sm"
          >
            <span>{item.emoji}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default QuickSearches;
