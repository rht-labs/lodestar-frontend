import { EngagementRepository } from './engagement_repository';
import { Engagement } from '../../models/engagement';
import faker from 'faker';
import Axios, { AxiosInstance } from 'axios';

export class FakedEngagementRepository extends EngagementRepository {
  constructor({
    axios = Axios.create(),
    baseUrl,
  }: {
    axios: AxiosInstance;
    baseUrl: string;
  }) {
    super();
    this.axios = axios;
    this.baseUrl = baseUrl;
  }
  baseUrl: string;
  axios: AxiosInstance;
  async fetchEngagements(): Promise<Engagement[]> {
    return new Array(8)
      .fill(null)
      .map(() => new Engagement({ name: faker.company.companyName() }));
  }
  async createEngagement(data: any): Promise<void> {
    this.axios.post(`${this.baseUrl}/engagements`, data);
  }
}
