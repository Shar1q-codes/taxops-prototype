
// Presents the engagement workspace, delegating state management to the workspace hook.
import React, { useState } from 'react';
import { Engagement, EngagementStatus, Finding } from '../web/types';
import { EngagementTab, useEngagementWorkspace } from '../web/hooks/useEngagementWorkspace';
import { 
  Activity, 
  Files, 
  PieChart, 
  UploadCloud,
  ListTodo,
  FileText,
  ChevronDown,
  Check,
  ArrowLeft
} from 'lucide-react';
import AuditDashboard from './AuditDashboard';
import DataIngestion from './DataIngestion';
import DocumentsView from './DocumentsView';
import WorkpapersView from './WorkpapersView';
import ReportsView from './ReportsView';
import EngagementOverview from './EngagementOverview';

interface Props {
  engagement: Engagement;
  initialTab?: EngagementTab;
  onNavigate?: (path: string) => void;
}

export default function EngagementView({ engagement: initialEngagement, initialTab, onNavigate }: Props) {
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
  const [workspace, actions] = useEngagementWorkspace(initialEngagement, initialTab || 'OVERVIEW');

  const { engagement, activeTab, documents, dataStatus, findings, tasks, auditStats } = workspace;
  const {
    changeStatus,
    setActiveTab,
    uploadDataFile,
    uploadManualDocument,
    deleteDocument,
    createTask,
    updateTask,
    deleteTask,
    createTaskFromFinding,
    updateFinding,
    addFindings,
    updateAuditStats,
  } = actions;

  const tabs = [
    { id: 'OVERVIEW', label: 'Overview', icon: PieChart },
    { id: 'DATA', label: 'Data Ingestion', icon: UploadCloud },
    { id: 'AUDIT', label: 'Audit & Risks', icon: Activity },
    { id: 'DOCS', label: 'Documents', icon: Files },
    { id: 'WORKPAPERS', label: 'Workpapers', icon: ListTodo },
    { id: 'REPORTS', label: 'Reports', icon: FileText },
  ];

  // --- ACTIONS ---

  const handleStatusChange = (status: EngagementStatus) => {
    changeStatus(status);
    setIsStatusMenuOpen(false);
  };

  const handleFileUpload = (type: string) => {
    uploadDataFile(type);
  };

  const handleManualUpload = (file: File) => {
    uploadManualDocument(file);
  };

  const handleDeleteDocument = (id: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      deleteDocument(id);
    }
  };

  const handleCreateTaskFromFinding = (finding: Finding) => {
    createTaskFromFinding(finding);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'OVERVIEW':
        return <EngagementOverview engagement={engagement} findings={findings} tasks={tasks} />;
      case 'AUDIT':
        return (
            <AuditDashboard 
                engagementId={engagement.id} 
                findings={findings}
                stats={auditStats}
                dataStatus={dataStatus}
                availableDocuments={documents}
                onUpdateStats={updateAuditStats}
                onAddFindings={addFindings}
                onUpdateFinding={updateFinding}
                onCreateTask={handleCreateTaskFromFinding}
            />
        );
      case 'DATA':
        return <DataIngestion status={dataStatus} onUpload={handleFileUpload} />;
      case 'DOCS':
        return <DocumentsView documents={documents} onUpload={handleManualUpload} onDelete={handleDeleteDocument} />;
      case 'WORKPAPERS':
        return (
            <WorkpapersView 
                tasks={tasks} 
                findings={findings}
                onAddTask={createTask}
                onUpdateTask={updateTask}
                onDeleteTask={deleteTask}
            />
        );
      case 'REPORTS':
        return <ReportsView />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('engagements')}
              className="mt-0.5 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft size={16} />
              Back
            </button>
          )}
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{engagement.name}</h1>
            <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
              <span>Fiscal Year: {engagement.fiscalYear}</span>
              <span className="h-1 w-1 rounded-full bg-slate-300"></span>
              <span>{engagement.periodStart} to {engagement.periodEnd}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
             <button 
                onClick={() => setIsStatusMenuOpen(!isStatusMenuOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                    engagement.status === EngagementStatus.IN_PROGRESS 
                    ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100' 
                    : engagement.status === EngagementStatus.COMPLETED
                    ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
             >
                {engagement.status.replace('_', ' ')}
                <ChevronDown size={12} />
             </button>
             
             {isStatusMenuOpen && (
                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-slate-200 z-50 py-1">
                     {Object.values(EngagementStatus).map((status) => (
                         <button
                            key={status}
                            onClick={() => handleStatusChange(status)}
                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                         >
                            {status.replace('_', ' ')}
                            {engagement.status === status && <Check size={14} className="text-blue-600" />}
                         </button>
                     ))}
                 </div>
             )}
          </div>
          
          <button 
            onClick={() => setActiveTab('REPORTS')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors"
          >
            Generate Report
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`
                  group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors
                  ${isActive 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }
                `}
              >
                <Icon size={16} className={`mr-2 ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-500'}`} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {renderContent()}
      </div>
    </div>
  );
}
