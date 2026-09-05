import React, { useState } from 'react';
import type { TopicItem, StudyStatus } from '../types';
import { ArchitectureDiagram } from './ArchitectureDiagram';
import { PortalSimulator } from './PortalSimulator';
import { 
  BookOpen, 
  SlidersHorizontal, 
  AlertTriangle, 
  Hash, 
  Terminal, 
  HelpCircle, 
  CheckCircle2, 
  Clock, 
  Circle, 
  Copy, 
  Check, 
  Sparkles
} from 'lucide-react';

interface Props {
  topic: TopicItem;
  status: StudyStatus;
  onStatusChange: (status: StudyStatus) => void;
  onNextTopic?: () => void;
  onPrevTopic?: () => void;
}

type DetailTab = 'concept' | 'portal' | 'traps' | 'numbers' | 'cli' | 'quiz';

export const TopicDetail: React.FC<Props> = ({
  topic,
  status,
  onStatusChange,
  onNextTopic,
  onPrevTopic
}) => {
  const [activeTab, setActiveTab] = useState<DetailTab>('concept');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState<Record<string, boolean>>({});

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSelectAnswer = (questionId: string, optionIndex: number) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
    setShowResults(prev => ({ ...prev, [questionId]: true }));
  };

  return (
    <div className="flex-1 p-4 lg:p-8 max-w-5xl mx-auto overflow-y-auto">
      {/* Top Banner with Title, Meta, and Status Selector */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-sky-950 text-sky-400 border border-sky-800">
            {topic.domainId.toUpperCase()}
          </span>
          <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
            {topic.weightLabel}
          </span>
        </div>

        <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight leading-tight">
          {topic.title}
        </h1>

        <p className="text-sm text-slate-300 mt-2 leading-relaxed max-w-3xl">
          {topic.summary}
        </p>

        {/* Study Progress Toggle Controls */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Study Mastery:</span>
            <div className="inline-flex rounded-lg bg-slate-950 p-1 border border-slate-800 text-xs">
              <button
                onClick={() => onStatusChange('not-started')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded transition-all ${
                  status === 'not-started'
                    ? 'bg-slate-800 text-slate-200 shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Circle className="w-3.5 h-3.5" />
                <span>To Learn</span>
              </button>

              <button
                onClick={() => onStatusChange('in-progress')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded transition-all ${
                  status === 'in-progress'
                    ? 'bg-amber-950/80 text-amber-300 border border-amber-800/50 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Reviewing</span>
              </button>

              <button
                onClick={() => onStatusChange('mastered')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded transition-all ${
                  status === 'mastered'
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/50 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Mastered</span>
              </button>
            </div>
          </div>

          {/* Prev/Next buttons */}
          <div className="flex items-center gap-2 text-xs">
            {onPrevTopic && (
              <button
                onClick={onPrevTopic}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition-all"
              >
                &larr; Previous Topic
              </button>
            )}
            {onNextTopic && (
              <button
                onClick={onNextTopic}
                className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded font-medium shadow-md shadow-sky-600/20 transition-all"
              >
                Next Topic &rarr;
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="mt-6 border-b border-slate-800 flex items-center gap-1 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setActiveTab('concept')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg font-medium transition-all whitespace-nowrap ${
            activeTab === 'concept'
              ? 'bg-slate-900 text-sky-400 border-t-2 border-sky-400 border-x border-slate-800'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Core Concepts</span>
        </button>

        <button
          onClick={() => setActiveTab('portal')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg font-medium transition-all whitespace-nowrap ${
            activeTab === 'portal'
              ? 'bg-slate-900 text-sky-400 border-t-2 border-sky-400 border-x border-slate-800'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Azure Portal Simulator</span>
        </button>

        <button
          onClick={() => setActiveTab('traps')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg font-medium transition-all whitespace-nowrap ${
            activeTab === 'traps'
              ? 'bg-slate-900 text-amber-400 border-t-2 border-amber-400 border-x border-slate-800'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>Exam Traps ({topic.examTraps.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('numbers')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg font-medium transition-all whitespace-nowrap ${
            activeTab === 'numbers'
              ? 'bg-slate-900 text-sky-400 border-t-2 border-sky-400 border-x border-slate-800'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
          }`}
        >
          <Hash className="w-4 h-4" />
          <span>Key Numbers ({topic.keyNumbers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('cli')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg font-medium transition-all whitespace-nowrap ${
            activeTab === 'cli'
              ? 'bg-slate-900 text-sky-400 border-t-2 border-sky-400 border-x border-slate-800'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>CLI & PowerShell</span>
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg font-medium transition-all whitespace-nowrap ${
            activeTab === 'quiz'
              ? 'bg-slate-900 text-emerald-400 border-t-2 border-emerald-400 border-x border-slate-800'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-emerald-400" />
          <span>Knowledge Check ({topic.quiz.length})</span>
        </button>
      </div>

      {/* Sub-Tab Content Rendering */}
      <div className="pt-6">
        {/* TAB 1: CORE CONCEPTS */}
        {activeTab === 'concept' && (
          <div className="space-y-8">
            {topic.coreConcepts.map((concept, idx) => (
              <section key={idx} className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-sky-950 text-sky-400 flex items-center justify-center text-xs font-mono border border-sky-800">
                    {idx + 1}
                  </span>
                  <span>{concept.heading}</span>
                </h3>

                <p className="text-sm text-slate-300 leading-relaxed mb-4">
                  {concept.content}
                </p>

                {/* Optional Architecture Diagram */}
                {concept.diagramType && (
                  <ArchitectureDiagram type={concept.diagramType} />
                )}

                {/* Key Points Bullet List */}
                <div className="mt-4 p-4 bg-slate-950/60 rounded-lg border border-slate-800/80 space-y-2">
                  <h4 className="text-xs font-semibold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> What You Must Know for the Exam:
                  </h4>
                  <ul className="space-y-2">
                    {concept.keyPoints.map((point, pIdx) => (
                      <li key={pIdx} className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
                        <span className="text-sky-400 mt-0.5">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            ))}
          </div>
        )}

        {/* TAB 2: PORTAL WALKTHROUGH & SIMULATOR */}
        {activeTab === 'portal' && (
          <div className="space-y-6">
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5">
              <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-sky-400" />
                <span>How to Navigate in the Azure Portal</span>
              </h3>
              <p className="text-xs text-slate-300 mb-4">{topic.portalWalkthrough.overview}</p>

              {/* Click Path Steps */}
              <div className="space-y-3">
                {topic.portalWalkthrough.steps.map((step) => (
                  <div key={step.stepNumber} className="bg-slate-950/70 p-4 rounded-lg border border-slate-800/80">
                    <div className="flex items-center gap-2 text-xs font-bold text-sky-300 mb-1">
                      <span className="w-5 h-5 rounded-full bg-sky-900/80 text-sky-200 flex items-center justify-center text-[10px]">
                        {step.stepNumber}
                      </span>
                      <span>{step.title}</span>
                    </div>

                    <div className="text-xs font-mono text-cyan-400 bg-slate-900 px-2.5 py-1 rounded my-1.5 border border-slate-800 inline-block">
                      📍 Path: {step.portalPath}
                    </div>

                    <p className="text-xs text-slate-300 mt-1">{step.description}</p>

                    <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {step.keyFields.map((field, fIdx) => (
                        <div key={fIdx} className="bg-slate-900/60 p-2 rounded border border-slate-800">
                          <span className="text-slate-400 block text-[11px]">{field.name}:</span>
                          <span className="font-mono text-emerald-300 font-medium">{field.value}</span>
                          {field.hint && (
                            <span className="text-[10px] text-amber-300/90 block mt-0.5">{field.hint}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Blade Simulator */}
            <div>
              <h4 className="text-sm font-bold text-white mb-2">
                Interactive Portal Blade Simulator (Try It Out!)
              </h4>
              <PortalSimulator blade={topic.portalWalkthrough.interactiveBlade} />
            </div>
          </div>
        )}

        {/* TAB 3: EXAM TRAPS */}
        {activeTab === 'traps' && (
          <div className="space-y-4">
            {topic.examTraps.map((trap, idx) => (
              <div key={idx} className="bg-rose-950/20 border border-rose-800/50 rounded-xl p-5 shadow-lg">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm mb-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>TRAP #{idx + 1}: {trap.trapTitle}</span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                    <strong className="text-slate-300 block mb-1">Scenario:</strong>
                    <p className="text-slate-300 italic">{trap.scenario}</p>
                  </div>

                  <div className="bg-amber-950/30 p-3 rounded-lg border border-amber-800/40 text-amber-200">
                    <strong className="text-amber-300 block mb-1">Why It Tricks Candidates:</strong>
                    <p>{trap.whyItTricksPeople}</p>
                  </div>

                  <div className="bg-emerald-950/40 p-3 rounded-lg border border-emerald-700/50 text-emerald-200">
                    <strong className="text-emerald-300 block mb-1">The Rule to Answer Correctly:</strong>
                    <p className="font-semibold">{trap.correctAnswerRule}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: KEY NUMBERS & LIMITS */}
        {activeTab === 'numbers' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {topic.keyNumbers.map((num, idx) => (
              <div key={idx} className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 flex flex-col justify-between">
                <div>
                  <span className="text-xs text-slate-400 block mb-1">{num.label}</span>
                  <div className="text-xl font-bold font-mono text-sky-400">{num.value}</div>
                </div>
                <p className="text-xs text-slate-300 mt-2 pt-2 border-t border-slate-800">{num.context}</p>
              </div>
            ))}
          </div>
        )}

        {/* TAB 5: CLI & POWERSHELL */}
        {activeTab === 'cli' && (
          <div className="space-y-4">
            {topic.cliSnippets.map((snippet, idx) => (
              <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                <div className="bg-slate-900/80 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">{snippet.title}</span>
                  <span className="text-[10px] text-slate-400">{snippet.explanation}</span>
                </div>

                <div className="p-4 space-y-3">
                  {/* Azure CLI */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-sky-400 font-semibold mb-1">
                      <span>Azure CLI (Bash):</span>
                      <button
                        onClick={() => handleCopy(snippet.cli, idx * 2)}
                        className="text-slate-400 hover:text-white flex items-center gap-1"
                      >
                        {copiedIndex === idx * 2 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedIndex === idx * 2 ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <pre className="bg-slate-900 p-3 rounded text-xs font-mono text-sky-200 overflow-x-auto">
                      <code>{snippet.cli}</code>
                    </pre>
                  </div>

                  {/* PowerShell */}
                  {snippet.powershell && (
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-indigo-400 font-semibold mb-1">
                        <span>Azure PowerShell:</span>
                        <button
                          onClick={() => handleCopy(snippet.powershell!, idx * 2 + 1)}
                          className="text-slate-400 hover:text-white flex items-center gap-1"
                        >
                          {copiedIndex === idx * 2 + 1 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedIndex === idx * 2 + 1 ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <pre className="bg-slate-900 p-3 rounded text-xs font-mono text-indigo-200 overflow-x-auto">
                        <code>{snippet.powershell}</code>
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 6: KNOWLEDGE CHECK */}
        {activeTab === 'quiz' && (
          <div className="space-y-6">
            {topic.quiz.map((q, qIdx) => {
              const selectedOpt = selectedAnswers[q.id];
              const isAnswered = showResults[q.id];
              const isCorrect = selectedOpt === q.correctAnswer;

              return (
                <div key={q.id} className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="px-2 py-0.5 rounded bg-slate-800 font-bold font-mono text-sky-400">
                      Question {qIdx + 1} of {topic.quiz.length}
                    </span>
                    <span>Scenario-based question</span>
                  </div>

                  <p className="text-sm font-medium text-slate-100 leading-relaxed">
                    {q.scenario}
                  </p>

                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      let btnStyle = 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900';

                      if (isAnswered) {
                        if (optIdx === q.correctAnswer) {
                          btnStyle = 'bg-emerald-950/70 border-emerald-600 text-emerald-200 font-semibold';
                        } else if (selectedOpt === optIdx) {
                          btnStyle = 'bg-rose-950/70 border-rose-600 text-rose-200';
                        } else {
                          btnStyle = 'bg-slate-950/30 border-slate-900 text-slate-500 opacity-60';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectAnswer(q.id, optIdx)}
                          disabled={isAnswered}
                          className={`w-full text-left p-3 rounded-lg border text-xs flex items-start gap-3 transition-all ${btnStyle}`}
                        >
                          <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center font-mono text-[11px] flex-shrink-0 mt-0.5">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="flex-1 leading-normal">{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback on Answer */}
                  {isAnswered && (
                    <div className={`p-4 rounded-lg border text-xs space-y-2 ${
                      isCorrect ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-200' : 'bg-rose-950/40 border-rose-700/60 text-rose-200'
                    }`}>
                      <div className="font-bold flex items-center gap-2">
                        {isCorrect ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>Correct! Outstanding work.</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-4 h-4 text-rose-400" />
                            <span>Incorrect. Review the explanation below:</span>
                          </>
                        )}
                      </div>

                      <p className="leading-relaxed text-slate-200">{q.explanation}</p>

                      {q.trapAlert && (
                        <div className="pt-2 border-t border-slate-700/50 text-[11px] text-amber-300">
                          ⚠️ <strong>Exam Trap Alert:</strong> {q.trapAlert}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
