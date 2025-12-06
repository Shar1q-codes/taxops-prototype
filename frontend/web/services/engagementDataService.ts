// Provides an abstraction for engagement- and client-related data access so UI layers stay decoupled from concrete APIs.
import { api } from '../lib/api';
import { Client, Engagement } from '../types';

export interface EngagementDataService {
  fetchClients(): Promise<Client[]>;
  fetchEngagements(): Promise<Engagement[]>;
  fetchEngagementById(id: string): Promise<Engagement>;
}

class ApiEngagementDataService implements EngagementDataService {
  constructor(private readonly apiClient = api) {}

  async fetchClients(): Promise<Client[]> {
    const res = await this.apiClient.getClients();
    return res.data;
  }

  async fetchEngagements(): Promise<Engagement[]> {
    const res = await this.apiClient.getEngagements();
    return res.data;
  }

  async fetchEngagementById(id: string): Promise<Engagement> {
    const res = await this.apiClient.getEngagement(id);
    return res.data;
  }
}

export const engagementDataService: EngagementDataService = new ApiEngagementDataService();
