import React from 'react';
import { MessageSquare, Brain, ShoppingCart, Truck } from 'lucide-react';

const steps = [
  { icon: MessageSquare, title: "Describe Your Need", description: "Type what's happening. No product names needed.", color: "text-blue-500 bg-blue-50" },
  { icon: Brain, title: "AI Understands", description: "Amazon Bedrock analyzes your intent and context.", color: "text-purple-500 bg-purple-50" },
  { icon: ShoppingCart, title: "Instant Cart", description: "Get an optimized cart and ready-made situation packs.", color: "text-amazon-orange bg-orange-50" },
  { icon: Truck, title: "Zero-Decision Checkout", description: "Pick a pack or checkout in one tap. At your door in minutes.", color: "text-green-500 bg-green-50" }
];

function HowItWorks() {
  return (
    <div className="py-8 border-t border-gray-200">
      <h3 className="text-center text-lg font-bold text-amazon-blue mb-6">How Intent-to-Cart Works</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {steps.map((step, index) => (
          <div key={index} className="text-center">
            <div className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-3 ${step.color}`}>
              <step.icon className="w-6 h-6" />
            </div>
            <h4 className="font-semibold text-sm text-gray-800 mb-1">{step.title}</h4>
            <p className="text-xs text-gray-500">{step.description}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amazon-blue/5 rounded-full">
          <span className="text-xs font-medium text-amazon-blue">Powered by</span>
          <span className="text-xs font-bold text-amazon-orange">Amazon Bedrock (Claude)</span>
        </div>
      </div>
    </div>
  );
}

export default HowItWorks;
