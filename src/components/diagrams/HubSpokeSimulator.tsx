import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  ShieldAlert, 
  CheckCircle2, 
  Network, 
  Flame, 
  AlertTriangle 
} from 'lucide-react';

type Scenario = 'direct-drop' | 'udr-nva';

export const HubSpokeSimulator: React.FC = () => {
  const [scenario, setScenario] = useState<Scenario>('udr-nva');
  const [step, setStep] = useState<number>(0); // 0: Idle, 1: Egress Spoke 1, 2: Inspection/Boundary, 3: Delivery/Drop
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1); // 1x or 2x

  const totalSteps = 3;

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isPlaying) {
      const interval = 2200 / speed;
      timer = setTimeout(() => {
        if (step < totalSteps) {
          setStep(prev => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, interval);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, step, speed, totalSteps]);

  const handlePlayPause = () => {
    if (step >= totalSteps) {
      setStep(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setStep(0);
  };

  const handleStepForward = () => {
    setIsPlaying(false);
    setStep(prev => (prev < totalSteps ? prev + 1 : 0));
  };

  const switchScenario = (newScenario: Scenario) => {
    setIsPlaying(false);
    setScenario(newScenario);
    setStep(0);
  };

  return (
    <div className="bg-slate-900/95 p-5 lg:p-6 rounded-2xl border border-indigo-500/30 my-4 shadow-2xl space-y-6">
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm uppercase tracking-wider">
          <Network className="w-5 h-5 text-indigo-400 animate-pulse" />
          <span>Hub-and-Spoke Traffic Flow Simulator</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-400">Simulation Speed:</span>
          <button
            onClick={() => setSpeed(speed === 1 ? 2 : 1)}
            className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 transition"
          >
            {speed}x
          </button>
        </div>
      </div>

      {/* Scenario Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={() => switchScenario('udr-nva')}
          className={`p-3 rounded-xl border text-left transition flex items-start gap-3 ${
            scenario === 'udr-nva'
              ? 'bg-indigo-950/60 border-indigo-500 shadow-lg shadow-indigo-500/20'
              : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 opacity-70'
          }`}
        >
          <div className="p-2 rounded-lg bg-emerald-950 border border-emerald-700 text-emerald-300 shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Scenario 1: With Hub NVA & UDR</span>
              <span className="text-[9px] bg-emerald-900/80 text-emerald-200 px-1.5 py-0.5 rounded font-mono font-bold">AZ-104 Recommended</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
              Spoke 1 has a UDR (10.2.0.0/16 &rarr; NVA 10.0.1.4). Packets route through Hub Firewall and deliver cleanly to Spoke 2.
            </p>
          </div>
        </button>

        <button
          onClick={() => switchScenario('direct-drop')}
          className={`p-3 rounded-xl border text-left transition flex items-start gap-3 ${
            scenario === 'direct-drop'
              ? 'bg-rose-950/60 border-rose-500 shadow-lg shadow-rose-500/20'
              : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 opacity-70'
          }`}
        >
          <div className="p-2 rounded-lg bg-rose-950 border border-rose-700 text-rose-300 shrink-0">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Scenario 2: Direct Peering Attempt</span>
              <span className="text-[9px] bg-rose-900/80 text-rose-200 px-1.5 py-0.5 rounded font-mono font-bold">Exam Trap</span>
            </div>
            <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
              No UDR configured. Spoke 1 assumes peering is transitive. Azure drops the packet at the Hub boundary!
            </p>
          </div>
        </button>
      </div>

      {/* Visual Canvas Diagram */}
      <div className="relative bg-slate-950/80 border border-slate-800/90 rounded-xl p-5 overflow-hidden">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* 3 Nodes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 items-center">
          {/* Spoke 1 */}
          <div className={`p-4 rounded-xl border transition-all duration-300 ${
            step === 0 || step === 1
              ? 'bg-slate-800/90 border-cyan-400 ring-2 ring-cyan-500/30 shadow-lg shadow-cyan-500/10'
              : 'bg-slate-900/60 border-slate-800'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/70 px-2 py-0.5 rounded border border-cyan-800">
                Spoke VNet 1
              </span>
              <span className="text-[10px] text-slate-400 font-mono">10.1.0.0/16</span>
            </div>

            <div className="mt-3 p-2.5 bg-slate-950/70 rounded-lg border border-slate-800 text-center">
              <div className="text-xs font-semibold text-slate-200">Source VM</div>
              <div className="text-[10px] font-mono text-cyan-400">10.1.1.4</div>
            </div>

            <div className="mt-3 text-[10px] p-2 rounded border leading-tight bg-slate-950 border-slate-800 text-slate-300">
              <div className="font-bold flex items-center gap-1 mb-1 text-slate-400">
                <span>Route Table:</span>
              </div>
              {scenario === 'udr-nva' ? (
                <span className="text-amber-300 font-mono">UDR: 10.2.0.0/16 &rarr; 10.0.1.4 (NVA)</span>
              ) : (
                <span className="text-rose-400 font-mono">Default System Route (No UDR)</span>
              )}
            </div>
          </div>

          {/* Hub VNet (Central) */}
          <div className={`p-4 rounded-xl border-2 transition-all duration-300 relative ${
            step === 2
              ? scenario === 'udr-nva'
                ? 'bg-indigo-950/80 border-indigo-400 ring-4 ring-indigo-500/30 shadow-2xl shadow-indigo-500/20'
                : 'bg-rose-950/60 border-rose-500 ring-4 ring-rose-500/30 shadow-2xl shadow-rose-500/20'
              : 'bg-indigo-950/30 border-indigo-800/60'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-indigo-300 bg-indigo-900/60 px-2 py-0.5 rounded border border-indigo-700">
                Hub VNet (Central)
              </span>
              <span className="text-[10px] text-slate-400 font-mono">10.0.0.0/16</span>
            </div>

            <div className="mt-3 space-y-2">
              <div className={`p-2.5 rounded-lg border text-center transition-all ${
                scenario === 'udr-nva' && step === 2
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 ring-2 ring-emerald-400/40'
                  : 'bg-slate-950/70 border-slate-800 text-slate-300'
              }`}>
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold">
                  <Flame className="w-3.5 h-3.5 text-rose-400" />
                  <span>Azure Firewall / NVA</span>
                </div>
                <div className="text-[10px] font-mono text-indigo-300 mt-0.5">IP: 10.0.1.4</div>
              </div>

              <div className="p-2 bg-slate-950/50 rounded-lg border border-slate-800/80 text-center">
                <div className="text-[11px] font-medium text-blue-300">VPN / ExpressRoute Gateway</div>
                <div className="text-[9px] text-slate-400">Gateway Transit: Enabled</div>
              </div>
            </div>

            {/* Non-Transitive Peering Barrier Alert if Scenario 2 at step 2 */}
            {scenario === 'direct-drop' && step >= 2 && (
              <div className="mt-2.5 p-2 bg-rose-950/90 border border-rose-500 rounded-lg text-[10px] text-rose-200 text-center font-bold animate-pulse">
                🚫 NON-TRANSITIVE DROP! Azure refuses to bridge Peering A to Peering B.
              </div>
            )}
          </div>

          {/* Spoke 2 */}
          <div className={`p-4 rounded-xl border transition-all duration-300 ${
            step === 3 && scenario === 'udr-nva'
              ? 'bg-slate-800/90 border-emerald-400 ring-2 ring-emerald-500/30 shadow-lg shadow-emerald-500/10'
              : 'bg-slate-900/60 border-slate-800'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-800">
                Spoke VNet 2
              </span>
              <span className="text-[10px] text-slate-400 font-mono">10.2.0.0/16</span>
            </div>

            <div className="mt-3 p-2.5 bg-slate-950/70 rounded-lg border border-slate-800 text-center">
              <div className="text-xs font-semibold text-slate-200">Destination SQL DB</div>
              <div className="text-[10px] font-mono text-emerald-400">10.2.1.4</div>
            </div>

            <div className="mt-3 text-[10px] p-2 rounded border bg-slate-950/60 border-slate-800 text-slate-300 leading-tight">
              <div className="font-bold mb-0.5 text-slate-400">Return Route:</div>
              <span className="font-mono">UDR: 10.1.0.0/16 &rarr; 10.0.1.4</span>
            </div>
          </div>
        </div>

        {/* Live Packet Flow Track */}
        <div className="mt-6 pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-mono text-slate-400 flex items-center gap-1.5">
              <span>Traffic Track:</span>
              <span className="text-white font-bold">
                10.1.1.4 &rarr; 10.2.1.4 (Port 1433)
              </span>
            </span>
            <span className="text-[11px] font-mono">
              {step === 0 && <span className="text-slate-400">Ready to simulate</span>}
              {step === 1 && <span className="text-cyan-400">Packet Egress from Spoke 1...</span>}
              {step === 2 && scenario === 'udr-nva' && <span className="text-indigo-300">Inspecting at Hub NVA (10.0.1.4)...</span>}
              {step === 2 && scenario === 'direct-drop' && <span className="text-rose-400 font-bold">DROPPED: Non-transitive peering violation</span>}
              {step === 3 && scenario === 'udr-nva' && <span className="text-emerald-400 font-bold">DELIVERED to Spoke 2!</span>}
              {step === 3 && scenario === 'direct-drop' && <span className="text-rose-500 font-bold">FAILED: Packet Lost (100% loss)</span>}
            </span>
          </div>

          {/* Animated Progress Track */}
          <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800 relative">
            <div 
              className={`h-full transition-all duration-700 rounded-full ${
                scenario === 'udr-nva'
                  ? 'bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-400'
                  : 'bg-gradient-to-r from-cyan-500 to-rose-500'
              }`}
              style={{
                width: scenario === 'direct-drop' && step >= 2 ? '50%' : `${(step / totalSteps) * 100}%`
              }}
            />
            {/* Glowing moving dot */}
            {step > 0 && (
              <div 
                className={`absolute top-0 bottom-0 w-3 h-3 rounded-full animate-ping ${
                  scenario === 'direct-drop' && step >= 2 ? 'bg-rose-500' : 'bg-white'
                }`}
                style={{
                  left: scenario === 'direct-drop' && step >= 2 ? '48%' : `${Math.min(96, Math.max(2, (step / totalSteps) * 98))}%`
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Simulator Playback Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePlayPause}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/20 active:scale-95"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" /> Pause
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" /> {step >= totalSteps ? 'Replay' : 'Run Simulation'}
              </>
            )}
          </button>

          <button
            onClick={handleStepForward}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition active:scale-95"
          >
            <SkipForward className="w-3.5 h-3.5" /> Step Next
          </button>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>

        {/* Step Indicator dots */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Step {step} of {totalSteps}:</span>
          <div className="flex gap-1.5">
            {[0, 1, 2, 3].map(i => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${
                  step === i 
                    ? scenario === 'direct-drop' && i >= 2 ? 'bg-rose-500 scale-125' : 'bg-indigo-400 scale-125'
                    : step > i ? 'bg-slate-600' : 'bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* AZ-104 Exam Insight Banner */}
      <div className={`p-3.5 rounded-xl border text-xs leading-relaxed flex items-start gap-2.5 ${
        scenario === 'udr-nva'
          ? 'bg-emerald-950/30 border-emerald-700/50 text-emerald-200'
          : 'bg-rose-950/30 border-rose-700/50 text-rose-200'
      }`}>
        <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${
          scenario === 'udr-nva' ? 'text-emerald-400' : 'text-rose-400'
        }`} />
        <div>
          <strong className="font-bold">AZ-104 Golden Rule:</strong>{' '}
          {scenario === 'udr-nva' ? (
            <span>
              To route traffic between Spokes through a Hub Firewall, you <strong>MUST</strong> associate a Route Table (UDR) to each Spoke subnet with a route for the remote Spoke's CIDR (e.g., <code>10.2.0.0/16</code>) pointing to <strong>Virtual Appliance</strong> with the private IP of the firewall.
            </span>
          ) : (
            <span>
              Virtual Network Peering is <strong>non-transitive</strong>! Having Peering A &harr; B and Peering B &harr; C does <strong>never</strong> permit A &rarr; C communication. Microsoft will give you this exact architecture on the exam and ask why VMs cannot connect.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
