import React, { useEffect, useState } from 'react';
import { Package, Truck, CheckCircle2 } from 'lucide-react';

const stages = [
  { label: 'Packing', icon: Package, color: 'green' },
  { label: 'Out For Delivery', icon: Truck, color: 'blue' },
  { label: 'Delivered', icon: CheckCircle2, color: 'green' }
];

// Demo simulation: 0-20s → Packing, 20-40s → Out For Delivery, 40-60s → Delivered
const STAGE_DURATION_MS = 20000;

function DeliveryProgress() {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    if (stageIndex >= stages.length - 1) return;
    const timer = setTimeout(() => {
      setStageIndex(prev => Math.min(prev + 1, stages.length - 1));
    }, STAGE_DURATION_MS);
    return () => clearTimeout(timer);
  }, [stageIndex]);

  return (
    <div>
      <div className="flex items-center justify-between gap-1 mb-2">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          const done = idx <= stageIndex;
          const active = idx === stageIndex;

          return (
            <React.Fragment key={stage.label}>
              <div className={`flex-1 flex flex-col items-center gap-1.5 px-2 py-2 rounded-xl text-center transition-all ${
                done
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-400'
              } ${active ? 'ring-2 ring-green-300 animate-pulse' : ''}`}>
                <Icon className={`w-4 h-4 ${done ? 'text-green-600' : 'text-gray-400'}`} />
                <span className="text-[10px] font-semibold leading-tight">{stage.label}</span>
              </div>
              {idx < stages.length - 1 && (
                <div className={`w-6 h-0.5 rounded-full flex-shrink-0 ${idx < stageIndex ? 'bg-green-500' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
      <p className="text-[10px] text-gray-400 text-center mt-1">Live demo simulation</p>
    </div>
  );
}

export default DeliveryProgress;
