import React from 'react';
import { Shield, ArrowRight, Layers } from 'lucide-react';
import { HubSpokeSimulator } from './diagrams/HubSpokeSimulator';
import { NsgFlowSimulator } from './diagrams/NsgFlowSimulator';
import { LoadBalancerSimulator } from './diagrams/LoadBalancerSimulator';
import { SlotSwapSimulator } from './diagrams/SlotSwapSimulator';
import { StorageTiersSimulator } from './diagrams/StorageTiersSimulator';
import { VmResilienceSimulator } from './diagrams/VmResilienceSimulator';

interface Props {
  type: 'hub-spoke' | 'rbac-hierarchy' | 'storage-tiers' | 'vm-resilience' | 'nsg-flow' | 'backup-vault' | 'slot-swap' | 'load-balancer-matrix';
}

export const ArchitectureDiagram: React.FC<Props> = ({ type }) => {
  switch (type) {
    case 'hub-spoke':
      return <HubSpokeSimulator />;

    case 'nsg-flow':
      return <NsgFlowSimulator />;

    case 'load-balancer-matrix':
      return <LoadBalancerSimulator />;

    case 'slot-swap':
      return <SlotSwapSimulator />;

    case 'storage-tiers':
      return <StorageTiersSimulator />;

    case 'vm-resilience':
      return <VmResilienceSimulator />;

    case 'rbac-hierarchy':
      return (
        <div className="bg-slate-900/90 p-5 rounded-xl border border-blue-500/30 my-4 shadow-lg space-y-4">
          <div className="flex items-center gap-2 mb-3 text-blue-400 font-semibold text-sm uppercase tracking-wider">
            <Layers className="w-4 h-4" /> Azure Scope Hierarchy & Permission Inheritance
          </div>
          <div className="flex flex-col items-center gap-2 max-w-md mx-auto text-center text-xs font-mono">
            {/* Root MG */}
            <div className="w-full p-2.5 rounded-lg bg-blue-950/80 border border-blue-600 text-blue-200 shadow-md">
              <p className="font-bold">Tenant Root Management Group</p>
              <p className="text-[11px] text-blue-400 mt-0.5">Top-level directory boundary (Applies to ALL subscriptions)</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 rotate-90" />

            {/* MG */}
            <div className="w-5/6 p-2.5 rounded-lg bg-blue-900/50 border border-blue-700 text-blue-300">
              <p className="font-bold">Management Groups (up to 6 levels deep)</p>
              <p className="text-[11px] text-slate-400 mt-0.5">e.g. Production / Development / Marketing</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 rotate-90" />

            {/* Subscriptions */}
            <div className="w-4/6 p-2.5 rounded-lg bg-cyan-950/60 border border-cyan-600 text-cyan-300">
              <p className="font-bold">Subscriptions</p>
              <p className="text-[11px] text-cyan-400 mt-0.5">Billing & service quota boundary</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 rotate-90" />

            {/* Resource Groups */}
            <div className="w-3/6 p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-600 text-emerald-300">
              <p className="font-bold">Resource Groups</p>
              <p className="text-[11px] text-emerald-400 mt-0.5">Lifecycle & deployment container</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-500 rotate-90" />

            {/* Resources */}
            <div className="w-2/6 p-2.5 rounded-lg bg-purple-950/60 border border-purple-600 text-purple-300">
              <p className="font-bold">Individual Resources</p>
              <p className="text-[11px] text-purple-400 mt-0.5">VMs, VNets, Storage Accounts</p>
            </div>
          </div>
          <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs text-center text-slate-300 space-y-1">
            <p className="font-bold text-amber-300">
              💡 AZ-104 Inheritance Rule: Permissions flow downward and are purely ADDITIVE!
            </p>
            <p className="text-[11px] text-slate-400">
              You CANNOT block inheritance at a child level in Azure RBAC. An explicit <em>Deny Assignment</em> takes precedence over all Allow roles, but can only be created by Azure Blueprints / Managed Applications.
            </p>
          </div>
        </div>
      );

    case 'backup-vault':
      return (
        <div className="bg-slate-900/90 p-5 rounded-xl border border-rose-500/30 my-4 shadow-lg space-y-4">
          <div className="flex items-center gap-2 mb-3 text-rose-400 font-semibold text-sm uppercase tracking-wider">
            <Shield className="w-4 h-4" /> Recovery Services Vault vs Azure Backup Vault
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-rose-950/30 rounded-xl border border-rose-700/50 space-y-2">
              <div className="font-bold text-rose-300 text-sm">Recovery Services Vault</div>
              <p className="text-slate-400 text-[11px]">Traditional IaaS & enterprise database protection</p>
              <ul className="space-y-1.5 text-slate-200 text-[11px] mt-2">
                <li className="flex items-center gap-1.5">✅ <strong>Azure Virtual Machines</strong> (Windows & Linux)</li>
                <li className="flex items-center gap-1.5">✅ SQL Server in Azure VMs</li>
                <li className="flex items-center gap-1.5">✅ SAP HANA in Azure VMs</li>
                <li className="flex items-center gap-1.5">✅ Azure Files shares</li>
                <li className="flex items-center gap-1.5">✅ <strong>Azure Site Recovery (ASR replication)</strong></li>
              </ul>
            </div>

            <div className="p-4 bg-sky-950/30 rounded-xl border border-sky-700/50 space-y-2">
              <div className="font-bold text-sky-300 text-sm">Azure Backup Vault</div>
              <p className="text-slate-400 text-[11px]">Cloud-native PaaS & modern workload protection</p>
              <ul className="space-y-1.5 text-slate-200 text-[11px] mt-2">
                <li className="flex items-center gap-1.5">✅ Azure Blobs (operational & vaulted backup)</li>
                <li className="flex items-center gap-1.5">✅ Azure Managed Disks</li>
                <li className="flex items-center gap-1.5">✅ Azure Database for PostgreSQL Flexible</li>
                <li className="flex items-center gap-1.5">✅ Azure Kubernetes Service (AKS) backup</li>
                <li className="flex items-center gap-1.5 text-rose-400 font-bold">❌ CANNOT back up Azure VMs directly!</li>
              </ul>
            </div>
          </div>
          <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800 text-[11px] text-amber-300 text-center font-medium">
            ⚠️ <strong>Exam Trap:</strong> If an AZ-104 question asks to back up an Azure VM, the answer is <em>ALWAYS</em> a <strong>Recovery Services Vault</strong>, NEVER an Azure Backup Vault!
          </div>
        </div>
      );

    default:
      return null;
  }
};
