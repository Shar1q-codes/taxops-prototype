
import React, { useState } from 'react';
import { FileText, Download, Printer, Plus, ChevronDown, CheckCircle2 } from 'lucide-react';
import { MOCK_REPORTS } from '../web/lib/constants';
import { ReportStatus, Report } from '../web/types';
import AINarrative from './AINarrative';

export default function ReportsView() {
  const [reports, setReports] = useState<Report[]>(MOCK_REPORTS);
  const [showAI, setShowAI] = useState(false);

  const handleCreateReport = (summaryText?: string) => {
    const newReport: Report = {
        id: `r-${Date.now()}`,
        engagementId: 'eng-123',
        title: summaryText ? 'AI Generated Audit Summary' : 'New Audit Report',
        status: ReportStatus.DRAFT,
        generatedAt: new Date().toISOString(),
        generatedBy: 'John Doe'
    };
    setReports([newReport, ...reports]);
    setShowAI(false);
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Engagement Reports</h2>
          <p className="text-sm text-slate-500">Generate, review, and finalize audit deliverables.</p>
        </div>
        <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-md hover:bg-slate-50 transition-colors">
              <Printer size={16} />
              <span>Print Summary</span>
            </button>
            <button 
                onClick={() => setShowAI(!showAI)}
                className={`flex items-center gap-2 px-3 py-2 text-white text-sm font-medium rounded-md transition-colors ${showAI ? 'bg-slate-700' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              <Plus size={16} />
              <span>{showAI ? 'Cancel' : 'Generate New'}</span>
            </button>
        </div>
      </div>

      {showAI && (
        <div className="animate-in slide-in-from-top-4 duration-300 mb-6">
            <AINarrative engagementName="FY2024 Audit - Acme Corp" onSave={handleCreateReport} />
        </div>
      )}

      <div className="grid gap-4">
        {reports.map(report => (
            <div key={report.id} className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4">
                    <div className="h-12 w-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                        <FileText size={24} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-900">{report.title}</h3>
                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                            <span>Generated on {new Date(report.generatedAt).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>by {report.generatedBy}</span>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-4 mt-4 sm:mt-0 w-full sm:w-auto justify-between sm:justify-end">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        report.status === ReportStatus.FINAL ? 'bg-green-100 text-green-700 border-green-200' :
                        report.status === ReportStatus.REVIEW ? 'bg-amber-100 text-amber-700 border-amber-200' :
                        'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                        {report.status}
                    </span>
                    
                    <div className="flex items-center gap-2">
                        <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors" title="Download">
                            <Download size={18} />
                        </button>
                         <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                            <ChevronDown size={18} />
                        </button>
                    </div>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
}
