import { AuditDomain, AuditOverviewStats, Client, DataIngestionStatus, Document, DocumentType, Engagement, EngagementStatus, Finding, FindingSeverity, FindingStatus, Report, ReportStatus, WorkpaperTask } from "./types";

export const MOCK_CLIENTS: Client[] = [
    { id: 'cli-456', name: 'Acme Corp', code: 'ACME', industry: 'Manufacturing', contactName: 'Alice Finance', email: 'alice@acme.com', activeEngagements: 1 },
    { id: 'cli-789', name: 'Globex Inc', code: 'GLBX', industry: 'Technology', contactName: 'Bob CFO', email: 'bob@globex.com', activeEngagements: 2 },
    { id: 'cli-101', name: 'Soylent Corp', code: 'SOYL', industry: 'Food & Beverage', contactName: 'Carol Controller', email: 'carol@soylent.com', activeEngagements: 0 },
    { id: 'cli-202', name: 'Initech', code: 'INIT', industry: 'Services', contactName: 'Bill Lumb', email: 'bill@initech.com', activeEngagements: 1 },
];

export const MOCK_ENGAGEMENTS: Engagement[] = [
    {
        id: 'eng-123',
        clientId: 'cli-456',
        name: 'FY2024 Audit - Acme Corp',
        fiscalYear: 2024,
        status: EngagementStatus.IN_PROGRESS,
        periodStart: '2024-01-01',
        periodEnd: '2024-12-31',
        riskScore: 78
    },
    {
        id: 'eng-999',
        clientId: 'cli-789',
        name: 'FY2023 Review - Globex',
        fiscalYear: 2023,
        status: EngagementStatus.COMPLETED,
        periodStart: '2023-01-01',
        periodEnd: '2023-12-31',
        riskScore: 12
    },
    {
        id: 'eng-888',
        clientId: 'cli-789',
        name: 'Q1 2024 Tax Provision',
        fiscalYear: 2024,
        status: EngagementStatus.PLANNING,
        periodStart: '2024-01-01',
        periodEnd: '2024-03-31',
        riskScore: 0
    }
];

export const MOCK_ENGAGEMENT = MOCK_ENGAGEMENTS[0];

export const MOCK_AUDIT_STATS: AuditOverviewStats[] = [
    { domain: AuditDomain.INCOME, highCount: 2, mediumCount: 5, lowCount: 1, score: 3, hasRun: true },
    { domain: AuditDomain.EXPENSES, highCount: 0, mediumCount: 12, lowCount: 4, score: 2, hasRun: true },
    { domain: AuditDomain.ASSETS, highCount: 1, mediumCount: 2, lowCount: 0, score: 2, hasRun: true },
    { domain: AuditDomain.LIABILITIES, highCount: 0, mediumCount: 0, lowCount: 2, score: 1, hasRun: true },
    { domain: AuditDomain.BANK_CASH, highCount: 1, mediumCount: 0, lowCount: 0, score: 3, hasRun: true },
    { domain: AuditDomain.PAYROLL, highCount: 3, mediumCount: 1, lowCount: 0, score: 3, hasRun: true },
    { domain: AuditDomain.INVENTORY, highCount: 0, mediumCount: 4, lowCount: 10, score: 2, hasRun: true },
    { domain: AuditDomain.COMPLIANCE, highCount: 0, mediumCount: 0, lowCount: 0, score: 1, hasRun: false },
    { domain: AuditDomain.BOOKS, highCount: 1, mediumCount: 1, lowCount: 1, score: 2, hasRun: true },
    { domain: AuditDomain.CONTROLS, highCount: 0, mediumCount: 2, lowCount: 5, score: 2, hasRun: true },
];

