import React from 'react';
import { allDomains, allTopics } from '../data/az104Data';
import type { StudyStatus } from '../types';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  RotateCcw, 
  Tablet
} from 'lucide-react';

interface Props {
  topicStatuses: Record<string, StudyStatus>;
  onStatusChange: (topicId: string, status: StudyStatus) => void;
  onSelectTopic: (topicId: string) => void;
  onResetProgress: () => void;
}

export const ReadinessDashboard: React.FC<Props> = ({
  topicStatuses,
  onStatusChange,
  onSelectTopic,
  onResetProgress
}) => {
  const total = allTopics.length;
  const mastered = allTopics.filter(t => topicStatuses[t.id] === 'mastered').length;
  const inProgress = allTopics.filter(t => topicStatuses[t.id] === 'in-progress').length;
  const readinessPercent = Math.round((mastered / Math.max(total, 1)) * 100);

  return (
    <div className="max-w-5xl mx-auto p-4 lg:p-8 space-y-8">
      {/* Hero Readiness Overview */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 lg:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center lg:text-left">
            <span className="text-xs uppercase font-bold text-sky-400 tracking-wider bg-sky-950/80 px-2.5 py-1 rounded-full border border-sky-800">
              Exam Readiness Score
            </span>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              AZ-104 Certification Tracker
            </h2>
            <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
              Track your mastery across all official exam skills measured. When your score reaches 100%, you have completed comprehensive coverage of all five domains, tricky gotchas, and portal walkthroughs.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>{mastered} Mastered</span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-400">
                <Clock className="w-4 h-4" />
                <span>{inProgress} Reviewing</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <Circle className="w-4 h-4" />
                <span>{total - mastered - inProgress} To Learn</span>
              </div>
            </div>
          </div>

          {/* Big Circular Meter */}
          <div className="flex-shrink-0 flex flex-col items-center">
            <div className="w-36 h-36 rounded-full border-4 border-slate-800 flex items-center justify-center relative p-1">
              <div
                className="w-full h-full rounded-full flex items-center justify-center"
                style={{
                  background: `conic-gradient(#38bdf8 ${readinessPercent * 3.6}deg, #1e293b 0deg)`
                }}
              >
                <div className="w-28 h-28 rounded-full bg-slate-950 flex flex-col items-center justify-center shadow-inner">
                  <span className="text-3xl font-black font-mono text-white">{readinessPercent}%</span>
                  <span className="text-[10px] uppercase font-bold text-sky-400">Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Domain Readiness Breakdown Meters */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-4">
        <h3 className="text-base font-bold text-white mb-2">Readiness by Domain Weight</h3>
        <div className="space-y-4">
          {allDomains.map(domain => {
            const domainTopics = domain.topics;
            const domainMastered = domainTopics.filter(t => topicStatuses[t.id] === 'mastered').length;
            const pct = Math.round((domainMastered / domainTopics.length) * 100);

            return (
              <div key={domain.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200">
                      Domain {domain.number}: {domain.title}
                    </span>
                    <span className={`text-[10px] px-1.5 rounded border ${domain.badgeBg}`}>
                      {domain.weight}
                    </span>
                  </div>
                  <span className="font-mono text-slate-400">{domainMastered}/{domainTopics.length} ({pct}%)</span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-sky-500 to-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tablet & S-Pen Optimized Fast Touch Checklist */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tablet className="w-5 h-5 text-sky-400" />
            <h3 className="text-base font-bold text-white">Interactive Study Checklist</h3>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Tap the button to cycle status: To Learn &rarr; Reviewing &rarr; Mastered
          </span>
        </div>

        <div className="space-y-3">
          {allDomains.map(domain => (
            <div key={domain.id} className="border border-slate-800/80 rounded-lg overflow-hidden bg-slate-950/40">
              <div className="bg-slate-900 px-4 py-2 text-xs font-bold text-sky-300 border-b border-slate-800 flex items-center justify-between">
                <span>Domain {domain.number}: {domain.title}</span>
                <span className="text-[10px] text-slate-400">{domain.weight}</span>
              </div>

              <div className="divide-y divide-slate-800/60">
                {domain.topics.map(topic => {
                  const status = topicStatuses[topic.id] || 'not-started';

                  const cycleStatus = () => {
                    if (status === 'not-started') onStatusChange(topic.id, 'in-progress');
                    else if (status === 'in-progress') onStatusChange(topic.id, 'mastered');
                    else onStatusChange(topic.id, 'not-started');
                  };

                  return (
                    <div
                      key={topic.id}
                      className="p-3.5 flex items-center justify-between gap-4 hover:bg-slate-900/40 transition-all text-xs"
                    >
                      <div className="min-w-0 flex-1 cursor-pointer" onClick={() => onSelectTopic(topic.id)}>
                        <h4 className="font-semibold text-slate-200 hover:text-sky-400 transition-all truncate">
                          {topic.title}
                        </h4>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">{topic.summary}</p>
                      </div>

                      {/* Tap to Toggle Status Button */}
                      <button
                        onClick={cycleStatus}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium text-xs transition-all flex-shrink-0 ${
                          status === 'mastered'
                            ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700/60'
                            : status === 'in-progress'
                            ? 'bg-amber-950/60 text-amber-300 border-amber-700/60'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {status === 'mastered' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                        {status === 'in-progress' && <Clock className="w-4 h-4 text-amber-400" />}
                        {status === 'not-started' && <Circle className="w-4 h-4 text-slate-500" />}
                        <span className="capitalize">{status === 'not-started' ? 'To Learn' : status}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Exam Strategy & Open-Book Tips */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <span>🎯</span> High-Yield Exam Day Strategies
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-1.5">
            <strong className="text-sky-400 font-bold block text-sm">1. Use the Built-In Microsoft Learn Window</strong>
            <p>
              The AZ-104 exam allows access to Microsoft Learn via a split-screen browser. Do NOT use it for every question (you will run out of time). Reserve it for exact syntax, CLI parameters, and obscure limits.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-1.5">
            <strong className="text-sky-400 font-bold block text-sm">2. Case Study Timing Strategy</strong>
            <p>
              Case studies usually appear at the very start or end of the exam. You cannot return to case study questions once you exit that section! Read the business and technical requirements first before looking at the exhibit.
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-1.5">
            <strong className="text-sky-400 font-bold block text-sm">3. Repeated Answer Scenarios</strong>
            <p>
              Some questions present the same scenario 3 times with different proposed solutions. You CANNOT go back once you answer. Evaluate each solution independently: does it achieve the goal?
            </p>
          </div>

          <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-1.5">
            <strong className="text-sky-400 font-bold block text-sm">4. Subnet IP Math Quick Check</strong>
            <p>
              Always immediately subtract 5 from the total IPs of the CIDR mask (.0, .1, .2, .3, .255). A /28 has 11 usable, /27 has 27 usable, /26 has 59 usable.
            </p>
          </div>
        </div>
      </div>

      {/* Reset Progress Action */}
      <div className="text-center pt-4">
        <button
          onClick={() => {
            if (confirm('Are you sure you want to reset all topic progress to "To Learn"?')) {
              onResetProgress();
            }
          }}
          className="text-xs text-slate-500 hover:text-rose-400 flex items-center gap-1.5 mx-auto transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Study Progress</span>
        </button>
      </div>
    </div>
  );
};
