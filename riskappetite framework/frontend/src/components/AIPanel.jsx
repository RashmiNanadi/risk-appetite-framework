import { useState } from 'react';
import aiService from '../services/aiService';

// --- Icons Components for cleaner code ---
const SparklesIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const LoaderIcon = ({ className = "w-5 h-5" }) => (
  <svg className={`animate-spin ${className}`} fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const AlertCircleIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const RefreshIcon = ({ className = "w-4 h-4 mr-1.5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

// --- Sub-components ---
function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 space-y-5 animate-in fade-in duration-500">
      <div className="relative">
        <div className="absolute inset-0 bg-indigo-400 rounded-full blur-md animate-pulse opacity-50"></div>
        <div className="relative bg-white p-3.5 rounded-full shadow-sm border border-indigo-100">
          <LoaderIcon className="w-7 h-7 text-indigo-600" />
        </div>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-sm font-semibold text-slate-700 tracking-wide">AI is analyzing risk data...</span>
        <span className="text-xs text-slate-500 mt-1.5">This might take a few seconds</span>
      </div>
    </div>
  );
}

function RetryButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center px-4 py-2 mt-3 text-sm font-medium text-red-700 bg-white border border-red-200 rounded-lg shadow-sm hover:bg-red-50 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
    >
      <RefreshIcon />
      Try Again
    </button>
  );
}

