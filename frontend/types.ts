// Domain Enums
export enum Role {
    OWNER = 'OWNER',
    PARTNER = 'PARTNER',
    MANAGER = 'MANAGER',
    STAFF = 'STAFF',
    CLIENT_VIEWER = 'CLIENT_VIEWER'
}

export enum EngagementStatus {
    PLANNING = 'PLANNING',
    IN_PROGRESS = 'IN_PROGRESS',
    UNDER_REVIEW = 'UNDER_REVIEW',
    COMPLETED = 'COMPLETED',
    ARCHIVED = 'ARCHIVED'
}

export enum AuditDomain {
    INCOME = 'INCOME',
    EXPENSES = 'EXPENSES',
    ASSETS = 'ASSETS',
    LIABILITIES = 'LIABILITIES',
    BANK_CASH = 'BANK_CASH',
    COMPLIANCE = 'COMPLIANCE',
    PAYROLL = 'PAYROLL',
    INVENTORY = 'INVENTORY',
    BOOKS = 'BOOKS',
    CONTROLS = 'CONTROLS',
    TAX_DOCS = 'TAX_DOCS'
}

export enum FindingSeverity {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH'
}

export enum FindingStatus {
    OPEN = 'OPEN',
    IN_PROGRESS = 'IN_PROGRESS',
    RESOLVED = 'RESOLVED',
    WAIVED = 'WAIVED'
}

export enum DocumentType {
    TB_EXPORT = 'TB_EXPORT',
    GL_EXPORT = 'GL_EXPORT',
    BANK_STATEMENT = 'BANK_STATEMENT',
    PAYROLL_REPORT = 'PAYROLL_REPORT',
    TAX_RETURN = 'TAX_RETURN',
    INVENTORY_REPORT = 'INVENTORY_REPORT',
    SUPPORTING_DOC = 'SUPPORTING_DOC'
}

export enum ReportStatus {
    DRAFT = 'DRAFT',
    REVIEW = 'REVIEW',
    FINAL = 'FINAL'
}

// Entities

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
}

export interface Client {
    id: string;
    name: string;
    code: string;
    industry: string;
    contactName: string;
    email: string;
    activeEngagements: number;
}

export interface Engagement {
    id: string;
    clientId: string;
    name: string;
    fiscalYear: number;
    status: EngagementStatus;
    periodStart: string;
    periodEnd: string;
    riskScore: number; // Calculated 0-100
}

export interface Finding {
    id: string;
    engagementId: string;
    domain: AuditDomain;
    severity: FindingSeverity;
    code: string;
    message: string;
    amount?: number;
    status: FindingStatus;
    createdAt: string;
}

export interface WorkpaperTask {
    id: string;
    engagementId: string;
    findingId?: string;
    title: string;
    description?: string;
    status: 'OPEN' | 'IN_PROGRESS' | 'DONE' | 'BLOCKED';
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    assignee?: string;
    dueDate?: string;
}

export interface Report {
    id: string;
    engagementId: string;
    title: string;
    status: ReportStatus;
    generatedAt: string;
    generatedBy: string;
    downloadUrl?: string;
}

export interface Document {
    id: string;
    name: string;
    type: DocumentType;
    size: number;
    uploadedAt: string;
    uploadedBy: string;
    linkedFindingsCount: number;
}

export interface DataIngestionStatus {
    tb: boolean;
    gl: boolean;
    bank: boolean;
    payroll: boolean;
    tax: boolean;
    inventory: boolean;
}

// API Responses
export interface AuditOverviewStats {
    domain: AuditDomain;
    highCount: number;
    mediumCount: number;
    lowCount: number;
    score: number;
    hasRun: boolean;
}