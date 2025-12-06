
import React, { useState } from 'react';
import { UploadCloud, CheckCircle2, FileSpreadsheet, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { DataIngestionStatus } from '../web/types';

interface Props {
  status: DataIngestionStatus;
  onUpload?: (type: string) => void;
}

export default function DataIngestion({ status, onUpload }: Props) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadTarget, setUploadTarget] = useState<string | null>(null);

  const handleFileUpload = (type: string = 'inventory') => {
    setIsUploading(true);
    setUploadTarget(type);
    // Simulate upload and processing delay
    setTimeout(() => {
        setIsUploading(false);
        setUploadTarget(null);
        if (onUpload) onUpload(type);
    }, 1500);
  };

  const requirements = [
    { key: 'tb', label: 'Trial Balance', desc: 'Standard CSV export from ERP', active: status.tb },
    { key: 'gl', label: 'General Ledger', desc: 'Full detail GL for the period', active: status.gl },
    { key: 'bank', label: 'Bank Statements', desc: 'PDF or CSV exports', active: status.bank },
    { key: 'payroll', label: 'Payroll Register', desc: 'W2/Payroll provider export', active: status.payroll },
    { key: 'inventory', label: 'Inventory Listing', desc: 'Stock status report', active: status.inventory },
    { key: 'tax', label: 'Prior Year Tax', desc: 'Last filed tax return', active: status.tax },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Upload Zone */}
      <div className="lg:col-span-2 space-y-6">
        <div 
            onClick={() => !isUploading && handleFileUpload('generic')}
            className={`
                bg-white rounded-lg border border-slate-200 p-8 text-center border-dashed border-2 
                transition-all cursor-pointer relative overflow-hidden
                ${isUploading ? 'border-blue-300 bg-blue-50' : 'border-slate-300 hover:border-blue-500 hover:bg-slate-50'}
            `}
        >
          {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10">
                  <div className="flex flex-col items-center">
                    <Loader2 className="animate-spin text-blue-600 h-8 w-8 mb-2" />
                    <span className="text-sm font-medium text-blue-700">
                        {uploadTarget === 'generic' ? 'Analyzing file...' : `Processing ${uploadTarget}...`}
                    </span>
                  </div>
              </div>
          )}
          <div className="bg-blue-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <UploadCloud className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium text-slate-900">Upload Financial Data</h3>
          <p className="text-slate-500 max-w-sm mx-auto mt-2 text-sm">
            Drag and drop files here, or click to browse. Supported formats: CSV, Excel, PDF.
          </p>
          <div className="mt-6 flex justify-center gap-3">
             <button className="px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50">
               Select Files
             </button>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3">
          <div title="Integration Available">
            <AlertCircle className="h-5 w-5 text-blue-700 mt-0.5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-blue-800">Connector Integration Available</h4>
            <p className="text-sm text-blue-600 mt-1">
              Corallo connects directly to QBO and Xero. <span className="underline cursor-pointer">Configure integration</span> to sync data automatically.
            </p>
          </div>
        </div>
      </div>

      {/* Checklist */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
        <div className="p-4 border-b border-slate-200">
          <h3 className="font-semibold text-slate-900">Data Readiness</h3>
          <p className="text-xs text-slate-500">Required datasets for full audit execution</p>
        </div>
        <div className="divide-y divide-slate-100">
          {requirements.map((req) => (
            <div key={req.key} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${req.active ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-600'}`}>
                  <FileSpreadsheet size={18} />
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-900">{req.label}</div>
                  <div className="text-xs text-slate-500">{req.desc}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {req.active ? (
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-green-50 border border-green-100">
                    <CheckCircle2 className="text-green-600 h-4 w-4" />
                    <span className="text-xs font-medium text-green-700">Uploaded</span>
                  </div>
                ) : (
                  <>
                     <div title="Missing Data" className="flex items-center gap-1">
                       <AlertCircle className="text-amber-500 h-5 w-5" />
                     </div>
                     <button 
                        onClick={() => handleFileUpload(req.key)}
                        disabled={isUploading}
                        className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium px-2 py-1 hover:bg-blue-50 rounded"
                    >
                      Upload <ArrowRight size={12} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
