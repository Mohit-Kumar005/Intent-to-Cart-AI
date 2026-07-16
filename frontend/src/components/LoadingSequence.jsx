import React, { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';

const steps = [
  { label: 'Analyzing your situation...', icon: '🧠', delay: 300 },
  { label: 'Subject detected', icon: '🎯', delay: 900 },
  { label: 'Situation identified', icon: '📍', delay: 1600 },
  { label: 'Cart generated', icon: '🛒', delay: 2300 },
  { label: 'Cart optimized', icon: '⚡', delay: 3000 },
  { label: 'Smart packs prepared', icon: '📦', delay: 3700 }
];

function LoadingSequence() {
  const [completedSteps, setCompletedSteps] = useState([]);

  useEffect(() => {
    const timers = steps.map((step, index) =>
      setTimeout(() => {
        setCompletedSteps(prev => [...prev, index]);
      }, step.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  const activeStep = completedSteps.length < steps.length ? completedSteps.length : steps.length - 1;

  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
      <div className="w-full max-w-md">

        {/* Spinner */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-amazon-orange/30 rounded-full animate-spin border-t-amazon-orange" />
            <div className="absolute inset-0 flex items-center justify-center text-2xl">
              {steps[activeStep]?.icon || '🧠'}
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-2">
          {steps.map((step, idx) => {
            const isDone = completedSteps.includes(idx);
            const isActive = idx === completedSteps.length;
            return (
              <div
                key={idx}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-500 ${
                  isDone
                    ? 'bg-green-50 border-green-200'
                    : isActive
                    ? 'bg-blue-50 border-blue-200 animate-pulse'
                    : 'bg-gray-50 border-gray-100 opacity-50'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                ) : isActive ? (
                  <div className="w-5 h-5 rounded-full border-2 border-blue-400 border-t-blue-600 animate-spin flex-shrink-0" />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-gray-300 flex-shrink-0" />
                )}
                <span className={`text-sm font-medium ${
                  isDone ? 'text-green-700' : isActive ? 'text-blue-700' : 'text-gray-400'
                }`}>
                  {isDone ? `✓ ${step.label}` : step.label}
                </span>
              </div>
            );
          })}
        </div>

        <p className="text-center text-sm text-gray-500 mt-6 animate-pulse">
          Preparing your results...
        </p>
      </div>
    </div>
  );
}

export default LoadingSequence;
