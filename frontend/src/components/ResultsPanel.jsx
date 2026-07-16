import React, { useState } from 'react';
import { Brain, ShoppingCart, Clock, Sparkles, ArrowRight, BadgeInfo, RefreshCw, CheckCircle2, ChevronDown } from 'lucide-react';
import ProductCard from './ProductCard';
import CartSummary from './CartSummary';
import SituationPacks from './SituationPacks';
import ScoreBreakdownTooltip from './ScoreBreakdownTooltip';
import CartHealthBadge from './CartHealthBadge';
import MissingEssentials from './MissingEssentials';

function ResultsPanel({ intentResult, optimizationResult, zeroDecisionResult, selectedPackId, cartProducts, journeyStep, onAdvanceStage, onRemoveProduct, onCheckout, onReset, onSelectPack, userInput }) {
  const [showScoreBreakdown, setShowScoreBreakdown] = useState(false);
  const [openReasons, setOpenReasons] = useState(new Set());
  const { intent, reasoning, cart, subjectDetection } = intentResult;

  const optimizedTotal = optimizationResult?.optimized_cart?.reduce((sum, product) => sum + product.price, 0) ?? cartProducts.reduce((sum, product) => sum + product.price, 0);
  const originalTotal = optimizationResult?.original_cart?.reduce((sum, product) => sum + product.price, 0) ?? optimizedTotal;
  const savings = Math.max(0, originalTotal - optimizedTotal);
  const activePack = zeroDecisionResult?.packs?.find(pack => pack.id === selectedPackId) || zeroDecisionResult?.packs?.[0];

  const stageOrder = ['analysis', 'cart', 'optimization', 'packs', 'checkout'];
  const isStageReady = (stage) => stageOrder.indexOf(journeyStep) >= stageOrder.indexOf(stage);

  const urgencyColors = {
    Critical: 'bg-red-100 text-red-700 border-red-200',
    High: 'bg-orange-100 text-orange-700 border-orange-200',
    Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Low: 'bg-green-100 text-green-700 border-green-200'
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-amazon-blue flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm font-bold">U</span>
        </div>
        <div className="bg-white rounded-2xl rounded-tl-md px-5 py-3 shadow-sm border border-gray-100 max-w-[85%]">
          <p className="text-gray-800 font-medium">{userInput}</p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full amazon-gradient flex items-center justify-center flex-shrink-0">
          <Brain className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 space-y-4">
          {isStageReady('analysis') && (
            <div className="bg-white rounded-2xl rounded-tl-md p-5 shadow-sm border border-gray-100 animate-slide-up space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-amazon-orange" />
                  <span className="text-sm font-semibold text-gray-700">I understood your need</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  <div className="bg-gray-50 rounded-lg p-2.5">
                    <p className="text-[10px] uppercase text-gray-400 font-semibold">Subject</p>
                    <p className="text-sm font-bold text-amazon-blue">{subjectDetection?.subject || intent.subject}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2.5">
                    <p className="text-[10px] uppercase text-gray-400 font-semibold">Situation</p>
                    <p className="text-sm font-bold text-amazon-blue">{subjectDetection?.situation || intent.situation}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2.5">
                    <p className="text-[10px] uppercase text-gray-400 font-semibold">Urgency</p>
                    <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full border ${urgencyColors[intent.urgency] || urgencyColors.Medium}`}>{intent.urgency}</span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2.5">
                    <p className="text-[10px] uppercase text-gray-400 font-semibold">Category</p>
                    <p className="text-sm font-bold text-amazon-blue">{subjectDetection?.category || intent.type}</p>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <p className="text-xs text-blue-600 flex items-start gap-2">
                    <Brain className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                    <span><strong>AI Reasoning:</strong> {reasoning}</span>
                  </p>
                </div>
              </div>
              {journeyStep === 'analysis' && (
                <button onClick={onAdvanceStage} className="w-full rounded-xl amazon-gradient px-4 py-3 text-sm font-bold text-white">
                  Continue to Cart Generation
                </button>
              )}
            </div>
          )}

          {isStageReady('cart') && (
            <div className="bg-gradient-to-r from-amazon-orange/10 to-yellow-50 rounded-xl p-4 border border-amazon-orange/20 animate-slide-up">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-5 h-5 text-amazon-orange" />
                  <div>
                    <h3 className="font-bold text-amazon-blue">{cart.name}</h3>
                    <p className="text-xs text-gray-500">Curated just for your situation</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1.5 rounded-full">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold">{cart.estimatedNeedTime}</span>
                </div>
              </div>
            </div>
          )}

          {isStageReady('cart') && (
            <div className="space-y-3 animate-slide-up">
              <h4 className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                <span>Recommended Products ({cartProducts.length})</span>
                <ArrowRight className="w-3 h-3" />
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {cartProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} onRemove={onRemoveProduct} index={index} />
                ))}
              </div>
              {journeyStep === 'cart' && (
                <button onClick={onAdvanceStage} className="w-full rounded-xl amazon-gradient px-4 py-3 text-sm font-bold text-white">
                  Continue to Optimization
                </button>
              )}
            </div>
          )}

          {isStageReady('optimization') && optimizationResult && (
            <div className="bg-white rounded-2xl rounded-tl-md p-5 shadow-sm border border-gray-100 animate-slide-up space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <BadgeInfo className="w-4 h-4 text-amazon-orange" />
                  <span className="text-sm font-semibold text-gray-700">Cart Optimization Engine</span>
                </div>
                <div className="relative">
                  <button
                    onMouseEnter={() => setShowScoreBreakdown(true)}
                    onMouseLeave={() => setShowScoreBreakdown(false)}
                    className="flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-green-700 border border-green-100"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold">Score {optimizationResult.optimization_score}/100</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  {showScoreBreakdown && <ScoreBreakdownTooltip breakdown={optimizationResult.score_breakdown} />}
                </div>
              </div>
              <p className="text-sm text-gray-600">{optimizationResult.explanation}</p>
              <div className="flex flex-wrap items-center gap-2">
                <CartHealthBadge health={optimizationResult.cart_health} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className="rounded-xl bg-gray-50 p-3 border border-gray-100">
                  <p className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold">Original total</p>
                  <p className="font-bold text-gray-800">₹{originalTotal}</p>
                </div>
                <div className="rounded-xl bg-gray-50 p-3 border border-gray-100">
                  <p className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold">Optimized total</p>
                  <p className="font-bold text-gray-800">₹{optimizedTotal}</p>
                </div>
                <div className="rounded-xl bg-gray-50 p-3 border border-gray-100">
                  <p className="text-[10px] uppercase tracking-wide text-gray-400 font-semibold">Savings</p>
                  <p className="font-bold text-gray-800">₹{savings}</p>
                </div>
              </div>
              {optimizationResult.changes_made?.length > 0 ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <RefreshCw className="w-4 h-4 text-amazon-orange" />
                    <span>Changes made</span>
                  </div>
                  <div className="space-y-2">
                    {optimizationResult.changes_made.map((change, index) => (
                      <div key={`${change.type}-${index}`} className="rounded-xl border border-orange-100 bg-orange-50/60 p-3">
                        <button
                          onClick={() => setOpenReasons(prev => {
                            const next = new Set(prev);
                            if (next.has(index)) next.delete(index); else next.add(index);
                            return next;
                          })}
                          className="flex w-full items-center justify-between gap-3 text-left"
                        >
                          <div>
                            <p className="text-sm font-medium text-gray-800">{change.reason}</p>
                            <p className="text-xs text-gray-500 mt-1">{change.from?.name || 'Item'} {change.to ? `→ ${change.to.name}` : '— no replacement available'}</p>
                          </div>
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        </button>
                        {openReasons.has(index) && (
                          <div className="mt-3 rounded-lg bg-white p-3 border border-orange-100 text-xs text-gray-600">
                            <strong>Why this item?</strong>
                            <p className="mt-1">{change.to?.optimizedReason || change.reason}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-500">No optimization changes required.</p>
              )}
              {journeyStep === 'optimization' && (
                <button onClick={onAdvanceStage} className="w-full rounded-xl amazon-gradient px-4 py-3 text-sm font-bold text-white">
                  Continue to Pack Generation
                </button>
              )}
            </div>
          )}

          {isStageReady('packs') && zeroDecisionResult && (
            <div className="bg-white rounded-2xl rounded-tl-md p-5 shadow-sm border border-gray-100 animate-slide-up space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amazon-orange" />
                <span className="text-sm font-semibold text-gray-700">Zero-Decision Shopping Engine</span>
              </div>
              <p className="text-sm text-gray-600">{zeroDecisionResult.explanation}</p>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Mission</span>
                <span className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-bold text-amazon-orange border border-orange-100">{zeroDecisionResult.scenario.missionName}</span>
              </div>
              <SituationPacks packs={zeroDecisionResult.packs} selectedPackId={selectedPackId} onSelectPack={onSelectPack} />
              {zeroDecisionResult.packs?.some(pack => pack.recommended) && (
                <p className="text-xs text-green-700 font-medium">
                  Recommended pack is the highest-scoring option by optimization score and value.
                </p>
              )}
              {journeyStep === 'packs' && (
                <button onClick={onAdvanceStage} className="w-full rounded-xl amazon-gradient px-4 py-3 text-sm font-bold text-white">
                  Continue to Checkout
                </button>
              )}
            </div>
          )}

          {journeyStep === 'checkout' && cartProducts.length > 0 && (
            <CartSummary products={cartProducts} onCheckout={onCheckout} onReset={onReset} />
          )}
        </div>
      </div>
    </div>
  );
}

export default ResultsPanel;
