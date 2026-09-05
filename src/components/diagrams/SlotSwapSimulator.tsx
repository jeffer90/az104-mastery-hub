import React, { useState } from 'react';
import { 
  ArrowRightLeft, 
  CheckCircle2, 
  Globe, 
  Pin, 
  Sparkles, 
  AlertTriangle, 
  Server, 
  Users 
} from 'lucide-react';

export const SlotSwapSimulator: React.FC = () => {
  const [swapped, setSwapped] = useState<boolean>(false);
  const [isSwapping, setIsSwapping] = useState<boolean>(false);
  const [swapPhase, setSwapPhase] = useState<number>(0); // 0: Idle, 1: Warm-up, 2: VIP Routing, 3: Completed

  const triggerSwap = () => {
    if (isSwapping) return;
    setIsSwapping(true);
    setSwapPhase(1);

    // Phase 1: Warmup (1.2s)
    setTimeout(() => {
      setSwapPhase(2);
      // Phase 2: DNS/VIP Flip (1.2s)
      setTimeout(() => {
        setSwapped(!swapped);
        setSwapPhase(3);
        // Phase 3: Completed
        setTimeout(() => {
          setIsSwapping(false);
          setSwapPhase(0);
        }, 1200);
      }, 1200);
    }, 1200);
  };

  const prodVersion = swapped ? 'v2.0 (New Release)' : 'v1.0 (Live Baseline)';
  const stagingVersion = swapped ? 'v1.0 (Previous Stable)' : 'v2.0 (Release Candidate)';

  return (
    <div className="bg-slate-900/95 p-5 lg:p-6 rounded-2xl border border-emerald-500/30 my-4 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase tracking-wider">
          <Globe className="w-5 h-5 animate-pulse" />
          <span>App Service Deployment Slot Swap Simulator</span>
        </div>
        <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-full border border-slate-800">
          Zero-Downtime Releases (PaaS)
        </span>
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
        <div>
          <span className="text-xs font-bold text-white block">Interactive Slot Swap Action:</span>
          <span className="text-[11px] text-slate-400">
            {isSwapping && swapPhase === 1 && 'Step 1/2: Waking up Staging instance & checking /healthcheck (200 OK)...'}
            {isSwapping && swapPhase === 2 && 'Step 2/2: Instant virtual router flip. Zero dropped packets!'}
            {isSwapping && swapPhase === 3 && 'Swap successfully completed!'}
            {!isSwapping && 'Ready. Click Swap to simulate production deployment.'}
          </span>
        </div>

        <button
          onClick={triggerSwap}
          disabled={isSwapping}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white transition shadow-lg active:scale-95 ${
            isSwapping
              ? 'bg-slate-700 cursor-not-allowed opacity-70'
              : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20'
          }`}
        >
          <ArrowRightLeft className={`w-4 h-4 ${isSwapping ? 'animate-spin' : ''}`} />
          <span>{isSwapping ? 'Swapping Slots...' : 'Trigger Slot Swap'}</span>
        </button>
      </div>

      {/* Dual Slot Visualization */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Production Slot */}
        <div className={`p-4 rounded-xl border-2 transition-all duration-500 relative ${
          swapPhase === 2
            ? 'bg-emerald-950/80 border-emerald-400 ring-4 ring-emerald-500/30'
            : 'bg-slate-950/80 border-emerald-500/60'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-extrabold font-mono text-emerald-300 uppercase">
                Production Slot (Live)
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-700 text-[10px] text-emerald-300 font-bold">
              <Users className="w-3 h-3" />
              <span>100% Traffic</span>
            </div>
          </div>

          <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-mono">Running Version:</span>
              <span className="font-bold text-white font-mono bg-slate-800 px-2 py-0.5 rounded">
                {prodVersion}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Endpoint URL:</span>
              <span className="text-cyan-400 font-mono">https://contoso.azurewebsites.net</span>
            </div>
          </div>

          {/* Sticky Settings Status */}
          <div className="mt-3 p-2.5 bg-amber-950/20 border border-amber-800/40 rounded-lg text-[11px] space-y-1">
            <div className="flex items-center gap-1.5 text-amber-300 font-bold text-[10px] uppercase">
              <Pin className="w-3 h-3" />
              <span>Sticky Settings (Anchored Here)</span>
            </div>
            <p className="text-slate-300">
              Custom Domain (<code>contoso.com</code>), Prod SSL Cert, and Prod SQL Connection String <strong>never move</strong>.
            </p>
          </div>
        </div>

        {/* Staging Slot */}
        <div className={`p-4 rounded-xl border-2 transition-all duration-500 relative ${
          swapPhase === 1
            ? 'bg-sky-950/80 border-sky-400 ring-4 ring-sky-500/30'
            : 'bg-slate-950/80 border-sky-500/40'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-extrabold font-mono text-sky-300 uppercase">
                Staging Slot (Pre-Production)
              </span>
            </div>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
              0% Traffic (Validation)
            </span>
          </div>

          <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-mono">Running Version:</span>
              <span className="font-bold text-white font-mono bg-slate-800 px-2 py-0.5 rounded">
                {stagingVersion}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Endpoint URL:</span>
              <span className="text-cyan-400 font-mono">https://contoso-staging.azurewebsites.net</span>
            </div>
          </div>

          {/* Sticky Settings Status */}
          <div className="mt-3 p-2.5 bg-sky-950/20 border border-sky-800/40 rounded-lg text-[11px] space-y-1">
            <div className="flex items-center gap-1.5 text-sky-300 font-bold text-[10px] uppercase">
              <Sparkles className="w-3 h-3" />
              <span>Warm-up Automation</span>
            </div>
            <p className="text-slate-300">
              Azure sends internal HTTP requests to warm up the ASP.NET/Node runtime so end users experience zero cold-start delay.
            </p>
          </div>
        </div>
      </div>

      {/* Swappable vs Sticky Exam Matrix */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
        <div className="text-xs font-bold text-white uppercase tracking-wider">
          AZ-104 Exam Trap: Which Settings Swap vs. Stay Sticky?
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Swappable */}
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center gap-1.5 text-blue-300 font-bold">
              <span>🔄 Settings that SWAP (Follow the Code)</span>
            </div>
            <ul className="space-y-1.5 text-slate-300 text-[11px]">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Application binaries, code, and static files</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>General App Settings (unless marked sticky)</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Runtime stack & framework version</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>WebSockets & Handler mappings</span>
              </li>
            </ul>
          </div>

          {/* Sticky */}
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center gap-1.5 text-amber-300 font-bold">
              <Pin className="w-3.5 h-3.5" />
              <span>Sticky Settings (NEVER Swap - Anchored to Slot)</span>
            </div>
            <ul className="space-y-1.5 text-slate-300 text-[11px]">
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>Custom Domain Names & SSL/TLS Certificates</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>Publishing credentials & Webhook endpoints</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>Scale & Autoscale settings</span>
              </li>
              <li className="flex items-start gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>Any App Setting with "Deployment slot setting" checked</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Exam Alert */}
      <div className="p-3.5 rounded-xl border border-emerald-800/50 bg-emerald-950/30 text-emerald-200 text-xs leading-relaxed flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">Exam Scenario Tip:</strong> If an exam question says: 
          <em> "You need to ensure the database connection string does not swap when swapping slots,"</em> the answer is:
          <strong> Check the "Deployment slot setting" checkbox on the configuration key in the Azure Portal!</strong>
        </div>
      </div>
    </div>
  );
};
