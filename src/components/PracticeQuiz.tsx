import React, { useState } from 'react';
import { allDomains, allTopics } from '../data/az104Data';
import type { QuizQuestion, TopicItem } from '../types';
import { 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ArrowRight,
  Filter,
  Clock
} from 'lucide-react';

interface Props {
  onSelectTopic: (topicId: string) => void;
}

interface EnrichedQuestion extends QuizQuestion {
  topic: TopicItem;
}

export const PracticeQuiz: React.FC<Props> = ({ onSelectTopic }) => {
  const [selectedDomainId, setSelectedDomainId] = useState<string>('all');
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  // Extract all questions with their corresponding topic
  const allQuestions: EnrichedQuestion[] = allTopics.flatMap(topic =>
    topic.quiz.map(q => ({
      ...q,
      topic
    }))
  );

  const filteredQuestions = selectedDomainId === 'all'
    ? allQuestions
    : allQuestions.filter(q => q.topic.domainId === selectedDomainId);

  const handleOptionSelect = (questionId: string, optionIndex: number) => {
    if (submitted) return;
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleReset = () => {
    setUserAnswers({});
    setSubmitted(false);
  };

  // Score Calculation
  const totalCount = filteredQuestions.length;
  const answeredCount = Object.keys(userAnswers).length;
  const correctCount = filteredQuestions.filter(q => userAnswers[q.id] === q.correctAnswer).length;
  const scorePercent = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
  const passed = scorePercent >= 70; // 700/1000 passing threshold

  return (
    <div className="max-w-4xl mx-auto p-4 lg:p-8 space-y-6">
      {/* Quiz Header & Filters */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h2 className="text-xl font-bold text-white tracking-tight">AZ-104 Scenario Practice Exam</h2>
          </div>
          <p className="text-xs text-slate-400">
            Official question types: scenario questions, multi-tier dependencies, and high-yield traps.
          </p>
        </div>

        {/* Domain Filter Dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedDomainId}
            onChange={e => {
              setSelectedDomainId(e.target.value);
              handleReset();
            }}
            className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-500 font-mono"
          >
            <option value="all">All 5 Domains (Comprehensive)</option>
            {allDomains.map(d => (
              <option key={d.id} value={d.id}>
                D{d.number}: {d.title} ({d.weight})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Score / Results Banner (When Submitted) */}
      {submitted ? (
        <div className={`p-6 rounded-xl border ${
          passed
            ? 'bg-emerald-950/40 border-emerald-600/60 text-emerald-200'
            : 'bg-rose-950/40 border-rose-600/60 text-rose-200'
        } shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4`}>
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl ${
              passed ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30' : 'bg-rose-600 text-white'
            }`}>
              {scorePercent}%
            </div>
            <div>
              <h3 className="text-lg font-bold">
                {passed ? '🎉 Congratulations! You Passed!' : 'Keep Studying! Passing is 70%'}
              </h3>
              <p className="text-xs opacity-90 mt-0.5">
                You answered {correctCount} of {totalCount} questions correctly ({scorePercent}%). Passing score is 700 / 1000.
              </p>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-semibold text-white hover:bg-slate-800 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Practice Exam</span>
          </button>
        </div>
      ) : (
        /* Progress Status before Submission */
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-sky-400" />
            <span>Answered: <strong>{answeredCount}</strong> of <strong>{totalCount}</strong></span>
          </div>

          {answeredCount === totalCount && (
            <button
              onClick={() => setSubmitted(true)}
              className="bg-sky-600 hover:bg-sky-500 text-white px-5 py-2 rounded-lg font-bold text-xs shadow-lg shadow-sky-600/30 animate-bounce"
            >
              Grade Exam Now &rarr;
            </button>
          )}
        </div>
      )}

      {/* Question Cards */}
      <div className="space-y-6">
        {filteredQuestions.map((q, idx) => {
          const selectedOption = userAnswers[q.id];
          const isCorrect = selectedOption === q.correctAnswer;

          return (
            <div
              key={q.id}
              className={`bg-slate-900/70 border rounded-xl p-5 space-y-4 transition-all ${
                submitted
                  ? isCorrect
                    ? 'border-emerald-700/60 bg-emerald-950/10'
                    : 'border-rose-700/60 bg-rose-950/10'
                  : 'border-slate-800'
              }`}
            >
              {/* Question Metadata */}
              <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800/60">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-slate-800 text-sky-400 flex items-center justify-center font-mono font-bold text-[11px]">
                    {idx + 1}
                  </span>
                  <span className="font-medium text-slate-300">
                    Topic: {q.topic.title}
                  </span>
                </div>

                <button
                  onClick={() => onSelectTopic(q.topic.id)}
                  className="text-sky-400 hover:text-sky-300 text-[11px] underline flex items-center gap-1"
                >
                  <span>Review Study Module</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Scenario Prompt */}
              <p className="text-sm text-slate-100 font-medium leading-relaxed">
                {q.scenario}
              </p>

              {/* Options */}
              <div className="space-y-2">
                {q.options.map((opt, optIdx) => {
                  let optStyle = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700';

                  if (selectedOption === optIdx) {
                    optStyle = 'bg-sky-950/50 border-sky-600 text-sky-200 font-semibold';
                  }

                  if (submitted) {
                    if (optIdx === q.correctAnswer) {
                      optStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-100 font-bold';
                    } else if (selectedOption === optIdx && !isCorrect) {
                      optStyle = 'bg-rose-950/80 border-rose-500 text-rose-100 line-through';
                    } else {
                      optStyle = 'bg-slate-950/40 border-slate-900 text-slate-500 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleOptionSelect(q.id, optIdx)}
                      disabled={submitted}
                      className={`w-full text-left p-3 rounded-lg border text-xs flex items-start gap-3 transition-all ${optStyle}`}
                    >
                      <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center font-mono text-[10px] flex-shrink-0 mt-0.5">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="flex-1 leading-normal">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation & Trap Alert (Visible on Submit) */}
              {submitted && (
                <div className={`p-4 rounded-lg border text-xs space-y-2 ${
                  isCorrect
                    ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-200'
                    : 'bg-rose-950/30 border-rose-800/50 text-rose-200'
                }`}>
                  <div className="font-bold flex items-center gap-1.5">
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Correct</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-rose-400" />
                        <span>Incorrect (Correct answer was option {String.fromCharCode(65 + q.correctAnswer)})</span>
                      </>
                    )}
                  </div>
                  <p className="text-slate-200 leading-relaxed">{q.explanation}</p>
                  {q.trapAlert && (
                    <div className="pt-2 border-t border-slate-700/50 text-[11px] text-amber-300">
                      ⚠️ <strong>Trap Warning:</strong> {q.trapAlert}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Submit Action */}
      {!submitted && answeredCount > 0 && (
        <div className="sticky bottom-4 bg-slate-900/95 backdrop-blur-md p-4 rounded-xl border border-slate-800 shadow-2xl flex items-center justify-between">
          <span className="text-xs text-slate-300">
            {answeredCount} of {totalCount} completed
          </span>
          <button
            onClick={() => setSubmitted(true)}
            className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs px-6 py-2.5 rounded-lg shadow-lg shadow-sky-600/30 transition-all"
          >
            Submit & Grade All Questions
          </button>
        </div>
      )}
    </div>
  );
};
