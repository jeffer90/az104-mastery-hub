import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  Lock, 
  ShieldCheck, 
  ShieldX, 
  Server, 
  Globe, 
  AlertTriangle 
} from 'lucide-react';

type Direction = 'inbound' | 'outbound';
type TestCase = 'allow-https' | 'deny-subnet' | 'deny-nic';

export const NsgFlowSimulator: React.FC = () => {
  const [direction, setDirection] = useState<Direction>('inbound');
  const [testCase, setTestCase] = useState<TestCase>('allow-https');
  const [step, setStep] = useState<number>(0); // 0: Idle, 1: At 1st NSG, 2: At 2nd NSG, 3: Outcome
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);

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

  const switchTestCase = (tc: TestCase) => {
    setIsPlaying(false);
    setTestCase(tc);
    setStep(0);
  };

  const switchDirection = (dir: Direction) => {
    setIsPlaying(false);
    setDirection(dir);
    setStep(0);
  };

  // Scenarios specifics
  const isSubnetDropped = direction === 'inbound' && testCase === 'deny-subnet';
  const isNicDropped = direction === 'inbound' && testCase === 'deny-nic';
  const isSuccess = testCase === 'allow-https' || direction === 'outbound';

  return (
    <div className="bg-slate-900/95 p-5 lg:p-6 rounded-2xl border border-purple-500/30 my-4 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-purple-400 font-bold text-sm uppercase tracking-wider">
          <Lock className="w-5 h-5 animate-pulse" />
          <span>NSG Rule Evaluation & Packet Flow Simulator</span>
        </div>
        
        {/* Direction Toggle */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => switchDirection('inbound')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
              direction === 'inbound'
                ? 'bg-purple-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Inbound Flow
          </button>
          <button
            onClick={() => switchDirection('outbound')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
              direction === 'outbound'
                ? 'bg-amber-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Outbound Flow
          </button>
        </div>
      </div>

      {/* Traffic Packet Presets */}
      <div className="space-y-2">
        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
          Select Traffic Type to Test:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <button
            onClick={() => switchTestCase('allow-https')}
            className={`p-2.5 rounded-xl border text-left transition ${
              testCase === 'allow-https'
                ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/20'
                : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 text-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">HTTPS (Port 443)</span>
              <span className="text-[9px] bg-emerald-900/80 text-emerald-200 px-1.5 py-0.5 rounded font-mono font-bold">Allowed</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Subnet NSG Allow (Prio 100) + NIC NSG Allow (Prio 110).
            </p>
          </button>

          <button
            onClick={() => switchTestCase('deny-subnet')}
            className={`p-2.5 rounded-xl border text-left transition ${
              testCase === 'deny-subnet'
                ? 'bg-rose-950/60 border-rose-500 text-rose-300 ring-2 ring-rose-500/20'
                : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 text-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">SSH (Port 22)</span>
              <span className="text-[9px] bg-rose-900/80 text-rose-200 px-1.5 py-0.5 rounded font-mono font-bold">Subnet Deny</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Subnet NSG rule 200 blocks. Packet dies before NIC NSG!
            </p>
          </button>

          <button
            onClick={() => switchTestCase('deny-nic')}
            className={`p-2.5 rounded-xl border text-left transition ${
              testCase === 'deny-nic'
                ? 'bg-amber-950/60 border-amber-500 text-amber-300 ring-2 ring-amber-500/20'
                : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 text-slate-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Custom App (8080)</span>
              <span className="text-[9px] bg-amber-900/80 text-amber-200 px-1.5 py-0.5 rounded font-mono font-bold">NIC Deny</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Subnet NSG allows, but NIC NSG rule 150 denies!
            </p>
          </button>
        </div>
      </div>

      {/* Visual Pipeline Stage View */}
      <div className="relative bg-slate-950/90 border border-slate-800 rounded-xl p-5 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-stretch relative z-10">
          {/* Stage 1: Internet / Source (or VM if Outbound) */}
          <div className={`p-3.5 rounded-xl border text-center transition-all ${
            step === 0 || step === 1
              ? 'bg-slate-800/80 border-cyan-400 shadow-md shadow-cyan-500/10'
              : 'bg-slate-900/50 border-slate-800'
          }`}>
            <div className="text-[10px] uppercase font-bold text-slate-400">
              {direction === 'inbound' ? 'Traffic Source' : 'Target Host'}
            </div>
            <div className="my-2 flex justify-center">
              {direction === 'inbound' ? (
                <Globe className="w-8 h-8 text-cyan-400" />
              ) : (
                <Server className="w-8 h-8 text-emerald-400" />
              )}
            </div>
            <span className="text-xs font-mono font-bold text-white">
              {direction === 'inbound' ? 'Internet Client' : 'VM NIC (10.0.1.4)'}
            </span>
            <div className="text-[10px] font-mono text-cyan-300 mt-1">
              {testCase === 'allow-https' ? 'TCP 443' : testCase === 'deny-subnet' ? 'TCP 22' : 'TCP 8080'}
            </div>
          </div>

          {/* Stage 2: 1st Evaluated NSG */}
          {/* Inbound: Subnet NSG | Outbound: NIC NSG */}
          <div className={`p-3.5 rounded-xl border-2 transition-all relative ${
            step === 1
              ? direction === 'inbound' && isSubnetDropped
                ? 'bg-rose-950/70 border-rose-500 ring-4 ring-rose-500/20'
                : 'bg-purple-950/70 border-purple-400 ring-4 ring-purple-500/20'
              : 'bg-slate-900/40 border-slate-800'
          }`}>
            <div className="text-[10px] uppercase font-extrabold text-purple-300 flex items-center justify-between">
              <span>{direction === 'inbound' ? '1. Subnet NSG' : '1. NIC NSG'}</span>
              <span className="text-[9px] bg-purple-900/80 px-1.5 py-0.2 rounded">Evaluated 1st</span>
            </div>

            <div className="mt-2 space-y-1.5 text-[10px] font-mono">
              <div className="p-1 rounded bg-slate-950 border border-slate-800 text-slate-300 flex justify-between">
                <span>Prio 100: Allow 443</span>
                <span className="text-emerald-400">ALLOW</span>
              </div>
              <div className={`p-1 rounded border flex justify-between ${
                testCase === 'deny-subnet'
                  ? 'bg-rose-950 border-rose-600 text-rose-300 font-bold'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}>
                <span>Prio 200: Deny 22</span>
                <span className="text-rose-400">DENY</span>
              </div>
            </div>

            {step >= 1 && direction === 'inbound' && isSubnetDropped && (
              <div className="mt-2 p-1.5 bg-rose-900/90 border border-rose-500 rounded text-[10px] text-white font-bold text-center">
                🚫 MATCH: Rule 200 DENIED
              </div>
            )}
          </div>

          {/* Stage 3: 2nd Evaluated NSG */}
          {/* Inbound: NIC NSG | Outbound: Subnet NSG */}
          <div className={`p-3.5 rounded-xl border-2 transition-all relative ${
            step === 2
              ? direction === 'inbound' && isNicDropped
                ? 'bg-rose-950/70 border-rose-500 ring-4 ring-rose-500/20'
                : 'bg-indigo-950/70 border-indigo-400 ring-4 ring-indigo-500/20'
              : 'bg-slate-900/40 border-slate-800'
          }`}>
            <div className="text-[10px] uppercase font-extrabold text-indigo-300 flex items-center justify-between">
              <span>{direction === 'inbound' ? '2. NIC NSG' : '2. Subnet NSG'}</span>
              <span className="text-[9px] bg-indigo-900/80 px-1.5 py-0.2 rounded">Evaluated 2nd</span>
            </div>

            <div className="mt-2 space-y-1.5 text-[10px] font-mono">
              <div className="p-1 rounded bg-slate-950 border border-slate-800 text-slate-300 flex justify-between">
                <span>Prio 110: Allow 443</span>
                <span className="text-emerald-400">ALLOW</span>
              </div>
              <div className={`p-1 rounded border flex justify-between ${
                testCase === 'deny-nic'
                  ? 'bg-rose-950 border-rose-600 text-rose-300 font-bold'
                  : 'bg-slate-950 border-slate-800 text-slate-400'
              }`}>
                <span>Prio 150: Deny 8080</span>
                <span className="text-rose-400">DENY</span>
              </div>
            </div>

            {step >= 2 && direction === 'inbound' && isNicDropped && (
              <div className="mt-2 p-1.5 bg-rose-900/90 border border-rose-500 rounded text-[10px] text-white font-bold text-center">
                🚫 MATCH: Rule 150 DENIED
              </div>
            )}

            {step >= 1 && direction === 'inbound' && isSubnetDropped && (
              <div className="mt-2 p-1 bg-slate-950/90 border border-slate-800 rounded text-[9px] text-slate-500 text-center italic">
                (Never reached - already dropped)
              </div>
            )}
          </div>

          {/* Stage 4: Destination VM (or Destination if Outbound) */}
          <div className={`p-3.5 rounded-xl border text-center transition-all ${
            step === 3 && isSuccess
              ? 'bg-emerald-950/80 border-emerald-400 ring-2 ring-emerald-500/30 shadow-lg'
              : step === 3 && !isSuccess
              ? 'bg-rose-950/40 border-rose-800/80 text-rose-400'
              : 'bg-slate-900/50 border-slate-800'
          }`}>
            <div className="text-[10px] uppercase font-bold text-slate-400">
              {direction === 'inbound' ? 'Destination Host' : 'Destination'}
            </div>
            <div className="my-2 flex justify-center">
              {isSuccess && step === 3 ? (
                <ShieldCheck className="w-8 h-8 text-emerald-400" />
              ) : !isSuccess && step === 3 ? (
                <ShieldX className="w-8 h-8 text-rose-400" />
              ) : (
                <Server className="w-8 h-8 text-slate-400" />
              )}
            </div>
            <span className="text-xs font-mono font-bold text-white">
              {direction === 'inbound' ? 'Virtual Machine' : 'Internet / Target'}
            </span>
            <div className="text-[10px] font-mono mt-1">
              {step === 3 && isSuccess && <span className="text-emerald-400 font-bold">200 OK / CONNECTED</span>}
              {step === 3 && !isSuccess && <span className="text-rose-400 font-bold">CONNECTION TIMED OUT</span>}
              {step < 3 && <span className="text-slate-400">Listening...</span>}
            </div>
          </div>
        </div>

        {/* Live Evaluation Status Line */}
        <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <div className="font-mono text-slate-300 flex items-center gap-2">
            <span className="text-slate-400">Status:</span>
            {step === 0 && <span className="text-slate-400">Ready to simulate traffic</span>}
            {step === 1 && isSubnetDropped && (
              <span className="text-rose-400 font-bold">Dropped at Subnet NSG! (NIC NSG will never be evaluated)</span>
            )}
            {step === 1 && !isSubnetDropped && (
              <span className="text-purple-300">Passed {direction === 'inbound' ? 'Subnet' : 'NIC'} NSG &rarr; Advancing to next stage...</span>
            )}
            {step === 2 && isNicDropped && (
              <span className="text-rose-400 font-bold">Dropped at NIC NSG! Both NSGs must allow inbound packets.</span>
            )}
            {step === 2 && !isNicDropped && !isSubnetDropped && (
              <span className="text-indigo-300">Passed {direction === 'inbound' ? 'NIC' : 'Subnet'} NSG &rarr; Delivering packet...</span>
            )}
            {step === 3 && isSuccess && (
              <span className="text-emerald-400 font-bold">Traffic Allowed & Processed by VM!</span>
            )}
            {step === 3 && !isSuccess && (
              <span className="text-rose-400 font-bold">Traffic Blocked. No response returned.</span>
            )}
          </div>

          <div className="text-[11px] font-mono text-slate-400">
            Rule priority range: <strong>100 - 4096</strong> (Lower = Higher priority)
          </div>
        </div>
      </div>

      {/* Simulator Playback Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePlayPause}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 transition shadow-lg shadow-purple-600/20 active:scale-95"
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

        {/* Speed toggle */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-400">Speed:</span>
          <button
            onClick={() => setSpeed(speed === 1 ? 2 : 1)}
            className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-slate-800 text-purple-300 border border-slate-700"
          >
            {speed}x
          </button>
        </div>
      </div>

      {/* Exam Trap Alert */}
      <div className="p-3.5 rounded-xl border border-purple-800/50 bg-purple-950/30 text-purple-200 text-xs leading-relaxed flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">AZ-104 Exam Trap:</strong>{' '}
          Remember the order! <strong>INBOUND</strong> evaluates <strong>Subnet NSG first</strong>, then <strong>NIC NSG second</strong>. 
          <strong>OUTBOUND</strong> evaluates <strong>NIC NSG first</strong>, then <strong>Subnet NSG second</strong>. 
          Both NSGs must evaluate to <em>ALLOW</em> for communication to succeed. If any NSG denies, the packet is immediately terminated and subsequent NSGs are ignored!
        </div>
      </div>
    </div>
  );
};
