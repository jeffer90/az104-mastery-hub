import React, { useState } from 'react';
import { 
  Globe, 
  Layers, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Gamepad2, 
  ShoppingBag, 
  Database, 
  HelpCircle 
} from 'lucide-react';

type ServiceId = 'front-door' | 'traffic-manager' | 'app-gateway' | 'load-balancer';

interface ScenarioOption {
  id: ServiceId;
  title: string;
  icon: React.ReactNode;
  protocol: string;
  scope: 'Global' | 'Regional';
  layer: 'Layer 7 (HTTP/S)' | 'Layer 4 (TCP/UDP)' | 'DNS Level';
  clientRequest: string;
  summary: string;
}

export const LoadBalancerSimulator: React.FC = () => {
  const [activeScenario, setActiveScenario] = useState<ServiceId>('front-door');

  const scenarios: ScenarioOption[] = [
    {
      id: 'front-door',
      title: 'Global HTTPS Web Application',
      icon: <ShoppingBag className="w-4 h-4 text-sky-400" />,
      protocol: 'HTTPS (443)',
      scope: 'Global',
      layer: 'Layer 7 (HTTP/S)',
      clientRequest: 'GET https://contoso-global.com/checkout',
      summary: 'Users worldwide need low-latency web access, SSL offloading at edge PoP, and automated cross-region failover.'
    },
    {
      id: 'traffic-manager',
      title: 'Global Gaming / Non-HTTP Protocol',
      icon: <Gamepad2 className="w-4 h-4 text-indigo-400" />,
      protocol: 'UDP 27015 / TCP',
      scope: 'Global',
      layer: 'DNS Level',
      clientRequest: 'DNS QUERY for game.contoso.com',
      summary: 'Low-latency multiplayer game servers in US, Europe, and Asia requiring DNS-based geographical routing for non-HTTP traffic.'
    },
    {
      id: 'app-gateway',
      title: 'Regional Web App with URL Path Routing',
      icon: <Layers className="w-4 h-4 text-emerald-400" />,
      protocol: 'HTTP/HTTPS (80/443)',
      scope: 'Regional',
      layer: 'Layer 7 (HTTP/S)',
      clientRequest: 'GET https://app.corp.local/images/banner.png',
      summary: 'Inside East US VNet, routing /images to Pool A and /api to Pool B, with cookie-based session affinity and WAF.'
    },
    {
      id: 'load-balancer',
      title: 'Regional SQL / Ultra-Low Latency TCP',
      icon: <Database className="w-4 h-4 text-purple-400" />,
      protocol: 'TCP 1433 (SQL)',
      scope: 'Regional',
      layer: 'Layer 4 (TCP/UDP)',
      clientRequest: 'TCP Handshake to 10.0.2.100:1433',
      summary: 'High-throughput database cluster requiring millions of packets per second, ultralow latency, and zero HTTP overhead.'
    }
  ];

  const current = scenarios.find(s => s.id === activeScenario)!;

  return (
    <div className="bg-slate-900/95 p-5 lg:p-6 rounded-2xl border border-sky-500/30 my-4 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-sky-400 font-bold text-sm uppercase tracking-wider">
          <Globe className="w-5 h-5 animate-pulse" />
          <span>4-Way Load Balancing Interactive Decision Engine</span>
        </div>
        <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-full border border-slate-800">
          AZ-104 Core Networking Matrix
        </span>
      </div>

      {/* Traffic Request Scenario Buttons */}
      <div className="space-y-2">
        <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
          Click an Exam Scenario to Trace Packet:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {scenarios.map(sc => {
            const isSelected = sc.id === activeScenario;
            return (
              <button
                key={sc.id}
                onClick={() => setActiveScenario(sc.id)}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                  isSelected
                    ? 'bg-sky-950/70 border-sky-500 text-sky-200 ring-2 ring-sky-500/20 shadow-lg'
                    : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  {sc.icon}
                  <span className="text-xs font-bold text-white leading-tight">{sc.title}</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400 mt-2">
                  <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">{sc.scope}</span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">{sc.protocol}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Decision Pipeline */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
        {/* Animated flow path */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* Step 1: Incoming Packet */}
          <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400">Incoming Traffic</span>
            <div className="my-2 p-2 rounded bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 truncate">
              {current.clientRequest}
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              Protocol: <strong className="text-white">{current.protocol}</strong>
            </div>
          </div>

          {/* Step 2: Decision Gates */}
          <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 block text-center">
              Azure Routing Decision Gates
            </span>

            {/* Gate 1: Scope */}
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs flex items-center justify-between">
              <span className="text-slate-400">1. Geographical Scope?</span>
              <span className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                current.scope === 'Global' 
                  ? 'bg-blue-950 border border-blue-700 text-blue-300' 
                  : 'bg-emerald-950 border border-emerald-700 text-emerald-300'
              }`}>
                {current.scope}
              </span>
            </div>

            {/* Gate 2: OSI Layer */}
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs flex items-center justify-between">
              <span className="text-slate-400">2. Protocol / OSI Layer?</span>
              <span className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                current.layer.includes('Layer 7') 
                  ? 'bg-sky-950 border border-sky-700 text-sky-300' 
                  : current.layer.includes('DNS')
                  ? 'bg-indigo-950 border border-indigo-700 text-indigo-300'
                  : 'bg-purple-950 border border-purple-700 text-purple-300'
              }`}>
                {current.layer}
              </span>
            </div>
          </div>

          {/* Step 3: Chosen Service Destination */}
          <div className="p-3.5 rounded-xl border-2 border-sky-400 bg-sky-950/70 shadow-lg shadow-sky-500/10 text-center relative">
            <span className="text-[10px] uppercase font-bold text-sky-300 tracking-wider">
              Selected Azure Service
            </span>
            <div className="my-2 text-base font-extrabold text-white">
              {activeScenario === 'front-door' && 'Azure Front Door'}
              {activeScenario === 'traffic-manager' && 'Azure Traffic Manager'}
              {activeScenario === 'app-gateway' && 'Azure Application Gateway'}
              {activeScenario === 'load-balancer' && 'Azure Load Balancer (Standard)'}
            </div>
            <div className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-700/50">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Correct AZ-104 Architecture</span>
            </div>
          </div>
        </div>

        {/* Dynamic Service Deep Dive Card */}
        <div className="mt-5 p-4 rounded-xl border border-slate-800 bg-slate-900/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Why this is the ONLY correct choice:
              </span>
            </div>
            <span className="text-[11px] font-mono text-sky-400">{current.summary}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {activeScenario === 'front-door' && (
              <>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1">
                  <div className="font-bold text-sky-300 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" /> Anycast Edge Termination
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    TCP & SSL/TLS handshakes terminate at the Microsoft Point of Presence (PoP) nearest to the user, routing over Microsoft's private global fiber network.
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1">
                  <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" /> Integrated Edge WAF & CDN
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Blocks SQL injections, DDoS attacks, and caches static content directly at the edge before hitting your backend pools.
                  </p>
                </div>
              </>
            )}

            {activeScenario === 'traffic-manager' && (
              <>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1">
                  <div className="font-bold text-indigo-300 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" /> DNS-Based Routing (Non-Proxy)
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Traffic Manager NEVER touches actual data packets. It simply resolves the client's DNS query to the IP address of the healthiest/closest regional endpoint.
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1">
                  <div className="font-bold text-rose-300 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5" /> Critical Exam Gotcha
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Cannot terminate SSL, cannot inspect HTTP headers/cookies, and failover speed is governed by client DNS TTL caching!
                  </p>
                </div>
              </>
            )}

            {activeScenario === 'app-gateway' && (
              <>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1">
                  <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" /> URL Path-Based Routing & Cookie Affinity
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Inspects full HTTP URL paths: routes <code>/images/*</code> to a Storage Pool and <code>/api/*</code> to an AKS/VM pool. Supports cookie-based sticky sessions.
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1">
                  <div className="font-bold text-amber-300 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" /> Dedicated VNet Subnet Requirement
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    App Gateway is regional and requires its own dedicated subnet (min <code>/27</code> recommended for autoscaling).
                  </p>
                </div>
              </>
            )}

            {activeScenario === 'load-balancer' && (
              <>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1">
                  <div className="font-bold text-purple-300 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" /> Layer 4 (IP, Port, Protocol Hash)
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Operates at Layer 4 (TCP/UDP) with zero packet inspection latency. Uses a 5-tuple hash (Source IP, Source Port, Dest IP, Dest Port, Protocol) by default.
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1">
                  <div className="font-bold text-rose-300 flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5" /> Outbound SNAT Gotcha
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Standard Load Balancer backend pools have <strong>no default outbound internet</strong>! You must attach a NAT Gateway or configure explicit Outbound Rules.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Quick Comparison Decision Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
            <tr>
              <th className="p-2.5">Service</th>
              <th className="p-2.5">Scope</th>
              <th className="p-2.5">OSI Layer</th>
              <th className="p-2.5">SSL Offload</th>
              <th className="p-2.5">URL Routing</th>
              <th className="p-2.5">WAF Support</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-slate-900/50">
            <tr className={activeScenario === 'front-door' ? 'bg-sky-950/30 text-sky-200' : 'text-slate-300'}>
              <td className="p-2.5 font-bold text-sky-400">Azure Front Door</td>
              <td className="p-2.5">Global</td>
              <td className="p-2.5">Layer 7 (HTTP)</td>
              <td className="p-2.5 text-emerald-400">Yes (Edge)</td>
              <td className="p-2.5 text-emerald-400">Yes</td>
              <td className="p-2.5 text-emerald-400">Yes (Global)</td>
            </tr>
            <tr className={activeScenario === 'traffic-manager' ? 'bg-indigo-950/30 text-indigo-200' : 'text-slate-300'}>
              <td className="p-2.5 font-bold text-indigo-400">Traffic Manager</td>
              <td className="p-2.5">Global</td>
              <td className="p-2.5">DNS Resolution</td>
              <td className="p-2.5 text-rose-400">No</td>
              <td className="p-2.5 text-rose-400">No</td>
              <td className="p-2.5 text-rose-400">No</td>
            </tr>
            <tr className={activeScenario === 'app-gateway' ? 'bg-emerald-950/30 text-emerald-200' : 'text-slate-300'}>
              <td className="p-2.5 font-bold text-emerald-400">Application Gateway</td>
              <td className="p-2.5">Regional</td>
              <td className="p-2.5">Layer 7 (HTTP)</td>
              <td className="p-2.5 text-emerald-400">Yes</td>
              <td className="p-2.5 text-emerald-400">Yes</td>
              <td className="p-2.5 text-emerald-400">Yes (v2 SKU)</td>
            </tr>
            <tr className={activeScenario === 'load-balancer' ? 'bg-purple-950/30 text-purple-200' : 'text-slate-300'}>
              <td className="p-2.5 font-bold text-purple-400">Azure Load Balancer</td>
              <td className="p-2.5">Regional</td>
              <td className="p-2.5">Layer 4 (TCP/UDP)</td>
              <td className="p-2.5 text-rose-400">No</td>
              <td className="p-2.5 text-rose-400">No</td>
              <td className="p-2.5 text-rose-400">No</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
