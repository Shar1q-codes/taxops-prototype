
import { AuditDomain, Finding, FindingSeverity, FindingStatus } from '../web/types';

// --- MOCK DATA FOR RULES ENGINE ---
// In a real app, these would come from the database (Postgres).
// We simulate the raw financial data here to run our deterministic checks against.

const MOCK_GL_ENTRIES = [
    { id: 'gl-1', date: '2024-12-31', account: '4000-Revenue', amount: 500000, description: 'Sales upload' },
    { id: 'gl-2', date: '2024-12-31', account: '4000-Revenue', amount: 154000, description: 'Adjustment' }, // Matches finding
    { id: 'gl-3', date: '2024-02-14', account: '6000-Office', amount: 450.25, description: 'Staples Order', vendor: 'Staples' },
    { id: 'gl-4', date: '2024-02-14', account: '6000-Office', amount: 450.25, description: 'Staples Order', vendor: 'Staples' }, // Duplicate
];

const MOCK_PAYROLL = [
    { id: 'emp-1', name: 'John Doe', bankAccount: '****1234', netPay: 2500 },
    { id: 'emp-2', name: 'Jane Smith', bankAccount: '****5678', netPay: 2600 },
    { id: 'emp-3', name: 'Ghost User', bankAccount: '****1234', netPay: 2500 }, // Duplicate bank with John
];

const MOCK_ASSETS = [
    { id: 'ast-1', name: 'MacBook Pro', cost: 2500, purchased: '2023-01-01', accumulatedDepreciation: 0 }, // Missed depreciation
];

// --- RULE RUNNER ---

export const runAuditDomain = async (domain: AuditDomain, engagementId: string): Promise<Finding[]> => {
    // Simulate network latency of the "Backend Worker"
    await new Promise(resolve => setTimeout(resolve, 800));

    const findings: Finding[] = [];

    const createFinding = (
        code: string, 
        message: string, 
        severity: FindingSeverity, 
        amount?: number
    ): Finding => ({
        id: `gen-f-${Math.random().toString(36).substr(2, 9)}`,
        engagementId,
        domain,
        severity,
        code,
        message,
        amount,
        status: FindingStatus.OPEN,
        createdAt: new Date().toISOString().split('T')[0]
    });

    switch (domain) {
        case AuditDomain.INCOME:
            // Rule 1: Tax Variance
            findings.push(createFinding(
                'REV_VAR_TAX',
                'Revenue in Trial Balance differs from Tax Return by > 5%',
                FindingSeverity.HIGH,
                154000.00
            ));
            // Rule 2: Cutoff
            findings.push(createFinding(
                'REV_CUTOFF',
                'Material revenue entries posted on last day of fiscal year',
                FindingSeverity.MEDIUM,
                50000.00
            ));
            break;

        case AuditDomain.EXPENSES:
            // Rule 1: Duplicates
            findings.push(createFinding(
                'DUP_EXPENSE',
                'Potential duplicate expense: Same amount ($450.25), date (Feb 14), and vendor',
                FindingSeverity.MEDIUM,
                450.25
            ));
            break;

        case AuditDomain.PAYROLL:
            // Rule 1: Ghost Employee
            findings.push(createFinding(
                'GHOST_EMP_BANK',
                'Multiple active employees sharing same bank account (****1234)',
                FindingSeverity.HIGH,
                0
            ));
            // Rule 2: Salary Variance
            findings.push(createFinding(
                'SALARY_VAR',
                'Employee net pay deviation > 20% of department average',
                FindingSeverity.LOW,
                1200.00
            ));
            break;

        case AuditDomain.ASSETS:
             // Rule 1: Missed Depreciation
             findings.push(createFinding(
                'NO_DEPR',
                'Fixed Asset (MacBook Pro) > 1 year old with $0 accumulated depreciation',
                FindingSeverity.MEDIUM,
                2500.00
            ));
            break;
            
        case AuditDomain.LIABILITIES:
            findings.push(createFinding(
                'NEG_AP',
                'Accounts Payable contains material negative balances',
                FindingSeverity.MEDIUM,
                -4500.00
            ));
            break;
            
        case AuditDomain.BANK_CASH:
            findings.push(createFinding(
                'ROUND_TRANSFERS',
                'Large round-dollar transfers ($10,000+) without description',
                FindingSeverity.LOW,
                10000.00
            ));
            break;

        case AuditDomain.INVENTORY:
            findings.push(createFinding(
                'INV_SLOW_MOVING',
                'Items in inventory with no movement for > 180 days',
                FindingSeverity.MEDIUM,
                32000.00
            ));
            findings.push(createFinding(
                'INV_NEG_QTY',
                'Negative quantity on hand detected for SKU-992',
                FindingSeverity.HIGH,
                0
            ));
            break;

        case AuditDomain.COMPLIANCE:
            findings.push(createFinding(
                'TAX_RATE_VAR',
                'Effective tax rate (12%) significantly lower than statutory rate (21%)',
                FindingSeverity.MEDIUM,
                0
            ));
            break;

        case AuditDomain.BOOKS:
            findings.push(createFinding(
                'SUSPENSE_ACCT',
                'Material balance remaining in Suspense/Uncategorized account',
                FindingSeverity.HIGH,
                12500.00
            ));
            findings.push(createFinding(
                'BACKDATED_ENTRIES',
                'GL entries posted to closed prior periods',
                FindingSeverity.LOW,
                500.00
            ));
            break;

        case AuditDomain.CONTROLS:
            findings.push(createFinding(
                'MANUAL_JE_CASH',
                'Manual journal entries posted directly to Cash accounts',
                FindingSeverity.HIGH,
                55000.00
            ));
            break;

        case AuditDomain.TAX_DOCS:
            findings.push(createFinding(
                'MISSING_1099',
                'Vendor payments > $600 without corresponding 1099 form on file',
                FindingSeverity.MEDIUM,
                4200.00
            ));
            break;

        default:
            break;
    }

    return findings;
};
