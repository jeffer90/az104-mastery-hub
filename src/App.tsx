import { useState, useEffect, useMemo } from 'react';
import { allDomains, allTopics, getTopicById, getDomainByTopicId } from './data/az104Data';
import type { StudyStatus } from './types';
import { Header } from './components/Header';
import type { ViewMode } from './components/Header';
import { DomainNavigator } from './components/DomainNavigator';
import { TopicDetail } from './components/TopicDetail';
import { PortalSimulator } from './components/PortalSimulator';
import { PracticeQuiz } from './components/PracticeQuiz';
import { ReadinessDashboard } from './components/ReadinessDashboard';
import { ArrowRight, SlidersHorizontal, BookOpen } from 'lucide-react';

export function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('study');
  const [selectedTopicId, setSelectedTopicId] = useState<string>(allTopics[0]?.id || 'd1-entra-id-users-groups');
  const [openDomainId, setOpenDomainId] = useState<string>('domain-1');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // LocalStorage persistence for study progress
  const [topicStatuses, setTopicStatuses] = useState<Record<string, StudyStatus>>(() => {
    try {
      const saved = localStorage.getItem('az104_study_progress');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {};
  });

  useEffect(() => {
    try {
      localStorage.setItem('az104_study_progress', JSON.stringify(topicStatuses));
    } catch {
      // ignore
    }
  }, [topicStatuses]);

  const handleStatusChange = (topicId: string, status: StudyStatus) => {
    setTopicStatuses(prev => ({
      ...prev,
      [topicId]: status
    }));
  };

  const handleResetProgress = () => {
    setTopicStatuses({});
  };

  const currentTopic = useMemo(() => {
    return getTopicById(selectedTopicId) || allTopics[0];
  }, [selectedTopicId]);

  // Keep open domain synced with current topic's domain
  const handleSelectTopic = (topicId: string) => {
    setSelectedTopicId(topicId);
    const domain = getDomainByTopicId(topicId);
    if (domain) {
      setOpenDomainId(domain.id);
    }
    setCurrentView('study');
  };

  // Next / Prev topic navigation
  const currentIndex = allTopics.findIndex(t => t.id === selectedTopicId);
  const nextTopic = allTopics[currentIndex + 1];
  const prevTopic = allTopics[currentIndex - 1];

  // Search Results filtering
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return allTopics.filter(t => {
      const inTitle = t.title.toLowerCase().includes(q);
      const inSummary = t.summary.toLowerCase().includes(q);
      const inTraps = t.examTraps.some(trap => 
        trap.trapTitle.toLowerCase().includes(q) || 
        trap.scenario.toLowerCase().includes(q) ||
        trap.correctAnswerRule.toLowerCase().includes(q)
      );
      const inCli = t.cliSnippets.some(c => c.cli.toLowerCase().includes(q) || c.title.toLowerCase().includes(q));
      const inNumbers = t.keyNumbers.some(n => n.label.toLowerCase().includes(q) || n.value.toLowerCase().includes(q));
      return inTitle || inSummary || inTraps || inCli || inNumbers;
    });
  }, [searchQuery]);

  const masteredCount = allTopics.filter(t => topicStatuses[t.id] === 'mastered').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-sky-500/30">
      {/* Header */}
      <Header
        currentView={currentView}
        onSelectView={setCurrentView}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        masteredCount={masteredCount}
        totalTopics={allTopics.length}
      />

      {/* Main Container */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden max-w-7xl w-full mx-auto">
        {/* Search Results Overlay View */}
        {searchQuery.trim() !== '' ? (
          <div className="flex-1 p-6 max-w-4xl mx-auto space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-200">
                Found {searchResults.length} results for "{searchQuery}"
              </h2>
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-sky-400 hover:underline"
              >
                Clear Search
              </button>
            </div>

            {searchResults.length === 0 ? (
              <div className="p-8 text-center bg-slate-900/50 rounded-xl border border-slate-800 text-slate-400 text-xs">
                No matching topics or exam traps found. Try searching for "UDR", "SSPR", "SAS", "ASG", "Bastion", or "Backup".
              </div>
            ) : (
              <div className="space-y-3">
                {searchResults.map(topic => (
                  <div
                    key={topic.id}
                    onClick={() => {
                      handleSelectTopic(topic.id);
                      setSearchQuery('');
                    }}
                    className="p-4 bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-sky-500/50 rounded-xl cursor-pointer transition-all space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800">
                        {topic.domainId.toUpperCase()}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                        <span>Jump to topic</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white">{topic.title}</h3>
                    <p className="text-xs text-slate-300">{topic.summary}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            {/* View 1: Study Mode */}
            {currentView === 'study' && (
              <>
                <DomainNavigator
                  domains={allDomains}
                  selectedTopicId={selectedTopicId}
                  onSelectTopic={handleSelectTopic}
                  topicStatuses={topicStatuses}
                  openDomainId={openDomainId}
                  onToggleDomain={id => setOpenDomainId(prev => (prev === id ? '' : id))}
                />

                <TopicDetail
                  topic={currentTopic}
                  status={topicStatuses[currentTopic.id] || 'not-started'}
                  onStatusChange={status => handleStatusChange(currentTopic.id, status)}
                  onNextTopic={nextTopic ? () => handleSelectTopic(nextTopic.id) : undefined}
                  onPrevTopic={prevTopic ? () => handleSelectTopic(prevTopic.id) : undefined}
                />
              </>
            )}

            {/* View 2: Portal Simulator Gallery Mode */}
            {currentView === 'portal' && (
              <div className="flex-1 p-4 lg:p-8 max-w-5xl mx-auto space-y-6 overflow-y-auto">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                      <SlidersHorizontal className="w-5 h-5 text-sky-400" />
                      <span>Azure Portal Blade Simulator Suite</span>
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">
                      Interact with simulated Azure Portal blades across all 5 domains to practice setting up resources and discovering exam gotchas.
                    </p>
                  </div>
                </div>

                {/* Resource Blade Selector Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
                  {allTopics.map(topic => (
                    <button
                      key={topic.id}
                      onClick={() => setSelectedTopicId(topic.id)}
                      className={`px-3 py-2 rounded-lg font-medium whitespace-nowrap transition-all border ${
                        selectedTopicId === topic.id
                          ? 'bg-sky-600 text-white border-sky-500 shadow-md shadow-sky-600/30'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {topic.portalWalkthrough.interactiveBlade.resourceName}
                    </button>
                  ))}
                </div>

                {/* Render Selected Interactive Blade */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>
                      Topic Context: <strong className="text-slate-200">{currentTopic.title}</strong>
                    </span>
                    <button
                      onClick={() => setCurrentView('study')}
                      className="text-sky-400 hover:underline flex items-center gap-1"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Read Topic Concepts</span>
                    </button>
                  </div>

                  <PortalSimulator blade={currentTopic.portalWalkthrough.interactiveBlade} />
                </div>
              </div>
            )}

            {/* View 3: Practice Quiz Mode */}
            {currentView === 'quiz' && (
              <PracticeQuiz onSelectTopic={handleSelectTopic} />
            )}

            {/* View 4: Readiness Dashboard Mode */}
            {currentView === 'readiness' && (
              <ReadinessDashboard
                topicStatuses={topicStatuses}
                onStatusChange={handleStatusChange}
                onSelectTopic={handleSelectTopic}
                onResetProgress={handleResetProgress}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
export default App;