// --- Main Component ---
export default function AIPanel({ riskData, mode = 'recommend' }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleAIAction = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      let response;
      if (mode === 'recommend') {
        response = await aiService.recommendActions(riskData);
      } else if (mode === 'describe') {
        response = await aiService.describeRisk(riskData);
      } else if (mode === 'categorise') {
        response = await aiService.categoriseRisk(riskData.description || riskData.name);
      }
      setResult(response);
    } catch (err) {
      setError('AI service is currently experiencing high demand or is unavailable.');
      console.error('AI service error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityStyles = (priority) => {
    switch (priority?.toUpperCase()) {
      case 'HIGH':
        return 'bg-red-50/50 text-red-900 border-red-200 shadow-red-100/30 icon-red';
      case 'MEDIUM':
        return 'bg-amber-50/50 text-amber-900 border-amber-200 shadow-amber-100/30 icon-amber';
      case 'LOW':
        return 'bg-emerald-50/50 text-emerald-900 border-emerald-200 shadow-emerald-100/30 icon-emerald';
      default:
        return 'bg-white text-slate-800 border-slate-200 shadow-slate-100/30 icon-slate';
    }
  };

  const getPriorityAccent = (priority) => {
    switch (priority?.toUpperCase()) {
      case 'HIGH': return 'bg-red-500';
      case 'MEDIUM': return 'bg-amber-500';
      case 'LOW': return 'bg-emerald-500';
      default: return 'bg-slate-400';
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'recommend': return 'AI Action Plan';
      case 'describe': return 'AI Risk Assessment';
      case 'categorise': return 'AI Classification';
      default: return 'AI Intelligence';
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-indigo-100/60 bg-white/80 backdrop-blur-xl shadow-xl shadow-indigo-100/20 transition-all duration-300">
      {/* Decorative gradient top bar */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-90"></div>
      
      <div className="p-6 sm:p-7">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-7">
          <div className="flex items-center gap-4">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100/80 shadow-sm">
              <SparklesIcon className="text-indigo-600 w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-xl tracking-tight">
                {getTitle()}
              </h3>
              <p className="text-sm text-slate-500 mt-0.5 font-medium">Powered by advanced analytics</p>
            </div>
          </div>
          
          <button
            onClick={handleAIAction}
            disabled={loading}
            className="group relative inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 bg-indigo-600 border border-transparent rounded-xl shadow-md hover:bg-indigo-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden w-full sm:w-auto"
          >
            {loading ? (
              <>
                <LoaderIcon className="w-4 h-4 mr-2" />
                Processing...
              </>
            ) : (
              <>
                {/* Subtle sheen effect on hover */}
                <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-20 bg-gradient-to-b from-transparent via-transparent to-black"></span>
                <span className="relative flex items-center gap-2">
                  <SparklesIcon className="w-4 h-4" />
                  Generate Analysis
                </span>
              </>
            )}
          </button>
        </div>

        {/* Content Section */}
        <div className="relative min-h-[160px] flex flex-col justify-center rounded-2xl bg-slate-50/50 border border-slate-100 p-2">
          
          {loading && <LoadingSpinner />}

          {error && !loading && (
            <div className="p-5 m-2 rounded-xl bg-red-50 border border-red-100 flex items-start gap-4 animate-in fade-in slide-in-from-top-4 duration-300 shadow-sm">
              <div className="bg-white p-2 rounded-full shadow-sm shrink-0">
                <AlertCircleIcon className="w-6 h-6 text-red-500" />
              </div>
              <div className="flex-1">
                <h4 className="text-base font-semibold text-red-900">Analysis Failed</h4>
                <p className="text-sm text-red-700 mt-1 mb-2 leading-relaxed">{error}</p>
                <RetryButton onClick={handleAIAction} />
              </div>
            </div>
          )}

          {!loading && !result && !error && (
            <div className="py-12 px-6 text-center animate-in fade-in duration-700">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-50/80 ring-8 ring-indigo-50/30 mb-5">
                <SparklesIcon className="w-8 h-8 text-indigo-400" />
              </div>
              <p className="text-base text-slate-500 max-w-md mx-auto leading-relaxed">
                Ready to extract insights. Click <span className="font-semibold text-slate-700">Generate Analysis</span> above to get AI-powered intelligence for this risk profile.
              </p>
            </div>
          )}

          {result && !loading && (
            <div className="p-2 sm:p-3 space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* --- Recommendations Mode --- */}
              {mode === 'recommend' && result.recommendations && (
                <div className="grid gap-4">
                  {result.recommendations.map((rec, index) => (
                    <div 
                      key={index} 
                      className={`relative overflow-hidden flex flex-col sm:flex-row gap-5 p-5 rounded-2xl border transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${getPriorityStyles(rec.priority)}`}
                    >
                      {/* Left accent line */}
                      <div className={`absolute top-0 left-0 w-1.5 h-full ${getPriorityAccent(rec.priority)}`}></div>
                      
                      <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-white/80 font-bold text-base shadow-sm ring-4 ring-white/40 z-10">
                        {index + 1}
                      </div>
                      
                      <div className="flex-1 min-w-0 z-10">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <h4 className="text-base font-bold tracking-tight">{rec.action_type}</h4>
                          {rec.priority && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest bg-white/70 shadow-sm">
                              {rec.priority} PRIORITY
                            </span>
                          )}
                        </div>
                        <p className="text-sm opacity-90 leading-relaxed font-medium">{rec.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* --- Describe Mode --- */}
              {mode === 'describe' && result.description && (
                <div className="prose prose-sm md:prose-base prose-slate max-w-none">
                  <div className="p-6 md:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm leading-relaxed text-slate-700 whitespace-pre-wrap font-medium">
                    {result.description}
                  </div>
                </div>
              )}

              {/* --- Categorise Mode --- */}
              {mode === 'categorise' && result.category && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  <div className="lg:col-span-1 p-6 md:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 z-10">Risk Category</span>
                    <span className="text-2xl font-black text-indigo-700 z-10">{result.category}</span>
                  </div>
                  
                  <div className="lg:col-span-2 p-6 md:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-center">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold text-slate-700">AI Confidence Score</span>
                      <span className="text-lg font-black text-emerald-600">{Math.round(result.confidence * 100)}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3 mb-6 overflow-hidden shadow-inner">
                      <div 
                        className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-full rounded-full transition-all duration-1000 ease-out relative" 
                        style={{ width: `${Math.round(result.confidence * 100)}%` }}
                      >
                        <div className="absolute top-0 right-0 bottom-0 left-0 bg-[linear-gradient(45deg,rgba(255,255,255,.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,.15)_50%,rgba(255,255,255,.15)_75%,transparent_75%,transparent)] bg-[length:1rem_1rem]"></div>
                      </div>
                    </div>
                    {result.reasoning && (
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <p className="text-sm text-slate-600 leading-relaxed font-medium">
                          <span className="font-bold text-slate-900 mr-2">Reasoning:</span>
                          {result.reasoning}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* --- Meta Footer --- */}
              {result.meta && (
                <div className="flex items-center justify-between mt-8 pt-5 border-t border-slate-200/60 px-2">
                  <div className="flex items-center text-xs font-medium text-slate-400">
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Analysis generated at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="flex items-center">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600 border border-indigo-100/80 shadow-sm">
                      Model: {result.meta.model_used || 'Groq Analytics'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}