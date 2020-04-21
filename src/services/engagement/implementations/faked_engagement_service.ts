import { EngagementService } from '../engagement_repository';
import { Engagement } from '../../../schemas/engagement';
import Axios, { AxiosInstance } from 'axios';

export class FakedEngagementService extends EngagementService {
  constructor({
    axios = Axios.create(),
    baseUrl,
  }: {
    axios?: AxiosInstance;
    baseUrl?: string;
  }) {
    super();
    this.axios = axios;
    this.baseUrl = baseUrl;
  }
  baseUrl?: string;
  axios?: AxiosInstance;
  async fetchEngagements(): Promise<Engagement[]> {
    return new Array(8).fill(null).map(() => Engagement.fromFake());
  }
  async createEngagement(data: any): Promise<void> {
    if (this.axios) {
      this.axios.post(`${this.baseUrl}/engagements`, data);
    }
  }
}
