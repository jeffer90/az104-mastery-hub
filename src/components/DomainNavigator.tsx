import type { DomainSection, StudyStatus } from '../types';
import { 
  ShieldCheck, 
  Database, 
  Server, 
  Network, 
  Activity, 
  ChevronRight, 
  ChevronDown, 
  CheckCircle2, 
  Clock, 
  Circle
} from 'lucide-react';

interface Props {
  domains: DomainSection[];
  selectedTopicId: string;
  onSelectTopic: (topicId: string) => void;
  topicStatuses: Record<string, StudyStatus>;
  openDomainId: string;
  onToggleDomain: (domainId: string) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  ShieldCheck: <ShieldCheck className="w-4 h-4 text-blue-400" />,
  Database: <Database className="w-4 h-4 text-amber-400" />,
  Server: <Server className="w-4 h-4 text-emerald-400" />,
  Network: <Network className="w-4 h-4 text-purple-400" />,
  Activity: <Activity className="w-4 h-4 text-rose-400" />,
};

export const DomainNavigator: React.FC<Props> = ({
  domains,
  selectedTopicId,
  onSelectTopic,
  topicStatuses,
  openDomainId,
  onToggleDomain
}) => {
  return (
    <aside className="w-full lg:w-80 flex-shrink-0 bg-slate-900/60 border-r border-slate-800/80 p-3 space-y-2 overflow-y-auto max-h-[calc(100vh-4rem)]">
      <div className="px-2 py-1.5 flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 mb-2">
        <span className="font-semibold uppercase tracking-wider text-[10px]">Official Exam Domains</span>
        <span>5 Domains</span>
      </div>

      {domains.map(domain => {
        const isOpen = openDomainId === domain.id;
        const total = domain.topics.length;
        const mastered = domain.topics.filter(t => topicStatuses[t.id] === 'mastered').length;

        return (
          <div key={domain.id} className="rounded-lg border border-slate-800/90 bg-slate-950/50 overflow-hidden">
            {/* Domain Header Button */}
            <button
              onClick={() => onToggleDomain(domain.id)}
              className="w-full px-3 py-2.5 flex items-center justify-between text-left hover:bg-slate-800/50 transition-all"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-1.5 rounded-md bg-slate-900 border border-slate-700/60 flex-shrink-0">
                  {iconMap[domain.iconName] || <Server className="w-4 h-4" />}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-200 truncate">
                      D{domain.number}: {domain.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400">
                    <span className={`px-1 rounded border ${domain.badgeBg}`}>{domain.weight}</span>
                    <span>{mastered}/{total} Mastered</span>
                  </div>
                </div>
              </div>

              <div className="text-slate-500 pl-2">
                {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </div>
            </button>

            {/* Subtopics List */}
            {isOpen && (
              <div className="py-1 px-2 border-t border-slate-800/70 space-y-1 bg-slate-950/80">
                {domain.topics.map(topic => {
                  const isSelected = selectedTopicId === topic.id;
                  const status = topicStatuses[topic.id] || 'not-started';

                  return (
                    <button
                      key={topic.id}
                      onClick={() => onSelectTopic(topic.id)}
                      className={`w-full text-left px-2.5 py-2 rounded-md text-xs flex items-start justify-between gap-2 transition-all ${
                        isSelected
                          ? 'bg-sky-600/20 text-sky-200 border border-sky-500/40 font-medium'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate leading-snug">{topic.title}</p>
                        <span className="text-[10px] text-slate-500">{topic.weightLabel}</span>
                      </div>

                      {/* Status Icon */}
                      <div className="pt-0.5 flex-shrink-0">
                        {status === 'mastered' && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                        {status === 'in-progress' && (
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                        )}
                        {status === 'not-started' && (
                          <Circle className="w-3.5 h-3.5 text-slate-600" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </aside>
  );
};
