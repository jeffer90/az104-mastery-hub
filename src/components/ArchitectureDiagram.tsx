import React from 'react';
import { Shield, ArrowRight, Database, Globe, Network, Lock, Layers } from 'lucide-react';

interface Props {
  type: 'hub-spoke' | 'rbac-hierarchy' | 'storage-tiers' | 'vm-resilience' | 'nsg-flow' | 'backup-vault' | 'slot-swap' | 'load-balancer-matrix';
}

export const ArchitectureDiagram: React.FC<Props> = ({ type }) => {
  switch (type) {
    case 'hub-spoke':
      return (
        <div className="bg-slate-900/90 p-5 rounded-xl border border-indigo-500/30 my-4 shadow-lg">
          <div className="flex items-center gap-2 mb-3 text-indigo-400 font-semibold text-sm uppercase tracking-wider">
            <Network className="w-4 h-4" /> Hub-and-Spoke Topology & Non-Transitive Peering
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            {/* Spoke 1 */}
            <div className="bg-slate-800/80 p-4 rounded-lg border border-slate-700 text-center relative group">
              <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">Spoke VNet 1</span>
              <p className="text-xs text-slate-400 mt-1 font-mono">10.1.0.0/16</p>
              <div className="mt-3 p-2 bg-slate-900/60 rounded text-xs text-slate-300">Workload Subnet (10.1.1.0/24)</div>
              <div className="text-[10px] text-amber-300 mt-2 bg-amber-950/40 p-1.5 rounded border border-amber-800/40">
                UDR: 10.2.0.0/16 &rarr; NVA (10.0.1.4)
              </div>
            </div>

            {/* Hub */}
            <div className="bg-indigo-950/50 p-4 rounded-lg border-2 border-indigo-500/50 text-center relative shadow-indigo-500/10 shadow-lg">
              <span className="text-xs font-bold font-mono text-indigo-300 bg-indigo-900/60 px-2 py-0.5 rounded border border-indigo-700">Hub VNet (Central)</span>
              <p className="text-xs text-slate-400 mt-1 font-mono">10.0.0.0/16</p>
              <div className="mt-2 space-y-1.5">
                <div className="p-1.5 bg-rose-950/50 border border-rose-800/50 rounded text-xs text-rose-300 font-mono">
                  Azure Firewall / NVA (10.0.1.4)
                </div>
                <div className="p-1.5 bg-blue-950/50 border border-blue-800/50 rounded text-xs text-blue-300 font-mono">
                  VPN / ExpressRoute Gateway
                </div>
              </div>
              <div className="text-[11px] text-indigo-300 mt-2">Gateway Transit: Enabled</div>
            </div>

            {/* Spoke 2 */}
            <div className="bg-slate-800/80 p-4 rounded-lg border border-slate-700 text-center relative group">
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">Spoke VNet 2</span>
              <p className="text-xs text-slate-400 mt-1 font-mono">10.2.0.0/16</p>
              <div className="mt-3 p-2 bg-slate-900/60 rounded text-xs text-slate-300">Database Subnet (10.2.1.0/24)</div>
              <div className="text-[10px] text-amber-300 mt-2 bg-amber-950/40 p-1.5 rounded border border-amber-800/40">
                UDR: 10.1.0.0/16 &rarr; NVA (10.0.1.4)
              </div>
            </div>
          </div>
          <div className="mt-4 p-2.5 bg-slate-950/70 rounded-lg text-xs text-slate-300 flex items-center justify-between border border-slate-800">
            <span className="text-rose-400 font-semibold flex items-center gap-1.5">
              <span>🚫</span> Peering A &harr; B and B &harr; C does NOT allow A &rarr; C direct traffic!
            </span>
            <span className="text-emerald-400 font-medium text-right">Packets must route through the Hub NVA via UDR</span>
          </div>
        </div>
      );

    case 'rbac-hierarchy':
      return (
        <div className="bg-slate-900/90 p-5 rounded-xl border border-blue-500/30 my-4 shadow-lg">
          <div className="flex items-center gap-2 mb-3 text-blue-400 font-semibold text-sm uppercase tracking-wider">
            <Layers className="w-4 h-4" /> Azure Scope Hierarchy & Permission Inheritance
          </div>
          <div className="flex flex-col items-center gap-2 max-w-md mx-auto text-center text-xs font-mono">
            {/* Root MG */}
            <div className="w-full p-2.5 rounded-lg bg-blue-950/80 border border-blue-600 text-blue-200">
              <p className="font-bold">Tenant Root Management Group</p>
              <p className="text-[11px] text-blue-400 mt-0.5">Top-level directory boundary</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 rotate-90" />

            {/* MG */}
            <div className="w-5/6 p-2.5 rounded-lg bg-blue-900/50 border border-blue-700 text-blue-300">
              <p className="font-bold">Management Groups (up to 6 levels)</p>
              <p className="text-[11px] text-slate-400 mt-0.5">e.g. Production / Development</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 rotate-90" />

            {/* Subscriptions */}
            <div className="w-4/6 p-2.5 rounded-lg bg-cyan-950/60 border border-cyan-600 text-cyan-300">
              <p className="font-bold">Subscriptions</p>
              <p className="text-[11px] text-cyan-400 mt-0.5">Billing & quota boundary</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 rotate-90" />

            {/* Resource Groups */}
            <div className="w-3/6 p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-600 text-emerald-300">
              <p className="font-bold">Resource Groups</p>
              <p className="text-[11px] text-emerald-400 mt-0.5">Lifecycle container</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 rotate-90" />

            {/* Resources */}
            <div className="w-2/6 p-2.5 rounded-lg bg-purple-950/60 border border-purple-600 text-purple-300">
              <p className="font-bold">Individual Resources</p>
              <p className="text-[11px] text-purple-400 mt-0.5">VMs, VNets, Storage</p>
            </div>
          </div>
          <p className="text-xs text-center text-slate-400 mt-3 italic">
            Permissions flow downward. Role assignments are <strong>additive</strong> (cannot block inheritance).
          </p>
        </div>
      );

    case 'storage-tiers':
      return (
        <div className="bg-slate-900/90 p-5 rounded-xl border border-amber-500/30 my-4 shadow-lg">
          <div className="flex items-center gap-2 mb-3 text-amber-400 font-semibold text-sm uppercase tracking-wider">
            <Database className="w-4 h-4" /> Blob Storage Access Tiers & Lifecycle Transitions
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center text-xs">
            {/* Hot */}
            <div className="p-3 bg-red-950/30 rounded-lg border border-red-700/50">
              <div className="font-bold text-red-400 text-sm">🔥 Hot Tier</div>
              <p className="text-slate-400 text-[11px] mt-1">Frequent access</p>
              <div className="mt-2 text-[10px] text-slate-300 bg-slate-900/80 p-1.5 rounded">
                High storage cost<br/>Low access cost<br/>Min: 0 days
              </div>
            </div>

            {/* Cool */}
            <div className="p-3 bg-sky-950/30 rounded-lg border border-sky-700/50">
              <div className="font-bold text-sky-400 text-sm">❄️ Cool Tier</div>
              <p className="text-slate-400 text-[11px] mt-1">Infrequent access</p>
              <div className="mt-2 text-[10px] text-slate-300 bg-slate-900/80 p-1.5 rounded">
                Lower storage cost<br/>Higher access cost<br/><span className="text-amber-400 font-bold">Min: 30 days</span>
              </div>
            </div>

            {/* Cold */}
            <div className="p-3 bg-cyan-950/30 rounded-lg border border-cyan-700/50">
              <div className="font-bold text-cyan-300 text-sm">🧊 Cold Tier</div>
              <p className="text-slate-400 text-[11px] mt-1">Rarely accessed</p>
              <div className="mt-2 text-[10px] text-slate-300 bg-slate-900/80 p-1.5 rounded">
                Very low storage<br/>Higher access cost<br/><span className="text-amber-400 font-bold">Min: 90 days</span>
              </div>
            </div>

            {/* Archive */}
            <div className="p-3 bg-purple-950/30 rounded-lg border border-purple-700/50">
              <div className="font-bold text-purple-400 text-sm">📦 Archive</div>
              <p className="text-slate-400 text-[11px] mt-1">Offline retention</p>
              <div className="mt-2 text-[10px] text-slate-300 bg-slate-900/80 p-1.5 rounded">
                Lowest storage cost<br/>Rehydration required<br/><span className="text-amber-400 font-bold">Min: 180 days</span>
              </div>
            </div>
          </div>
          <div className="mt-3 p-2 bg-slate-950/70 rounded border border-slate-800 text-[11px] text-amber-300 text-center">
            ⚠️ <strong>Exam Trap:</strong> Deleting a blob before the minimum retention (30d Cool / 90d Cold / 180d Archive) incurs an early-deletion fee!
          </div>
        </div>
      );

    case 'nsg-flow':
      return (
        <div className="bg-slate-900/90 p-5 rounded-xl border border-purple-500/30 my-4 shadow-lg">
          <div className="flex items-center gap-2 mb-3 text-purple-400 font-semibold text-sm uppercase tracking-wider">
            <Lock className="w-4 h-4" /> Inbound vs Outbound NSG Evaluation Pipeline
          </div>
          <div className="space-y-3 text-xs">
            {/* Inbound Flow */}
            <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
              <span className="text-cyan-400 font-bold uppercase tracking-wide">Inbound Traffic Flow:</span>
              <div className="flex items-center gap-2 mt-2 font-mono flex-wrap">
                <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700">Internet / Source</span>
                <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                <span className="px-2 py-1 bg-purple-950 border border-purple-700 rounded text-purple-200">1. Subnet NSG (Evaluated First)</span>
                <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                <span className="px-2 py-1 bg-indigo-950 border border-indigo-700 rounded text-indigo-200">2. NIC NSG (Evaluated Second)</span>
                <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                <span className="px-2 py-1 bg-emerald-950 border border-emerald-700 rounded text-emerald-300">Virtual Machine</span>
              </div>
              <p className="text-slate-400 text-[11px] mt-1.5">Both NSGs must ALLOW inbound traffic. If either denies, traffic is blocked.</p>
            </div>

            {/* Outbound Flow */}
            <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800">
              <span className="text-amber-400 font-bold uppercase tracking-wide">Outbound Traffic Flow:</span>
              <div className="flex items-center gap-2 mt-2 font-mono flex-wrap">
                <span className="px-2 py-1 bg-emerald-950 border border-emerald-700 rounded text-emerald-300">Virtual Machine</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                <span className="px-2 py-1 bg-indigo-950 border border-indigo-700 rounded text-indigo-200">1. NIC NSG (Evaluated First)</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                <span className="px-2 py-1 bg-purple-950 border border-purple-700 rounded text-purple-200">2. Subnet NSG (Evaluated Second)</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                <span className="px-2 py-1 bg-slate-800 rounded border border-slate-700">Destination</span>
              </div>
            </div>
          </div>
        </div>
      );

    case 'slot-swap':
      return (
        <div className="bg-slate-900/90 p-5 rounded-xl border border-emerald-500/30 my-4 shadow-lg">
          <div className="flex items-center gap-2 mb-3 text-emerald-400 font-semibold text-sm uppercase tracking-wider">
            <Globe className="w-4 h-4" /> App Service Deployment Slots: Swappable vs Sticky Settings
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-blue-950/30 rounded-lg border border-blue-700/40">
              <div className="font-bold text-blue-300 mb-1.5 flex items-center gap-1.5">
                <span>🔄</span> Settings that SWAP (by default)
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
                <li>General Application Settings (Environment variables)</li>
                <li>Connection Strings (unless checked as sticky)</li>
                <li>Framework version & Web sockets</li>
                <li>Handler mappings</li>
              </ul>
            </div>
            <div className="p-3 bg-amber-950/30 rounded-lg border border-amber-700/40">
              <div className="font-bold text-amber-300 mb-1.5 flex items-center gap-1.5">
                <span>📌</span> Sticky Settings (NEVER swap)
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px]">
                <li>Publishing endpoints & credentials</li>
                <li>Custom domain names</li>
                <li>SSL / TLS certificates</li>
                <li>Scale settings & Autoscale rules</li>
                <li>IP restrictions & VNet integration</li>
                <li>Any app setting with "Deployment slot setting" checked</li>
              </ul>
            </div>
          </div>
        </div>
      );

    case 'backup-vault':
      return (
        <div className="bg-slate-900/90 p-5 rounded-xl border border-rose-500/30 my-4 shadow-lg">
          <div className="flex items-center gap-2 mb-3 text-rose-400 font-semibold text-sm uppercase tracking-wider">
            <Shield className="w-4 h-4" /> Recovery Services Vault vs Azure Backup Vault
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-rose-950/30 rounded-lg border border-rose-700/50">
              <div className="font-bold text-rose-300 text-sm mb-1">Recovery Services Vault</div>
              <p className="text-slate-400 text-[11px] mb-2">Traditional IaaS & enterprise database protection</p>
              <ul className="space-y-1 text-slate-200 text-[11px]">
                <li>✅ <strong>Azure Virtual Machines</strong> (Windows / Linux)</li>
                <li>✅ SQL Server in Azure VMs</li>
                <li>✅ SAP HANA in Azure VMs</li>
                <li>✅ Azure Files shares</li>
                <li>✅ Azure Site Recovery (ASR replication)</li>
              </ul>
            </div>
            <div className="p-3 bg-sky-950/30 rounded-lg border border-sky-700/50">
              <div className="font-bold text-sky-300 text-sm mb-1">Azure Backup Vault</div>
              <p className="text-slate-400 text-[11px] mb-2">Cloud-native PaaS & storage protection</p>
              <ul className="space-y-1 text-slate-200 text-[11px]">
                <li>✅ Azure Blobs (operational backup)</li>
                <li>✅ Azure Managed Disks</li>
                <li>✅ Azure Database for PostgreSQL</li>
                <li>✅ Azure Kubernetes Service (AKS)</li>
                <li>❌ <em>CANNOT back up Azure VMs directly!</em></li>
              </ul>
            </div>
          </div>
        </div>
      );

    case 'load-balancer-matrix':
      return (
        <div className="bg-slate-900/90 p-5 rounded-xl border border-sky-500/30 my-4 shadow-lg">
          <div className="flex items-center gap-2 mb-3 text-sky-400 font-semibold text-sm uppercase tracking-wider">
            <Globe className="w-4 h-4" /> The 4 Azure Load Balancing Services: Decision Matrix
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {/* Global + HTTP: Front Door */}
            <div className="p-4 bg-sky-950/40 rounded-xl border border-sky-600/60 relative">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-sky-300 text-sm">Azure Front Door</span>
                <span className="text-[10px] bg-sky-900 text-sky-200 px-2 py-0.5 rounded font-mono font-bold">Global + Layer 7</span>
              </div>
              <p className="text-slate-300 text-[11px] mb-2">Global HTTP/HTTPS edge reverse proxy + CDN.</p>
              <ul className="space-y-1 text-slate-300 text-[11px]">
                <li>⚡ <strong>Global Anycast Edge</strong>: Terminates SSL/TLS at Microsoft PoP near user.</li>
                <li>⚡ <strong>Cross-Region Failover</strong>: Instant active-active or active-passive web routing.</li>
                <li>⚡ <strong>WAF & DDoS</strong>: Edge security, URL path routing, and caching.</li>
                <li>🚫 <em>HTTP / HTTPS only (no non-HTTP protocols).</em></li>
              </ul>
            </div>

            {/* Global + Non-HTTP: Traffic Manager */}
            <div className="p-4 bg-indigo-950/40 rounded-xl border border-indigo-600/60 relative">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-indigo-300 text-sm">Azure Traffic Manager</span>
                <span className="text-[10px] bg-indigo-900 text-indigo-200 px-2 py-0.5 rounded font-mono font-bold">Global + DNS</span>
              </div>
              <p className="text-slate-300 text-[11px] mb-2">DNS-based global traffic distribution.</p>
              <ul className="space-y-1 text-slate-300 text-[11px]">
                <li>⚡ <strong>DNS Resolution Only</strong>: Returns closest or priority IP address.</li>
                <li>⚡ <strong>Any Protocol</strong>: HTTP, TCP, UDP, Gaming, Streaming.</li>
                <li>🚫 <em>CANNOT proxy traffic, cannot terminate SSL, cannot inspect HTTP headers!</em></li>
                <li>🚫 <em>Subject to DNS TTL caching delays on client failovers.</em></li>
              </ul>
            </div>

            {/* Regional + HTTP: Application Gateway */}
            <div className="p-4 bg-emerald-950/40 rounded-xl border border-emerald-600/60 relative">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-emerald-300 text-sm">Azure Application Gateway</span>
                <span className="text-[10px] bg-emerald-900 text-emerald-200 px-2 py-0.5 rounded font-mono font-bold">Regional + Layer 7</span>
              </div>
              <p className="text-slate-300 text-[11px] mb-2">VNet-integrated HTTP/HTTPS reverse proxy.</p>
              <ul className="space-y-1 text-slate-300 text-[11px]">
                <li>⚡ <strong>URL Path Routing</strong>: /images to Pool A, /api to Pool B.</li>
                <li>⚡ <strong>SSL Offloading & Cookie Affinity</strong>: Stateful web sessions.</li>
                <li>⚡ <strong>WAF</strong>: Integrated OWASP Core Rule Sets.</li>
                <li>🚫 <em>Regional only (bound to a dedicated VNet subnet).</em></li>
              </ul>
            </div>

            {/* Regional + Non-HTTP: Azure Load Balancer */}
            <div className="p-4 bg-purple-950/40 rounded-xl border border-purple-600/60 relative">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-purple-300 text-sm">Azure Load Balancer</span>
                <span className="text-[10px] bg-purple-900 text-purple-200 px-2 py-0.5 rounded font-mono font-bold">Regional + Layer 4</span>
              </div>
              <p className="text-slate-300 text-[11px] mb-2">Ultra-high-throughput TCP/UDP load balancing.</p>
              <ul className="space-y-1 text-slate-300 text-[11px]">
                <li>⚡ <strong>Layer 4</strong>: Operates strictly on IP, Port, and Protocol (TCP/UDP).</li>
                <li>⚡ <strong>Internal or Public</strong>: Private VNet or public Internet IP.</li>
                <li>🚫 <em>NO SSL termination, NO HTTP header/cookie inspection, NO URL routing.</em></li>
              </ul>
            </div>
          </div>
          <div className="mt-3 p-2.5 bg-slate-950/80 rounded-lg border border-slate-800 text-[11px] text-amber-300 text-center font-medium">
            💡 <strong>Exam Memory Rule:</strong> Need Global HTTP with SSL termination? &rarr; <strong>Azure Front Door</strong>. Need Global DNS with non-HTTP? &rarr; <strong>Traffic Manager</strong>. Need Regional HTTP with URL routing? &rarr; <strong>App Gateway</strong>. Need Regional TCP/UDP? &rarr; <strong>Azure Load Balancer</strong>.
          </div>
        </div>
      );

    default:
      return null;
  }
};
