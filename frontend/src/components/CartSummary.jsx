import React from 'react';
import { Truck, CreditCard, RotateCcw, Package } from 'lucide-react';
import { calculateCartTotal, getEffectiveItemCount } from '../utils/cartReactive';

function CartSummary({ products, optimization, selectedPack, onCheckout, onReset }) {
  const subtotal = calculateCartTotal(products);
  const effectiveCount = getEffectiveItemCount(products);
  const deliveryFee = subtotal > 499 ? 0 : 29;
  const total = subtotal + deliveryFee;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-lg animate-slide-up">
      <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <CreditCard className="w-4 h-4 text-amazon-orange" />
        Order Summary
      </h3>

      {/* Selected Pack Badge */}
      {selectedPack && (
        <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-amazon-orange/10 rounded-lg border border-amazon-orange/20">
          <Package className="w-4 h-4 text-amazon-orange" />
          <div>
            <p className="text-xs font-semibold text-amazon-blue">
              {selectedPack.title} · {selectedPack.missionName || selectedPack.scenarioKey}
            </p>
            <p className="text-[10px] text-gray-500">{products.length} items selected</p>
          </div>
        </div>
      )}

      {/* Price Breakdown */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Subtotal ({effectiveCount} items)</span>
          <span>₹{subtotal}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Delivery Fee</span>
          {deliveryFee === 0
            ? <span className="text-green-600 font-medium">FREE</span>
            : <span>₹{deliveryFee}</span>
          }
        </div>
        {deliveryFee === 0 && (
          <p className="text-[10px] text-green-600 text-right">Free delivery on orders above ₹499</p>
        )}
        <div className="border-t pt-2 flex justify-between font-bold text-lg text-amazon-blue">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
      </div>

      {/* Delivery Info */}
      <div className="flex items-center gap-2 bg-green-50 rounded-lg p-3 mb-4 border border-green-100">
        <Truck className="w-5 h-5 text-green-600 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-green-700">Delivery in 10-15 minutes</p>
          <p className="text-[10px] text-green-600">Express delivery to your location</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onReset}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all font-medium text-sm"
        >
          <RotateCcw className="w-4 h-4" />
          Start Over
        </button>
        <button
          onClick={onCheckout}
          disabled={products.length === 0}
          className={`flex-[2] flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
            products.length > 0
              ? 'amazon-gradient text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          Order Now — ₹{total}
        </button>
      </div>
    </div>
  );
}

export default CartSummary;
