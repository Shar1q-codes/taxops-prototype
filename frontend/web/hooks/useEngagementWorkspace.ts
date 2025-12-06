// Centralizes engagement workspace state updates so the UI component can stay presentational.
import { useState } from 'react';
import {
  Engagement,
  EngagementStatus,
  Document,
  DocumentType,
  DataIngestionStatus,
  Finding,
  WorkpaperTask,
  AuditOverviewStats,
} from '../types';
import { MOCK_DATA_STATUS, MOCK_DOCUMENTS, MOCK_FINDINGS, MOCK_TASKS, MOCK_AUDIT_STATS } from '../lib/constants';

export type EngagementTab = 'OVERVIEW' | 'DATA' | 'AUDIT' | 'DOCS' | 'WORKPAPERS' | 'REPORTS';

export interface EngagementWorkspaceState {
  engagement: Engagement;
  activeTab: EngagementTab;
  documents: Document[];
  dataStatus: DataIngestionStatus;
  findings: Finding[];
  tasks: WorkpaperTask[];
  auditStats: AuditOverviewStats[];
}

export interface EngagementWorkspaceActions {
  changeStatus: (status: EngagementStatus) => void;
  setActiveTab: (tab: EngagementTab) => void;
  uploadDataFile: (type: string) => void;
  uploadManualDocument: (file: File) => void;
  deleteDocument: (id: string) => void;
  createTask: (task: WorkpaperTask) => void;
  updateTask: (task: WorkpaperTask) => void;
  deleteTask: (id: string) => void;
  createTaskFromFinding: (finding: Finding) => void;
  updateFinding: (finding: Finding) => void;
  addFindings: (findings: Finding[]) => void;
  updateAuditStats: (stats: AuditOverviewStats[]) => void;
}

export function useEngagementWorkspace(
  initialEngagement: Engagement,
  initialTab: EngagementTab = 'OVERVIEW'
): [EngagementWorkspaceState, EngagementWorkspaceActions] {
  const [engagement, setEngagement] = useState<Engagement>(initialEngagement);
  const [activeTab, setActiveTab] = useState<EngagementTab>(initialTab);
  const [documents, setDocuments] = useState<Document[]>(MOCK_DOCUMENTS);
  const [dataStatus, setDataStatus] = useState<DataIngestionStatus>(MOCK_DATA_STATUS);
  const [findings, setFindings] = useState<Finding[]>(MOCK_FINDINGS);
  const [tasks, setTasks] = useState<WorkpaperTask[]>(MOCK_TASKS);
  const [auditStats, setAuditStats] = useState<AuditOverviewStats[]>(MOCK_AUDIT_STATS);

  const changeStatus = (status: EngagementStatus) => setEngagement((prev) => ({ ...prev, status }));

  const uploadDataFile = (type: string) => {
    setDataStatus((prev) => ({ ...prev, [type]: true }));

    let docType = DocumentType.SUPPORTING_DOC;
    switch (type) {
      case 'tb':
        docType = DocumentType.TB_EXPORT;
        break;
      case 'gl':
        docType = DocumentType.GL_EXPORT;
        break;
      case 'bank':
        docType = DocumentType.BANK_STATEMENT;
        break;
      case 'payroll':
        docType = DocumentType.PAYROLL_REPORT;
        break;
      case 'tax':
        docType = DocumentType.TAX_RETURN;
        break;
      case 'inventory':
        docType = DocumentType.INVENTORY_REPORT;
        break;
      default:
        docType = DocumentType.SUPPORTING_DOC;
    }

    const newDoc: Document = {
      id: `doc-${Date.now()}`,
      name: `Uploaded_${type.toUpperCase()}_Data.csv`,
      type: docType,
      size: Math.floor(Math.random() * 5000000) + 1000,
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'John Doe',
      linkedFindingsCount: 0,
    };
    setDocuments((prev) => [newDoc, ...prev]);
  };

  const uploadManualDocument = (file: File) => {
    const newDoc: Document = {
      id: `doc-${Date.now()}`,
      name: file.name,
      type: DocumentType.SUPPORTING_DOC,
      size: file.size,
      uploadedAt: new Date().toISOString(),
      uploadedBy: 'John Doe',
      linkedFindingsCount: 0,
    };
    setDocuments((prev) => [newDoc, ...prev]);
  };

  const deleteDocument = (id: string) => setDocuments((prev) => prev.filter((d) => d.id !== id));

  const createTask = (task: WorkpaperTask) => setTasks((prev) => [task, ...prev]);

  const updateTask = (task: WorkpaperTask) => setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));

  const deleteTask = (id: string) => setTasks((prev) => prev.filter((t) => t.id !== id));

  const createTaskFromFinding = (finding: Finding) => {
    const newTask: WorkpaperTask = {
      id: `t-${Date.now()}`,
      engagementId: engagement.id,
      findingId: finding.id,
      title: `Resolve: ${finding.code}`,
      description: finding.message,
      status: 'OPEN',
      priority: finding.severity === 'HIGH' ? 'HIGH' : 'MEDIUM',
      assignee: 'Unassigned',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
    setActiveTab('WORKPAPERS');
  };

  const updateFinding = (finding: Finding) =>
    setFindings((prev) => prev.map((f) => (f.id === finding.id ? finding : f)));

  const addFindings = (newFindings: Finding[]) => {
    setFindings((prev) => {
      const existingIds = new Set(prev.map((f) => f.id));
      const uniqueNew = newFindings.filter((f) => !existingIds.has(f.id));
      return [...prev, ...uniqueNew];
    });
  };

  const updateAuditStats = (stats: AuditOverviewStats[]) => setAuditStats(stats);

  return [
    { engagement, activeTab, documents, dataStatus, findings, tasks, auditStats },
    {
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
    },
  ];
}
