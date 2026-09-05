import React, { useState } from 'react';
import { 
  Database, 
  Flame, 
  Snowflake, 
  Archive, 
  Clock, 
  AlertTriangle, 
  Zap 
} from 'lucide-react';

type Tier = 'hot' | 'cool' | 'cold' | 'archive';

export const StorageTiersSimulator: React.FC = () => {
  const [currentTier, setCurrentTier] = useState<Tier>('hot');
  const [rehydrating, setRehydrating] = useState<boolean>(false);
  const [rehydrateMode, setRehydrateMode] = useState<'standard' | 'high'>('standard');
  const [simulatedDay, setSimulatedDay] = useState<number>(0);

  const setTierWithDay = (tier: Tier, day: number) => {
    setCurrentTier(tier);
    setSimulatedDay(day);
    setRehydrating(false);
  };

  const triggerRehydrate = (mode: 'standard' | 'high') => {
    setRehydrateMode(mode);
    setRehydrating(true);
  };

  return (
    <div className="bg-slate-900/95 p-5 lg:p-6 rounded-2xl border border-amber-500/30 my-4 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-sm uppercase tracking-wider">
          <Database className="w-5 h-5 animate-pulse" />
          <span>Blob Storage Lifecycle & Rehydration Simulator</span>
        </div>
        <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-full border border-slate-800">
          Domain 2: Storage Cost Optimization
        </span>
      </div>

      {/* Lifecycle Timeline Selector */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>Automated Lifecycle Policy Timeline:</span>
          <span>Simulated Age: <strong className="text-white">{simulatedDay} Days</strong></span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            onClick={() => setTierWithDay('hot', 0)}
            className={`p-3 rounded-xl border text-left transition ${
              currentTier === 'hot'
                ? 'bg-red-950/70 border-red-500 text-red-200 ring-2 ring-red-500/20 shadow-lg'
                : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 text-slate-400'
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold text-xs text-red-400">
              <Flame className="w-4 h-4 text-red-400" />
              <span>Hot Tier</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-1">Day 0 (Immediate)</div>
          </button>

          <button
            onClick={() => setTierWithDay('cool', 30)}
            className={`p-3 rounded-xl border text-left transition ${
              currentTier === 'cool'
                ? 'bg-sky-950/70 border-sky-500 text-sky-200 ring-2 ring-sky-500/20 shadow-lg'
                : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 text-slate-400'
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold text-xs text-sky-400">
              <Snowflake className="w-4 h-4 text-sky-400" />
              <span>Cool Tier</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-1">Day 30 (Min 30d)</div>
          </button>

          <button
            onClick={() => setTierWithDay('cold', 90)}
            className={`p-3 rounded-xl border text-left transition ${
              currentTier === 'cold'
                ? 'bg-cyan-950/70 border-cyan-500 text-cyan-200 ring-2 ring-cyan-500/20 shadow-lg'
                : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 text-slate-400'
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold text-xs text-cyan-300">
              <Snowflake className="w-4 h-4 text-cyan-300" />
              <span>Cold Tier</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-1">Day 90 (Min 90d)</div>
          </button>

          <button
            onClick={() => setTierWithDay('archive', 180)}
            className={`p-3 rounded-xl border text-left transition ${
              currentTier === 'archive'
                ? 'bg-purple-950/70 border-purple-500 text-purple-200 ring-2 ring-purple-500/20 shadow-lg'
                : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 text-slate-400'
            }`}
          >
            <div className="flex items-center gap-1.5 font-bold text-xs text-purple-400">
              <Archive className="w-4 h-4 text-purple-400" />
              <span>Archive Tier</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-1">Day 180 (Min 180d)</div>
          </button>
        </div>
      </div>

      {/* Tier Metrics & Live Cost Breakdown */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          {/* Storage Cost Bar */}
          <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800 space-y-1.5">
            <div className="flex justify-between text-slate-400">
              <span>Storage Cost ($/GB):</span>
              <span className="font-bold text-white">
                {currentTier === 'hot' && 'High ($0.018)'}
                {currentTier === 'cool' && 'Lower ($0.010)'}
                {currentTier === 'cold' && 'Very Low ($0.0036)'}
                {currentTier === 'archive' && 'Lowest ($0.00099)'}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div 
                className="h-full bg-amber-400 transition-all duration-500 rounded-full"
                style={{
                  width: currentTier === 'hot' ? '100%' : currentTier === 'cool' ? '55%' : currentTier === 'cold' ? '20%' : '6%'
                }}
              />
            </div>
          </div>

          {/* Access / Read Cost Bar */}
          <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800 space-y-1.5">
            <div className="flex justify-between text-slate-400">
              <span>Data Retrieval Cost:</span>
              <span className="font-bold text-white">
                {currentTier === 'hot' && 'Lowest (Free/cheap)'}
                {currentTier === 'cool' && 'Moderate ($0.01/GB)'}
                {currentTier === 'cold' && 'Higher ($0.03/GB)'}
                {currentTier === 'archive' && 'Highest ($0.02+/GB)'}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div 
                className="h-full bg-rose-400 transition-all duration-500 rounded-full"
                style={{
                  width: currentTier === 'hot' ? '5%' : currentTier === 'cool' ? '30%' : currentTier === 'cold' ? '65%' : '100%'
                }}
              />
            </div>
          </div>

          {/* Retrieval Latency */}
          <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800 space-y-1.5">
            <div className="flex justify-between text-slate-400">
              <span>Read Latency:</span>
              <span className="font-bold text-white">
                {currentTier === 'archive' ? 'Hours (Offline)' : 'Milliseconds (Online)'}
              </span>
            </div>
            <div className="text-[11px] text-emerald-400 font-bold flex items-center gap-1 mt-1">
              <Clock className="w-3.5 h-3.5" />
              <span>
                {currentTier === 'hot' && 'Instant (ms)'}
                {currentTier === 'cool' && 'Instant (ms)'}
                {currentTier === 'cold' && 'Instant (ms)'}
                {currentTier === 'archive' && 'Requires Rehydration!'}
              </span>
            </div>
          </div>
        </div>

        {/* Archive Rehydration Simulation Panel */}
        {currentTier === 'archive' && (
          <div className="p-4 rounded-xl border border-purple-800/80 bg-purple-950/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
                <Zap className="w-4 h-4 text-purple-400" />
                <span>Simulate Archive Rehydration:</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">
                Blob status: <strong className="text-purple-300">Offline (Unreadable until rehydrated)</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => triggerRehydrate('standard')}
                className={`p-3 rounded-lg border text-left transition ${
                  rehydrating && rehydrateMode === 'standard'
                    ? 'bg-purple-900/80 border-purple-400 ring-2 ring-purple-400/40 text-white'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="text-xs font-bold flex items-center justify-between">
                  <span>Standard Priority Rehydration</span>
                  <span className="text-[9px] bg-slate-800 px-1.5 py-0.5 rounded font-mono">Lower Cost</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Rehydrates blob within <strong>up to 15 hours</strong>. Used for planned batch jobs.
                </p>
              </button>

              <button
                onClick={() => triggerRehydrate('high')}
                className={`p-3 rounded-lg border text-left transition ${
                  rehydrating && rehydrateMode === 'high'
                    ? 'bg-indigo-900/80 border-indigo-400 ring-2 ring-indigo-400/40 text-white'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="text-xs font-bold flex items-center justify-between">
                  <span>High Priority Rehydration</span>
                  <span className="text-[9px] bg-indigo-900 text-indigo-200 px-1.5 py-0.5 rounded font-mono">Urgent</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Rehydrates blob in <strong>under 1 hour</strong> (for blobs &lt; 10 GB). Higher cost.
                </p>
              </button>
            </div>

            {rehydrating && (
              <div className="p-3 bg-slate-900 rounded-lg border border-purple-500/50 text-xs text-purple-200 flex items-center justify-between animate-pulse">
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-400" />
                  <span>
                    Rehydrating blob using <strong>{rehydrateMode.toUpperCase()}</strong> priority... Target destination: Hot Tier.
                  </span>
                </span>
                <button
                  onClick={() => setTierWithDay('hot', 0)}
                  className="px-2.5 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white font-bold text-[10px] transition"
                >
                  Complete Rehydration &rarr;
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* AZ-104 Early Deletion Penalty Alert */}
      <div className="p-3.5 rounded-xl border border-amber-800/50 bg-amber-950/30 text-amber-200 text-xs leading-relaxed flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">AZ-104 Exam Trap (Early Deletion Penalty):</strong>{' '}
          Each tier has a strict minimum retention duration:
          <ul className="list-disc list-inside mt-1 font-mono text-[11px] space-y-0.5">
            <li><strong>Cool:</strong> 30 days minimum</li>
            <li><strong>Cold:</strong> 90 days minimum</li>
            <li><strong>Archive:</strong> 180 days minimum</li>
          </ul>
          If an exam question asks: <em>"A blob is moved to Cool and deleted 10 days later. How many days are billed?"</em> &rarr; 
          The answer is <strong>30 days total</strong> (10 days storage + 20 days early-deletion penalty fee)!
        </div>
      </div>
    </div>
  );
};
