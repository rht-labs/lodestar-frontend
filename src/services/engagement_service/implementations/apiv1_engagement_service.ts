import { EngagementService } from '../engagement_service';
import { Engagement } from '../../../schemas/engagement_schema';
import { AxiosInstance } from 'axios';

export class Apiv1EngagementService extends EngagementService {
  constructor({ axios, baseUrl }: { axios?: AxiosInstance; baseUrl?: string }) {
    super();
    if (!axios) {
      throw new Error('axios is required');
    }
    this.axios = axios;
    this.baseUrl = baseUrl;
  }
  baseUrl?: string;
  axios?: AxiosInstance;
  async fetchEngagements(): Promise<Engagement[]> {
    const { data: engagementsData } = await this.axios.get(
      `${this.baseUrl}/engagements`
    );
    return engagementsData.map(
      engagementMap => new Engagement(engagementMap as Engagement)
    );
  }
  async createEngagement(engagementData: any): Promise<Engagement> {
    const { data } = await this.axios.post(
      `${this.baseUrl}/engagements`,
      engagementData
    );
    return new Engagement(data as Engagement);
  }
  async saveEngagement(engagementData: any): Promise<Engagement> {
    const { data } = await this.axios.put(
      `${this.baseUrl}/engagements/customers/${engagementData.customer_name}/projects/${engagementData.project_name}`,
      engagementData
    );
    return new Engagement(data as Engagement);
  }
  async launchEngagement(engagementData: any): Promise<Engagement> {
    const { data } = await this.axios.put(
      `${this.baseUrl}/engagements/launch`,
      engagementData
    );
    return new Engagement(data as Engagement);
  }
}
