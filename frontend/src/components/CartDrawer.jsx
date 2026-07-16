import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingCart, Truck, CreditCard } from 'lucide-react';
import { handleImageError } from '../utils/productImage';

function CartDrawer({ open, items, onClose, onInc, onDec, onRemove, onCheckout }) {
  const subtotal = items.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const totalUnits = items.reduce((sum, p) => sum + p.quantity, 0);
  const deliveryFee = subtotal > 499 || subtotal === 0 ? 0 : 29;
  const total = subtotal + deliveryFee;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 z-50 transition-opacity ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-gray-50 z-50 shadow-2xl flex flex-col transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 gradient-bg text-white flex-shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            <h2 className="font-bold">Your Cart ({totalUnits})</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 transition-all" aria-label="Close cart">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 text-center">
              <ShoppingCart className="w-12 h-12 mb-3" />
              <p className="font-medium text-gray-600">Your cart is empty</p>
              <p className="text-xs mt-1">Add products or build a smart cart to get started.</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-3 bg-white rounded-xl border border-gray-200 p-3">
                <img
                  src={item.image}
                  alt={item.name}
                  onError={handleImageError(item.category, item.name)}
                  className="w-16 h-16 rounded-lg object-cover bg-gray-50 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 line-clamp-2">{item.name}</p>
                  <p className="text-[11px] text-gray-400">{item.category}</p>
                  <div className="flex items-center justify-between mt-2">
                    {/* Qty stepper */}
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button onClick={() => onDec(item.id)} className="px-2 py-1 hover:bg-gray-100" aria-label="Decrease">
                        <Minus className="w-3 h-3 text-gray-600" />
                      </button>
                      <span className="px-2.5 text-sm font-semibold text-gray-800">{item.quantity}</span>
                      <button onClick={() => onInc(item.id)} className="px-2 py-1 hover:bg-gray-100" aria-label="Increase">
                        <Plus className="w-3 h-3 text-gray-600" />
                      </button>
                    </div>
                    <span className="text-sm font-bold text-amazon-blue">₹{item.price * item.quantity}</span>
                  </div>
                </div>
                <button onClick={() => onRemove(item.id)} className="self-start p-1 hover:bg-red-50 rounded-lg" aria-label="Remove">
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer / summary */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 bg-white p-4 flex-shrink-0 space-y-3">
            <div className="flex items-center gap-2 bg-green-50 rounded-lg p-2.5 border border-green-100">
              <Truck className="w-4 h-4 text-green-600 flex-shrink-0" />
              <p className="text-xs font-medium text-green-700">Delivery in 10–15 minutes</p>
            </div>

            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span><span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee</span>
                {deliveryFee === 0 ? <span className="text-green-600 font-medium">FREE</span> : <span>₹{deliveryFee}</span>}
              </div>
              <div className="flex justify-between font-bold text-base text-amazon-blue pt-1 border-t">
                <span>Total</span><span>₹{total}</span>
              </div>
            </div>

            <button
              onClick={onCheckout}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl amazon-gradient text-white font-bold text-sm hover:shadow-lg active:scale-[0.98] transition-all"
            >
              <CreditCard className="w-4 h-4" />
              Checkout — ₹{total}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

export default CartDrawer;
