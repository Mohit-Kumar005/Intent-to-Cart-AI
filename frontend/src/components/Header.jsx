import React, { useState, useEffect } from 'react';
import { Zap, Search, ShoppingCart, MapPin, Sparkles } from 'lucide-react';

function Header({
  onReset,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onSmartSearch,
  cartCount = 0,
  onCartClick,
  categories = [],
  activeCategory = 'All',
  onCategorySelect
}) {
  const [localQuery, setLocalQuery] = useState(searchQuery || '');

  useEffect(() => { setLocalQuery(searchQuery || ''); }, [searchQuery]);

  const handleChange = (value) => {
    setLocalQuery(value);
    onSearchChange?.(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (localQuery.trim()) onSearchSubmit?.(localQuery.trim());
  };

  return (
    <header className="sticky top-0 z-40 shadow-lg">
      {/* ── MAIN NAV BAR ── */}
      <div className="gradient-bg text-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-2.5">

          {/* MOBILE: stacked rows  |  DESKTOP: single flex row */}
          <div className="flex flex-wrap md:flex-nowrap items-center gap-2 md:gap-4 lg:gap-6">

            {/* Row 1 on mobile: Logo + spacer + Cart */}
            {/* On desktop: all in one row */}

            {/* LEFT: Brand */}
            <button
              onClick={onReset}
              className="flex items-center gap-2 flex-shrink-0 hover:opacity-90 transition-opacity"
            >
              <div className="w-8 h-8 md:w-9 md:h-9 amazon-gradient rounded-lg flex items-center justify-center shadow-md">
                <Zap className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <div className="text-left leading-tight">
                <h1 className="text-sm md:text-base lg:text-lg font-bold tracking-tight">Intent-to-Cart</h1>
                <p className="hidden sm:block text-[10px] text-gray-300 -mt-0.5">Quick Commerce</p>
              </div>
            </button>

            {/* Deliver-to — desktop only */}
            <div className="hidden lg:flex items-center gap-1.5 flex-shrink-0 text-gray-200 hover:text-white cursor-default">
              <MapPin className="w-4 h-4" />
              <div className="leading-tight">
                <p className="text-[10px] text-gray-400">Deliver in</p>
                <p className="text-xs font-bold">10–15 mins</p>
              </div>
            </div>

            {/* Spacer pushes Cart to right on mobile */}
            <div className="flex-1 md:hidden" />

            {/* RIGHT: Cart — visible in Row 1 on mobile */}
            <button
              onClick={onCartClick}
              className="relative flex items-center gap-1 flex-shrink-0 px-2 py-1.5 rounded-lg hover:bg-white/10 transition-all md:order-last"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 min-w-[16px] h-[16px] md:min-w-[18px] md:h-[18px] px-1 rounded-full bg-amazon-orange text-amazon-darkBlue text-[10px] md:text-[11px] font-bold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden lg:inline text-sm font-semibold">Cart</span>
            </button>

            {/* CENTER: Search bar — full width on mobile (Row 2), flex-1 on desktop */}
            <form onSubmit={handleSubmit} className="w-full md:w-auto md:flex-1 md:max-w-3xl order-last md:order-none">
              <div className="flex items-stretch rounded-lg overflow-hidden bg-white shadow-sm focus-within:ring-2 focus-within:ring-amazon-orange">
                <input
                  type="text"
                  value={localQuery}
                  onChange={(e) => handleChange(e.target.value)}
                  placeholder="Search or describe a situation…"
                  className="flex-1 min-w-0 px-3 md:px-4 py-2 md:py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
                />
                {localQuery.trim() && (
                  <button
                    type="button"
                    onClick={() => onSmartSearch?.(localQuery.trim())}
                    title="Build a smart cart from your situation"
                    className="hidden sm:flex items-center gap-1.5 px-3 bg-amazon-blue/90 text-white text-xs font-semibold hover:bg-amazon-blue transition-colors border-l border-white/10"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amazon-orange" />
                    Smart Cart
                  </button>
                )}
                <button
                  type="submit"
                  className="flex items-center justify-center px-3 md:px-4 amazon-gradient text-white hover:brightness-105 transition-all"
                  aria-label="Search"
                >
                  <Search className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* ── CATEGORY STRIP ── */}
      {categories.length > 0 && (
        <div className="bg-amazon-lightBlue text-white">
          <div className="max-w-7xl mx-auto px-4 lg:px-6">
            <div className="flex items-center gap-1 overflow-x-auto scroll-hidden py-1.5">
              {['All', ...categories].map((cat) => (
                <button
                  key={cat}
                  onClick={() => onCategorySelect?.(cat)}
                  className={`whitespace-nowrap px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    activeCategory === cat
                      ? 'bg-amazon-orange text-amazon-darkBlue'
                      : 'text-gray-200 hover:bg-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
