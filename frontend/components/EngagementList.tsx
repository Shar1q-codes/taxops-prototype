
import React, { useState } from 'react';
import { Search, Plus, ArrowRight, X, Save } from 'lucide-react';
import { EngagementStatus, Engagement, Client } from '../web/types';

interface Props {
  engagements: Engagement[];
  clients: Client[];
  onSelectEngagement: (engagementId: string) => void;
  onAddEngagement: (engagement: Engagement) => void;
}

export default function EngagementList({ engagements, clients, onSelectEngagement, onAddEngagement }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [selectedClientId, setSelectedClientId] = useState('');
  const [name, setName] = useState('');
  const [fiscalYear, setFiscalYear] = useState('2024');
  const [periodEnd, setPeriodEnd] = useState('');

  const filteredEngagements = engagements.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId || !name) return;

    const newEngagement: Engagement = {
      id: `eng-${Date.now()}`,
      clientId: selectedClientId,
      name: name,
      fiscalYear: parseInt(fiscalYear),
      status: EngagementStatus.PLANNING,
      periodStart: `${fiscalYear}-01-01`,
      periodEnd: periodEnd || `${fiscalYear}-12-31`,
      riskScore: 0
    };

    onAddEngagement(newEngagement);
    setIsModalOpen(false);

    // Reset
    setSelectedClientId('');
    setName('');
    setPeriodEnd('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Engagements</h1>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
             <input 
               type="text" 
               placeholder="Search engagements..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
             />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors"
          >
            <Plus size={16} />
            <span>New Engagement</span>
          </button>
        </div>
      </div>

       {/* New Engagement Modal */}
       {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">Create New Engagement</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Client *</label>
                <select 
                  required
                  className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={selectedClientId}
                  onChange={(e) => setSelectedClientId(e.target.value)}
                >
                  <option value="">Select a Client...</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Engagement Name *</label>
                <input 
                  required
                  type="text" 
                  placeholder="e.g. FY2024 Financial Audit"
                  className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Fiscal Year</label>
                  <input 
                    type="number" 
                    className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={fiscalYear}
                    onChange={(e) => setFiscalYear(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Period End</label>
                  <input 
                    type="date" 
                    className="w-full border border-slate-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={periodEnd}
                    onChange={(e) => setPeriodEnd(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                  <Save size={16} />
                  <span>Create Engagement</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEngagements.map((engagement) => (
          <div 
            key={engagement.id} 
            className="bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col"
          >
            <div className="flex justify-between items-start mb-4">
               <div>
                  <h3 className="font-semibold text-slate-900">{engagement.name}</h3>
                  <p className="text-sm text-slate-500">
                    {clients.find(c => c.id === engagement.clientId)?.name || 'Unknown Client'}
                  </p>
               </div>
               <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${
                  engagement.status === EngagementStatus.IN_PROGRESS 
                    ? 'bg-blue-50 text-blue-700 border-blue-200' 
                    : engagement.status === EngagementStatus.COMPLETED
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}>
                  {engagement.status.replace('_', ' ')}
               </span>
            </div>
            
            <div className="space-y-2 mb-6 flex-1">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Fiscal Year</span>
                <span className="font-medium text-slate-700">{engagement.fiscalYear}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Period</span>
                <span className="font-medium text-slate-700">{engagement.periodEnd}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Risk Score</span>
                <span className={`font-medium ${engagement.riskScore > 50 ? 'text-red-600' : 'text-slate-700'}`}>
                  {engagement.riskScore}/100
                </span>
              </div>
            </div>

            <button 
              onClick={() => onSelectEngagement(engagement.id)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-medium rounded-md border border-slate-200 transition-colors"
            >
              Open Workspace <ArrowRight size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
