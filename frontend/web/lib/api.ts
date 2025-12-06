
import { 
  MOCK_CLIENTS, 
  MOCK_ENGAGEMENTS, 
  MOCK_AUDIT_STATS, 
  MOCK_FINDINGS, 
  MOCK_DATA_STATUS, 
  MOCK_DOCUMENTS, 
  MOCK_TASKS 
} from './constants';
import { AuditDomain, Client, Engagement, Finding } from '../types';
import { runAuditDomain } from '../../services/rules'; // Importing from existing service simulation

// --- Types for API Responses ---
interface ApiResponse<T> {
  data: T;
  error?: string;
  meta?: {
    page: number;
    total: number;
  }
}

// --- API Client Simulation (Axios-like) ---
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class ApiClient {
  private firmId: string | null = null;
  private token: string | null = null;
  private clients: Client[] = [...MOCK_CLIENTS];
  private engagements: Engagement[] = [...MOCK_ENGAGEMENTS];

  setAuth(token: string, firmId: string) {
    this.token = token;
    this.firmId = firmId;
  }

  // --- Clients ---
  async getClients() {
    await delay(300);
    return { data: this.clients };
  }

  async createClient(clientData: any) {
    await delay(500);
    const created = { ...clientData, id: `cli-${Date.now()}` };
    this.clients = [created, ...this.clients];
    return { data: created };
  }

  async updateClient(clientId: string, payload: Partial<Client>) {
    await delay(400);
    const idx = this.clients.findIndex((c) => c.id === clientId);
    if (idx === -1) throw new Error('Client not found');
    const updated = { ...this.clients[idx], ...payload };
    this.clients[idx] = updated;
    // also refresh clientName references
    this.engagements = this.engagements.map((eng) =>
      eng.clientId === clientId ? { ...eng, clientName: updated.name } : eng
    );
    return { data: updated };
  }

  async deleteClient(clientId: string) {
    await delay(400);
    const exists = this.clients.some((c) => c.id === clientId);
    if (!exists) throw new Error('Client not found');
    this.clients = this.clients.filter((c) => c.id !== clientId);
    this.engagements = this.engagements.filter((e) => e.clientId !== clientId);
    return { data: {} };
  }

  // --- Engagements ---
  async getEngagements() {
    await delay(300);
    // Enrich with client names mock logic
    const enriched = this.engagements.map(e => ({
        ...e,
        clientName: this.clients.find(c => c.id === e.clientId)?.name || 'Unknown'
    }));
    return { data: enriched };
  }

  async getEngagement(id: string) {
    await delay(200);
    const eng = this.engagements.find(e => e.id === id);
    if (!eng) throw new Error('Engagement not found');
    const client = this.clients.find(c => c.id === eng.clientId);
    return { data: { ...eng, clientName: client?.name } };
  }

  // --- Audit ---
  async getAuditOverview(engagementId: string) {
    await delay(600);
    return { data: MOCK_AUDIT_STATS };
  }

  async runAudit(engagementId: string, domain: AuditDomain) {
    // Calling the deterministic rules engine service
    return await runAuditDomain(domain, engagementId);
  }

  async getFindings(engagementId: string, domain?: AuditDomain) {
    await delay(400);
    if (domain) {
      return { data: MOCK_FINDINGS.filter(f => f.domain === domain) };
    }
    return { data: MOCK_FINDINGS };
  }

  // --- Data & Docs ---
  async getDataStatus(engagementId: string) {
    await delay(200);
    return { data: MOCK_DATA_STATUS };
  }

  async getDocuments(engagementId: string) {
    await delay(300);
    return { data: MOCK_DOCUMENTS };
  }

  async getWorkpaperTasks(engagementId: string) {
    await delay(300);
    return { data: MOCK_TASKS };
  }
}

export const api = new ApiClient();

export async function updateClient(clientId: string, payload: Partial<Client>) {
  const res = await api.updateClient(clientId, payload);
  return res.data;
}

export async function deleteClient(clientId: string) {
  await api.deleteClient(clientId);
}
