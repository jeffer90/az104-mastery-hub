import React, { useState } from 'react';
import { 
  Server, 
  AlertTriangle, 
  Building2, 
  Cpu 
} from 'lucide-react';

export const VmResilienceSimulator: React.FC = () => {
  const [activeFailure, setActiveFailure] = useState<'none' | 'datacenter' | 'rack'>('none');

  return (
    <div className="bg-slate-900/95 p-5 lg:p-6 rounded-2xl border border-cyan-500/30 my-4 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm uppercase tracking-wider">
          <Server className="w-5 h-5 animate-pulse" />
          <span>Azure VM Resilience & High Availability Simulator</span>
        </div>
        <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-full border border-slate-800">
          Availability Zones vs. Availability Sets
        </span>
      </div>

      {/* Failure Injection Controls */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>Inject Failure Scenario to Test Resiliency:</span>
          <span>Status: <strong className="text-white uppercase">{activeFailure === 'none' ? 'All Systems Healthy' : `${activeFailure} Failure Active`}</strong></span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <button
            onClick={() => setActiveFailure('none')}
            className={`p-2.5 rounded-xl border text-left transition ${
              activeFailure === 'none'
                ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/20'
                : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 text-slate-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Normal Baseline</span>
              <span className="text-[9px] bg-emerald-900/80 text-emerald-200 px-1.5 py-0.5 rounded font-mono font-bold">100% Up</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">All datacenters and hardware racks operating normally.</p>
          </button>

          <button
            onClick={() => setActiveFailure('datacenter')}
            className={`p-2.5 rounded-xl border text-left transition ${
              activeFailure === 'datacenter'
                ? 'bg-rose-950/70 border-rose-500 text-rose-300 ring-2 ring-rose-500/20'
                : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 text-slate-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Zone 1 Datacenter Power Outage</span>
              <span className="text-[9px] bg-rose-900/80 text-rose-200 px-1.5 py-0.5 rounded font-mono font-bold">Zone Outage</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Tests multi-zone resilience. Zone 2 & 3 must survive!</p>
          </button>

          <button
            onClick={() => setActiveFailure('rack')}
            className={`p-2.5 rounded-xl border text-left transition ${
              activeFailure === 'rack'
                ? 'bg-amber-950/70 border-amber-500 text-amber-300 ring-2 ring-amber-500/20'
                : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 text-slate-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Rack Power / Switch Failure</span>
              <span className="text-[9px] bg-amber-900/80 text-amber-200 px-1.5 py-0.5 rounded font-mono font-bold">Fault Domain 0</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Tests Availability Set fault domains within a datacenter.</p>
          </button>
        </div>
      </div>

      {/* Model 1: Availability Zones (Physical Datacenter Boundaries) */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              1. Availability Zones (AZ) — 99.99% SLA
            </span>
          </div>
          <span className="text-[10px] font-mono text-cyan-400">Independent Power, Cooling, & Networking</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[1, 2, 3].map(zoneNum => {
            const isZoneDown = activeFailure === 'datacenter' && zoneNum === 1;
            return (
              <div
                key={zoneNum}
                className={`p-3 rounded-xl border transition-all ${
                  isZoneDown
                    ? 'bg-rose-950/60 border-rose-500 text-rose-300 shadow-lg shadow-rose-500/10'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold font-mono">Zone {zoneNum} (Datacenter {zoneNum})</span>
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                    isZoneDown ? 'bg-rose-900 text-white' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}>
                    {isZoneDown ? 'OFFLINE' : 'ONLINE'}
                  </span>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono text-center">
                  VM-Web-0{zoneNum}
                </div>
                <p className="text-[10px] text-slate-400 mt-2">
                  {isZoneDown 
                    ? '⚠️ Power lost at Datacenter 1! Load Balancer automatically routes to Zone 2 & 3.' 
                    : '✅ Healthy and accepting traffic over high-speed intra-region fiber.'}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Model 2: Availability Sets (Fault Domains & Update Domains) */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              2. Availability Sets (AS) — 99.95% SLA
            </span>
          </div>
          <span className="text-[10px] font-mono text-purple-300">Max 3 Fault Domains | Max 20 Update Domains</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[0, 1, 2].map(fdNum => {
            const isFdDown = activeFailure === 'rack' && fdNum === 0;
            return (
              <div
                key={fdNum}
                className={`p-3 rounded-xl border transition-all ${
                  isFdDown
                    ? 'bg-rose-950/60 border-rose-500 text-rose-300 shadow-lg shadow-rose-500/10'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold font-mono">Fault Domain {fdNum} (Physical Rack {fdNum})</span>
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                    isFdDown ? 'bg-rose-900 text-white' : 'bg-purple-950 text-purple-300 border border-purple-800'
                  }`}>
                    {isFdDown ? 'POWER LOSS' : 'HEALTHY'}
                  </span>
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono text-center">
                  VM-SQL-0{fdNum + 1}
                </div>
                <p className="text-[10px] text-slate-400 mt-2">
                  {isFdDown 
                    ? '⚠️ Power supply failed on Rack 0! VMs on Rack 1 & 2 continue uninterrupted.' 
                    : '✅ Independent power supply and network switch.'}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* AZ-104 Exam Rules Card */}
      <div className="p-3.5 rounded-xl border border-cyan-800/50 bg-cyan-950/30 text-cyan-200 text-xs leading-relaxed flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">AZ-104 Memory Traps:</strong>
          <ul className="list-disc list-inside mt-1 font-mono text-[11px] space-y-0.5">
            <li><strong>Availability Zones SLA:</strong> <strong>99.99%</strong> (Requires &ge; 2 VMs deployed across &ge; 2 zones).</li>
            <li><strong>Availability Sets SLA:</strong> <strong>99.95%</strong> (Requires &ge; 2 VMs deployed in the same Availability Set).</li>
            <li><strong>Fault Domains (FD):</strong> Protect against physical hardware/power failure (max <strong>3 FDs</strong> in ARM).</li>
            <li><strong>Update Domains (UD):</strong> Protect against scheduled Microsoft patching reboot waves (max <strong>20 UDs</strong>, default is 5).</li>
            <li><strong>Proximity Placement Group (PPG):</strong> Colocates VMs in the closest physical proximity for <strong>ultra-low latency (&lt;1ms)</strong>, NOT for high availability!</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
