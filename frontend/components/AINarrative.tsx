
import React, { useState } from 'react';
import { Sparkles, RefreshCw, Check, Copy } from 'lucide-react';
import { generateEngagementSummary } from '../services/ai';

interface Props {
  engagementName: string;
  onSave?: (text: string) => void;
}

export default function AINarrative({ engagementName, onSave }: Props) {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<string>('');
  const [generated, setGenerated] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const text = await generateEngagementSummary(engagementName);
      setContent(text);
      setGenerated(true);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg border border-indigo-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-md text-white">
            <Sparkles size={18} />
          </div>
          <div>
            <h3 className="font-bold text-indigo-900">Corallo AI Assistant</h3>
            <p className="text-xs text-indigo-600">Generate executive summaries and risk narratives automatically.</p>
          </div>
        </div>
        {!generated ? (
          <button 
            onClick={handleGenerate}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors disabled:opacity-75"
          >
            {loading ? <RefreshCw className="animate-spin" size={16} /> : <Sparkles size={16} />}
            <span>Generate Narrative</span>
          </button>
        ) : (
          <div className="flex gap-2">
             <button onClick={handleGenerate} className="p-2 text-indigo-600 hover:bg-indigo-100 rounded">
                <RefreshCw size={16} />
             </button>
             <button onClick={() => onSave?.(content)} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-indigo-200 text-indigo-700 text-sm font-medium rounded hover:bg-indigo-50">
                <Check size={16} /> Use This
             </button>
          </div>
        )}
      </div>

      {loading && (
        <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-indigo-200 rounded w-3/4"></div>
            <div className="h-4 bg-indigo-200 rounded w-1/2"></div>
            <div className="h-4 bg-indigo-200 rounded w-full"></div>
            <div className="h-4 bg-indigo-200 rounded w-5/6"></div>
        </div>
      )}

      {generated && !loading && (
        <div className="bg-white border border-indigo-100 rounded-md p-4 shadow-sm">
            <textarea 
                className="w-full h-64 text-sm text-slate-700 focus:outline-none resize-none"
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
        </div>
      )}
    </div>
  );
}