export const MOCK_FINDINGS: Finding[] = [
    {
        id: 'f-1',
        engagementId: 'eng-123',
        domain: AuditDomain.INCOME,
        severity: FindingSeverity.HIGH,
        code: 'REV_VAR_TAX',
        message: 'Revenue in TB differs from Tax Return by > 5%',
        amount: 154000.00,
        status: FindingStatus.OPEN,
        createdAt: '2024-03-10'
    },
    {
        id: 'f-2',
        engagementId: 'eng-123',
        domain: AuditDomain.PAYROLL,
        severity: FindingSeverity.HIGH,
        code: 'DUP_BANK_ACCT',
        message: 'Multiple active employees sharing same bank account (Potential Ghost Employee)',
        amount: 0,
        status: FindingStatus.IN_PROGRESS,
        createdAt: '2024-03-12'
    },
    {
        id: 'f-3',
        engagementId: 'eng-123',
        domain: AuditDomain.EXPENSES,
        severity: FindingSeverity.MEDIUM,
        code: 'DUP_EXPENSE',
        message: 'Potential duplicate expense: Same amount, same date, same vendor',
        amount: 450.25,
        status: FindingStatus.OPEN,
        createdAt: '2024-03-11'
    }
];

export const MOCK_TASKS: WorkpaperTask[] = [
    {
        id: 't-1',
        engagementId: 'eng-123',
        findingId: 'f-1',
        title: 'Reconcile Revenue Difference',
        description: 'Investigate the $154k variance between TB and Tax Return',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        assignee: 'John Doe',
        dueDate: '2024-03-25'
    },
    {
        id: 't-2',
        engagementId: 'eng-123',
        findingId: 'f-2',
        title: 'Verify Employee Bank Details',
        description: 'Contact HR to verify if shared bank accounts are legitimate (e.g. spouses)',
        status: 'OPEN',
        priority: 'HIGH',
        assignee: 'Jane Staff',
        dueDate: '2024-03-20'
    },
    {
        id: 't-3',
        engagementId: 'eng-123',
        title: 'Finalize Planning Memo',
        status: 'DONE',
        priority: 'MEDIUM',
        assignee: 'John Doe',
        dueDate: '2024-02-28'
    },
    {
        id: 't-4',
        engagementId: 'eng-123',
        title: 'Upload Q1 Bank Statements',
        status: 'BLOCKED',
        priority: 'LOW',
        description: 'Waiting on client to provide access',
        dueDate: '2024-03-30'
    }
];

export const MOCK_REPORTS: Report[] = [
    { id: 'r-1', engagementId: 'eng-123', title: 'Preliminary Audit Findings', status: ReportStatus.DRAFT, generatedAt: '2024-03-15', generatedBy: 'John Doe' },
    { id: 'r-2', engagementId: 'eng-123', title: 'Planning Strategy Document', status: ReportStatus.FINAL, generatedAt: '2024-02-20', generatedBy: 'Jane Staff' }
];

export const MOCK_DATA_STATUS: DataIngestionStatus = {
    tb: true,
    gl: true,
    bank: true,
    payroll: false,
    tax: true,
    inventory: false
};

export const MOCK_DOCUMENTS: Document[] = [
    { id: 'd-1', name: 'TB_2024_Final.csv', type: DocumentType.TB_EXPORT, size: 46080, uploadedAt: '2024-02-15T10:00:00Z', uploadedBy: 'Jane Doe', linkedFindingsCount: 2 },
    { id: 'd-2', name: 'GL_Detail_2024.csv', type: DocumentType.GL_EXPORT, size: 12582912, uploadedAt: '2024-02-15T10:05:00Z', uploadedBy: 'Jane Doe', linkedFindingsCount: 5 },
    { id: 'd-3', name: 'Chase_Bank_Stmts_Dec24.pdf', type: DocumentType.BANK_STATEMENT, size: 512000, uploadedAt: '2024-02-16T09:30:00Z', uploadedBy: 'Client Portal', linkedFindingsCount: 1 },
    { id: 'd-4', name: 'Tax_Return_2023.pdf', type: DocumentType.TAX_RETURN, size: 2048000, uploadedAt: '2024-01-20T14:15:00Z', uploadedBy: 'John Smith', linkedFindingsCount: 0 },
];