import React, { useState } from 'react';
import type { InteractiveBlade } from '../types';
import { 
  Bell, 
  Terminal, 
  Settings, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Check, 
  Save, 
  RefreshCw
} from 'lucide-react';

interface Props {
  blade: InteractiveBlade;
}

export const PortalSimulator: React.FC<Props> = ({ blade }) => {
  const [activeTabId, setActiveTabId] = useState<string>(blade.tabs[0]?.id || 'basics');
  const [fieldValues, setFieldValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    blade.tabs.forEach(tab => {
      tab.fields.forEach(f => {
        initial[f.id] = f.currentValue;
      });
    });
    return initial;
  });

  const [validationPassed, setValidationPassed] = useState<boolean>(false);

  const handleFieldChange = (fieldId: string, value: string) => {
    setFieldValues(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const activeTab = blade.tabs.find(t => t.id === activeTabId);

  return (
    <div className="bg-slate-900 border border-slate-700/80 rounded-xl overflow-hidden shadow-2xl my-6">
      {/* Top Simulated Azure Portal Header */}
      <div className="bg-[#002456] text-white px-4 py-2.5 flex items-center justify-between border-b border-blue-900/50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-semibold text-sm">
            <div className="w-4 h-4 bg-sky-400 rounded-sm flex items-center justify-center text-[10px] font-bold text-slate-950">
              A
            </div>
            <span>Microsoft Azure</span>
          </div>
          <span className="text-slate-400 text-xs hidden sm:inline">|</span>
          <span className="text-xs text-sky-200 hidden sm:inline">Interactive Portal Simulator</span>
        </div>

        {/* Mock Search Bar */}
        <div className="hidden md:flex items-center bg-slate-900/50 border border-slate-700/60 rounded px-3 py-1 text-xs text-slate-300 w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 mr-2" />
          <span className="truncate">Search resources, services, and docs (G+/)</span>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-3 text-slate-300 text-xs">
          <button className="hover:text-white p-1 rounded hover:bg-white/10" title="Cloud Shell">
            <Terminal className="w-4 h-4" />
          </button>
          <button className="hover:text-white p-1 rounded hover:bg-white/10" title="Notifications">
            <Bell className="w-4 h-4" />
          </button>
          <button className="hover:text-white p-1 rounded hover:bg-white/10" title="Portal Settings">
            <Settings className="w-4 h-4" />
          </button>
          <div className="w-6 h-6 rounded-full bg-sky-500 text-slate-950 font-bold flex items-center justify-center text-[11px]">
            AZ
          </div>
        </div>
      </div>

      {/* Breadcrumb Bar */}
      <div className="bg-slate-950/80 px-4 py-1.5 text-xs text-slate-400 border-b border-slate-800 flex items-center gap-2">
        <span className="hover:underline cursor-pointer text-slate-300">Home</span>
        <span>&gt;</span>
        <span className="hover:underline cursor-pointer text-slate-300">{blade.serviceCategory}</span>
        <span>&gt;</span>
        <span className="text-sky-400 font-medium">{blade.resourceName}</span>
      </div>

      {/* Command Bar */}
      <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center gap-4 text-xs">
        <button 
          onClick={() => setValidationPassed(true)}
          className="flex items-center gap-1.5 text-sky-400 hover:text-sky-300 font-medium px-2 py-1 rounded hover:bg-slate-800"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save & Validate</span>
        </button>
        <button 
          onClick={() => setValidationPassed(false)}
          className="flex items-center gap-1.5 text-slate-400 hover:text-slate-300 px-2 py-1 rounded hover:bg-slate-800"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
        {validationPassed && (
          <span className="ml-auto flex items-center gap-1.5 text-emerald-400 text-xs font-semibold bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-0.5 rounded">
            <CheckCircle2 className="w-3.5 h-3.5" /> Validation passed
          </span>
        )}
      </div>

      {/* Portal Tabs Bar */}
      <div className="bg-slate-950/60 px-4 flex items-center gap-1 border-b border-slate-800 overflow-x-auto">
        {blade.tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTabId(tab.id)}
            className={`py-2.5 px-3.5 text-xs font-medium border-b-2 transition-all whitespace-nowrap ${
              activeTabId === tab.id
                ? 'border-sky-400 text-sky-300 bg-slate-900/50'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
        <button
          onClick={() => setActiveTabId('review-create')}
          className={`py-2.5 px-3.5 text-xs font-medium border-b-2 transition-all whitespace-nowrap ${
            activeTabId === 'review-create'
              ? 'border-sky-400 text-sky-300 bg-slate-900/50'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
          }`}
        >
          Review + create
        </button>
      </div>

      {/* Blade Form Content */}
      <div className="p-5 min-h-[300px] bg-slate-900/90 text-sm">
        {activeTabId === 'review-create' ? (
          <div className="space-y-4">
            <div className="p-3 bg-emerald-950/40 border border-emerald-700/50 rounded-lg flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-emerald-300 text-sm">Validation Passed</h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  All configuration settings conform to Azure Resource Manager constraints and naming conventions.
                </p>
              </div>
            </div>

            <div className="border border-slate-800 rounded-lg p-4 bg-slate-950/50">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
                Summary of Configured Properties
              </h4>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-xs">
                {blade.tabs.flatMap(t => t.fields).map(field => (
                  <div key={field.id} className="flex justify-between py-1 border-b border-slate-800/60">
                    <dt className="text-slate-400">{field.label}:</dt>
                    <dd className="font-mono text-sky-300 font-medium">
                      {fieldValues[field.id] ?? field.currentValue}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <button
              onClick={() => alert('Azure deployment simulation initiated! In real Azure, this calls the Azure Resource Manager API to provision resources.')}
              className="bg-sky-600 hover:bg-sky-500 text-white font-medium px-5 py-2 rounded text-xs shadow-lg shadow-sky-600/30 flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Simulate Provision Resource</span>
            </button>
          </div>
        ) : (
          <div className="space-y-6 max-w-2xl">
            {activeTab?.fields.map(field => {
              const currentValue = fieldValues[field.id] ?? field.currentValue;

              return (
                <div key={field.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                      <span>{field.label}</span>
                      {field.helpText && (
                        <span title={field.helpText} className="text-slate-500 hover:text-slate-300 cursor-help">
                          <HelpCircle className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </label>
                  </div>

                  {/* Render based on field type */}
                  {field.type === 'select' && (
                    <select
                      value={currentValue}
                      onChange={e => handleFieldChange(field.id, e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500 font-mono"
                    >
                      {field.options?.map(opt => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  )}

                  {field.type === 'radio' && (
                    <div className="space-y-2">
                      {field.options?.map(opt => (
                        <label
                          key={opt.value}
                          className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-all ${
                            currentValue === opt.value
                              ? 'bg-sky-950/40 border-sky-600 text-sky-200'
                              : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <input
                            type="radio"
                            name={field.id}
                            value={opt.value}
                            checked={currentValue === opt.value}
                            onChange={() => handleFieldChange(field.id, opt.value)}
                            className="mt-0.5 accent-sky-500"
                          />
                          <div>
                            <div className="font-medium text-xs flex items-center gap-2">
                              <span>{opt.label}</span>
                              {opt.isExamTrap && (
                                <span className="text-[10px] bg-rose-950 text-rose-300 border border-rose-800 px-1.5 py-0.2 rounded font-bold">
                                  Exam Trap
                                </span>
                              )}
                            </div>
                            {opt.description && (
                              <p className="text-[11px] text-slate-400 mt-0.5">{opt.description}</p>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  )}

                  {field.type === 'text' && (
                    <input
                      type="text"
                      value={currentValue}
                      onChange={e => handleFieldChange(field.id, e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500 font-mono"
                    />
                  )}

                  {field.type === 'checkbox' && (
                    <label className="flex items-center gap-2 p-2 bg-slate-950/50 border border-slate-800 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={currentValue === 'true'}
                        onChange={e => handleFieldChange(field.id, e.target.checked ? 'true' : 'false')}
                        className="accent-sky-500"
                      />
                      <span className="text-xs text-slate-200">{field.helpText || field.label}</span>
                    </label>
                  )}

                  {/* Exam Insight Callout */}
                  {field.examNote && (
                    <div className="p-2.5 bg-amber-950/40 border border-amber-700/50 rounded-md text-xs text-amber-200 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-semibold text-amber-300">AZ-104 Exam Insight:</strong> {field.examNote}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom status strip */}
      <div className="bg-slate-950 px-4 py-2 text-[11px] text-slate-400 border-t border-slate-800 flex items-center justify-between">
        <span>💡 Tip: Click different tabs and options to observe Azure validation logic and exam traps.</span>
        <span className="font-mono text-sky-400">Azure Portal v2026.04</span>
      </div>
    </div>
  );
};
