import React from 'react';
import { CheckCircle, Truck, Clock, Package, Star } from 'lucide-react';
import DeliveryProgress from './DeliveryProgress';

function OrderConfirmation({ orderInfo, onReset }) {
  const {
    orderId,
    missionName,
    selectedPackTier,
    products = [],
    totals = {},
    estimatedDelivery = '10-15 mins'
  } = orderInfo;

  const displayTotal = totals.total ?? products.reduce((s, p) => s + p.price, 0);

  return (
    <div className="flex flex-col items-center py-10 animate-fade-in">
      {/* Success Icon */}
      <div className="relative mb-6">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-bounce-in">
          <CheckCircle className="w-14 h-14 text-green-500" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-amazon-blue mb-2">Order Confirmed!</h2>
      <p className="text-gray-600 text-center mb-6 max-w-md">
        Your <strong>{missionName || 'Shopping Mission'}</strong> is being prepared
        and will arrive at your doorstep shortly.
      </p>

      {/* Order Details Card */}
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-200 p-6 shadow-lg mb-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <span className="text-sm text-gray-500">Order ID</span>
            <span className="font-mono font-bold text-sm text-amazon-blue">{orderId}</span>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <span className="text-sm text-gray-500">Mission</span>
            <span className="font-semibold text-sm text-amazon-blue">{missionName || 'Shopping Mission'}</span>
          </div>

          {selectedPackTier && selectedPackTier !== 'Custom' && (
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <span className="text-sm text-gray-500">Pack Selected</span>
              <span className="flex items-center gap-1 font-semibold text-sm">
                <Star className="w-3.5 h-3.5 text-amazon-orange" />
                {selectedPackTier} Pack
              </span>
            </div>
          )}

          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <span className="text-sm text-gray-500">Items</span>
            <span className="font-semibold text-sm">{products.length} products</span>
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <span className="text-sm text-gray-500">Total Paid</span>
            <span className="font-bold text-lg text-amazon-blue">₹{displayTotal}</span>
          </div>

          {/* Delivery Timeline — only shown after order */}
          <div className="bg-green-50 rounded-xl p-4 border border-green-100">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-green-600" />
                <span className="font-bold text-green-700 text-sm">On the way!</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-green-600" />
                <span className="text-xs font-bold text-green-600">ETA: {estimatedDelivery}</span>
              </div>
            </div>
            {/* DeliveryProgress only renders here, post-checkout */}
            <DeliveryProgress />
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="w-full max-w-md mb-6">
        <h4 className="text-sm font-semibold text-gray-500 mb-3 flex items-center gap-2">
          <Package className="w-4 h-4" />
          Items in your order
        </h4>
        <div className="space-y-2">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between bg-white rounded-lg p-3 border border-gray-100 shadow-sm"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-700">{product.name}</span>
              </div>
              <span className="text-sm font-bold text-gray-600">₹{product.price}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={onReset}
        className="amazon-gradient text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
      >
        Need Something Else?
      </button>
    </div>
  );
}

export default OrderConfirmation;
