import React from 'react';
import { 
  ShieldCheck, 
  Search, 
  BookOpen, 
  SlidersHorizontal, 
  HelpCircle, 
  CheckCircle
} from 'lucide-react';

export type ViewMode = 'study' | 'portal' | 'quiz' | 'readiness';

interface Props {
  currentView: ViewMode;
  onSelectView: (view: ViewMode) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  masteredCount: number;
  totalTopics: number;
}

export const Header: React.FC<Props> = ({
  currentView,
  onSelectView,
  searchQuery,
  onSearchChange,
  masteredCount,
  totalTopics
}) => {
  const readinessPercent = Math.round((masteredCount / Math.max(totalTopics, 1)) * 100);

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Logo & Subtitle */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onSelectView('study')}>
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-sky-400 p-0.5 shadow-lg shadow-sky-500/20 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-slate-950 font-black" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base text-white tracking-tight">AZ-104 Mastery Hub</span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800">
                  Associate
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Microsoft Certified: Azure Administrator</p>
            </div>
          </div>

          {/* Readiness Badge on Mobile */}
          <div className="md:hidden flex items-center gap-2 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-full text-xs">
            <span className="text-slate-400">Ready:</span>
            <span className="font-mono font-bold text-sky-400">{readinessPercent}%</span>
          </div>
        </div>

        {/* Center Search Input */}
        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search topics, CLI, or traps (e.g. UDR, SSPR, SAS)..."
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-700/70 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-all font-mono"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-2 text-slate-400 hover:text-white text-xs px-1"
            >
              ✕
            </button>
          )}
        </div>

        {/* View Switcher Tabs & Desktop Readiness */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end overflow-x-auto">
          <nav className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => onSelectView('study')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                currentView === 'study'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Study</span>
            </button>

            <button
              onClick={() => onSelectView('portal')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                currentView === 'portal'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Portal Blades</span>
            </button>

            <button
              onClick={() => onSelectView('quiz')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                currentView === 'quiz'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Practice Quiz</span>
            </button>

            <button
              onClick={() => onSelectView('readiness')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                currentView === 'readiness'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Readiness</span>
            </button>
          </nav>

          {/* Desktop Overall Readiness meter */}
          <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-slate-800 text-xs">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Exam Readiness</span>
              <span className="font-mono font-bold text-sky-400">{readinessPercent}%</span>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-slate-700 flex items-center justify-center p-0.5">
              <div
                className="w-full h-full rounded-full flex items-center justify-center text-[10px] font-bold text-sky-300"
                style={{
                  background: `conic-gradient(#38bdf8 ${readinessPercent * 3.6}deg, #1e293b 0deg)`
                }}
              >
                <div className="w-7 h-7 rounded-full bg-slate-950 flex items-center justify-center">
                  {masteredCount}/{totalTopics}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
