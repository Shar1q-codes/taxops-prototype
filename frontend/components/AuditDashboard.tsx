
import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { 
  AlertCircle, 
  CheckCircle, 
  Play, 
  Filter, 
  ArrowRight,
  Loader2,
  RefreshCw,
  FileText,
  Paperclip,
  X,
  ListTodo,
  Check,
  Lock
} from 'lucide-react';
import { AuditDomain, Finding, FindingSeverity, FindingStatus, AuditOverviewStats, DataIngestionStatus, Document } from '../web/types';
import { runAuditDomain } from '../services/rules';

interface Props {
  engagementId: string;
  findings: Finding[];
  stats: AuditOverviewStats[];
  dataStatus?: DataIngestionStatus;
  availableDocuments?: Document[];
  onUpdateStats: (stats: AuditOverviewStats[]) => void;
  onAddFindings: (findings: Finding[]) => void;
  onUpdateFinding: (finding: Finding) => void;
  onCreateTask: (finding: Finding) => void;
}

const DOMAIN_COLORS: Record<string, string> = {
  HIGH: '#ef4444',   // red-500
  MEDIUM: '#f59e0b', // amber-500
  LOW: '#3b82f6'     // blue-500
};

export default function AuditDashboard({ 
    engagementId, 
    findings, 
    stats, 
    dataStatus,
    availableDocuments = [],
    onUpdateStats, 
    onAddFindings, 
    onUpdateFinding, 
    onCreateTask 
}: Props) {
  const [selectedDomain, setSelectedDomain] = useState<AuditDomain | null>(null);
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);
  const [runningDomain, setRunningDomain] = useState<string | null>(null);
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [linkedEvidence, setLinkedEvidence] = useState<Record<string, Document[]>>({});

  // Filter findings based on selection
  const filteredFindings = selectedDomain 
    ? findings.filter(f => f.domain === selectedDomain)
    : findings;

  const isDomainLocked = (domain: AuditDomain) => {
      // Spec Requirement: Gate TAX_DOCS if core data is missing
      if (domain === AuditDomain.TAX_DOCS) {
          if (dataStatus && (!dataStatus.tb || !dataStatus.gl || !dataStatus.bank)) {
              return true;
          }
      }
      return false;
  };

  const handleRunAudit = async (domain: AuditDomain) => {
    if (isDomainLocked(domain)) return;

    setRunningDomain(domain);
    
    try {
        const newFindings = await runAuditDomain(domain, engagementId);
        
        onAddFindings(newFindings);

        // Update stats in parent
        const updatedStats = stats.map(s => {
            if (s.domain === domain) {
                // Combine existing and new findings for accurate stats
                const allDomainFindings = [...findings.filter(f => f.domain === domain), ...newFindings];
                const high = allDomainFindings.filter(f => f.severity === FindingSeverity.HIGH).length;
                const med = allDomainFindings.filter(f => f.severity === FindingSeverity.MEDIUM).length;
                const low = allDomainFindings.filter(f => f.severity === FindingSeverity.LOW).length;
                return {
                    ...s,
                    hasRun: true,
                    highCount: high,
                    mediumCount: med,
                    lowCount: low,
                    score: high > 0 ? 3 : med > 0 ? 2 : 1
                };
            }
            return s;
        });
        
        onUpdateStats(updatedStats);
        setSelectedDomain(domain);
        setSelectedFinding(null);

    } catch (error) {
        console.error("Audit run failed", error);
    } finally {
        setRunningDomain(null);
    }
  };

  const handleResolve = (finding: Finding) => {
      onUpdateFinding({ ...finding, status: FindingStatus.RESOLVED });
      setSelectedFinding(null);
  };

  const handleLinkEvidence = (doc: Document) => {
      if (!selectedFinding) return;
      setLinkedEvidence(prev => ({
          ...prev,
          [selectedFinding.id]: [...(prev[selectedFinding.id] || []), doc]
      }));
      setIsEvidenceModalOpen(false);
  };

  const getEvidenceForFinding = (findingId: string) => {
      // Default mock + dynamic links
      const defaults = findingId === 'f-1' ? [{ id: 'd-def', name: 'Tax_Return_2023.pdf' }] : [];
      return [...defaults, ...(linkedEvidence[findingId] || [])];
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)] min-h-[600px] relative">
      
      {/* Evidence Modal */}
      {isEvidenceModalOpen && selectedFinding && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-lg">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80%] flex flex-col">
                  <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                      <h3 className="font-bold text-slate-900">Attach Evidence</h3>
                      <button onClick={() => setIsEvidenceModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                          <X size={20} />
                      </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-2">
                      <p className="text-sm text-slate-500 mb-2">Select a document to link to finding <strong>{selectedFinding.code}</strong>:</p>
                      {availableDocuments.length === 0 && <p className="text-sm text-slate-400 italic">No documents uploaded.</p>}
                      {availableDocuments.map(doc => (
                          <div 
                            key={doc.id} 
                            onClick={() => handleLinkEvidence(doc)}
                            className="p-3 border border-slate-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 cursor-pointer flex items-center gap-3"
                          >
                              <div className="bg-blue-100 p-2 rounded text-blue-600">
                                  <FileText size={16} />
                              </div>
                              <div>
                                  <div className="text-sm font-medium text-slate-900">{doc.name}</div>
                                  <div className="text-xs text-slate-500">{doc.type.replace('_', ' ')}</div>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          </div>
      )}

      {/* LEFT COLUMN: Stats & Domains */}
      <div className="lg:col-span-2 space-y-6 flex flex-col h-full overflow-hidden">
        
        {/* Risk Overview Chart */}
        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm flex-shrink-0 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Engagement Risk Profile</h3>
            <div className="text-sm text-slate-500">Based on 10 Audit Domains</div>
          </div>
          <div className="h-48 min-h-[200px] min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="domain" 
                  tick={{ fontSize: 10, fill: '#64748b' }} 
                  interval={0} 
                  angle={-45} 
                  textAnchor="end" 
                  height={60}
                />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '6px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="highCount" name="High Risk" stackId="a" fill={DOMAIN_COLORS.HIGH} radius={[0, 0, 4, 4]} />
                <Bar dataKey="mediumCount" name="Medium Risk" stackId="a" fill={DOMAIN_COLORS.MEDIUM} />
                <Bar dataKey="lowCount" name="Low Risk" stackId="a" fill={DOMAIN_COLORS.LOW} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Domain Grid - Scrollable */}
        <div className="flex-1 overflow-y-auto min-h-0 pr-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-2">
            {stats.map((stat) => {
                const locked = isDomainLocked(stat.domain);
                return (
                <div 
                key={stat.domain}
                onClick={() => {
                    if (!locked) {
                        setSelectedDomain(selectedDomain === stat.domain ? null : stat.domain);
                        setSelectedFinding(null);
                    }
                }}
                className={`
                    relative bg-white rounded-lg border p-4 transition-all
                    ${locked ? 'opacity-70 cursor-not-allowed bg-slate-50' : 'cursor-pointer hover:shadow-md'}
                    ${selectedDomain === stat.domain ? 'border-blue-500 ring-1 ring-blue-500' : 'border-slate-200 hover:border-blue-300'}
                `}
                >
                <div className="flex justify-between items-start">
                    <div>
                    <h4 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                        {stat.domain.replace('_', ' ')}
                        {locked && <Lock size={12} className="text-amber-500" />}
                    </h4>
                    
                    {locked ? (
                        <div className="mt-2 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-100">
                            Upload TB, GL & Bank data first.
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 mt-2 text-xs">
                            {stat.highCount > 0 && (
                            <span className="bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-medium">{stat.highCount} High</span>
                            )}
                            {stat.mediumCount > 0 && (
                            <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium">{stat.mediumCount} Med</span>
                            )}
                            {stat.lowCount > 0 && (
                            <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-medium">{stat.lowCount} Low</span>
                            )}
                            {stat.highCount === 0 && stat.mediumCount === 0 && stat.lowCount === 0 && (
                            <span className="text-slate-400">No findings</span>
                            )}
                        </div>
                    )}
                    </div>
                    
                    {!locked && (
                        runningDomain === stat.domain ? (
                            <Loader2 className="animate-spin text-blue-500 h-5 w-5" />
                        ) : stat.hasRun ? (
                        <div className="flex gap-1">
                            <button 
                                onClick={(e) => { e.stopPropagation(); handleRunAudit(stat.domain); }}
                                className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-blue-600"
                                title="Re-run audit"
                            >
                                <RefreshCw size={14} />
                            </button>
                            <CheckCircle className="text-green-500 h-5 w-5" />
                        </div>
                        ) : (
                        <button 
                            onClick={(e) => { e.stopPropagation(); handleRunAudit(stat.domain); }}
                            className="p-1 hover:bg-blue-50 rounded-full group"
                            title="Run Audit Checks"
                        >
                            <Play className="text-slate-400 h-5 w-5 group-hover:text-blue-600 group-hover:fill-blue-100" />
                        </button>
                        )
                    )}
                </div>
                </div>
            )})}
            </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Findings Feed or Detail */}
      <div className="bg-white rounded-lg border border-slate-200 flex flex-col shadow-sm h-full overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-lg flex-shrink-0">
          <div>
            {selectedFinding ? (
                <button 
                    onClick={() => setSelectedFinding(null)} 
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1 mb-1"
                >
                    ← Back to List
                </button>
            ) : (
                <h3 className="font-semibold text-slate-900">
                    {selectedDomain ? `${selectedDomain.replace('_', ' ')} Findings` : 'All Findings'}
                </h3>
            )}
            <p className="text-xs text-slate-500">
              {selectedFinding ? selectedFinding.code : `${filteredFindings.length} issues in view`}
            </p>
          </div>
          {!selectedFinding && (
            <button className="p-2 hover:bg-white hover:shadow-sm rounded border border-transparent hover:border-slate-200 transition-all text-slate-500">
                <Filter size={16} />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-0">
          {selectedFinding ? (
             // DETAIL VIEW
             <div className="p-6 space-y-6">
                <div>
                    <h2 className="text-lg font-bold text-slate-900 leading-snug">{selectedFinding.message}</h2>
                    <div className="flex items-center gap-3 mt-3">
                         <span className={`px-2 py-0.5 rounded text-xs font-bold text-white ${
                             selectedFinding.severity === 'HIGH' ? 'bg-red-500' : 
                             selectedFinding.severity === 'MEDIUM' ? 'bg-amber-500' : 'bg-blue-500'
                         }`}>
                             {selectedFinding.severity} RISK
                         </span>
                         <span className={`px-2 py-0.5 rounded text-xs font-bold border ${
                             selectedFinding.status === 'RESOLVED' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-slate-100 text-slate-600 border-slate-200'
                         }`}>
                             {selectedFinding.status}
                         </span>
                         <span className="text-sm text-slate-500">{new Date(selectedFinding.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>

                {selectedFinding.amount && (
                    <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
                        <span className="text-xs text-slate-500 uppercase font-bold tracking-wide">Financial Impact</span>
                        <div className="text-2xl font-mono text-slate-900 mt-1">
                            ${selectedFinding.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                    </div>
                )}

                <div>
                    <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                        <Paperclip size={16} /> Evidence & Docs
                    </h4>
                    <div className="border border-slate-200 rounded-md divide-y divide-slate-100">
                        {getEvidenceForFinding(selectedFinding.id).map((doc, idx) => (
                             <div key={idx} className="p-3 flex items-center gap-3 hover:bg-slate-50 cursor-pointer">
                                <FileText className="text-blue-500" size={18} />
                                <div className="flex-1">
                                    <div className="text-sm font-medium text-slate-700">{doc.name}</div>
                                    <div className="text-xs text-slate-500">Linked to finding</div>
                                </div>
                             </div>
                        ))}
                        {getEvidenceForFinding(selectedFinding.id).length === 0 && (
                            <div className="p-3 text-sm text-slate-400 italic">No evidence attached yet.</div>
                        )}
                    </div>
                    <button 
                        onClick={() => setIsEvidenceModalOpen(true)}
                        className="text-sm text-blue-600 font-medium mt-2 hover:underline flex items-center gap-1"
                    >
                        + Attach more evidence
                    </button>
                </div>

                <div className="pt-4 border-t border-slate-100">
                    {selectedFinding.status !== FindingStatus.RESOLVED && (
                        <button 
                            onClick={() => handleResolve(selectedFinding)}
                            className="w-full py-2 bg-green-600 text-white rounded-md font-medium text-sm hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <Check size={16} /> Mark as Resolved
                        </button>
                    )}
                    <button 
                        onClick={() => onCreateTask(selectedFinding)}
                        className="w-full py-2 mt-2 text-blue-700 bg-blue-50 border border-blue-200 rounded-md font-medium text-sm hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                    >
                        <ListTodo size={16} /> Create Workpaper Task
                    </button>
                </div>
             </div>
          ) : (
             // LIST VIEW
             <div className="p-2 space-y-2">
                {filteredFindings.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center p-8 mt-12">
                    <CheckCircle size={32} className="mb-2 opacity-50" />
                    <p className="text-sm font-medium">No findings detected.</p>
                    <p className="text-xs mt-1">Run audit checks on domains to populate this list.</p>
                    </div>
                ) : (
                    filteredFindings.map((finding) => (
                    <div 
                        key={finding.id} 
                        onClick={() => setSelectedFinding(finding)}
                        className={`
                            group p-3 rounded-lg border transition-all bg-white cursor-pointer
                            ${finding.status === 'RESOLVED' ? 'border-green-200 bg-green-50/30' : 'border-slate-200 hover:border-blue-300 hover:shadow-sm'}
                        `}
                    >
                        <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center gap-2">
                            <span className={`h-2 w-2 rounded-full ${
                            finding.severity === 'HIGH' ? 'bg-red-500' : 
                            finding.severity === 'MEDIUM' ? 'bg-amber-500' : 'bg-blue-500'
                            }`} />
                            <span className="text-xs font-mono text-slate-500">{finding.code}</span>
                        </div>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                            finding.status === 'RESOLVED' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                        }`}>
                            {finding.status}
                        </span>
                        </div>
                        <p className={`text-sm font-medium line-clamp-2 ${finding.status === 'RESOLVED' ? 'text-slate-500' : 'text-slate-800'}`}>
                            {finding.message}
                        </p>
                        {finding.amount && finding.amount > 0 && (
                        <div className="mt-2 text-xs font-mono text-slate-600 bg-slate-50 inline-block px-1.5 py-0.5 rounded border border-slate-200">
                            ${finding.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                        )}
                        <div className="mt-3 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <span className="text-xs text-blue-600 font-medium flex items-center">
                                View Details <ArrowRight size={12} className="ml-1"/>
                             </span>
                        </div>
                    </div>
                    ))
                )}
             </div>
          )}
        </div>
      </div>

    </div>
  );
}
