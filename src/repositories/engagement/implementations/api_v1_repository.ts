import { EngagementRepository } from '../engagement_repository';
import { Engagement } from '../../../models/engagement';
import Axios, { AxiosInstance } from 'axios';

export class ApiV1EngagementRepository extends EngagementRepository {
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
      const {data: engagementsData} = await this.axios.get(
      'https://omp-backend-domp2.apps.s11.core.rht-labs.com/engagements');
      return engagementsData.map((engagementMap) => new Engagement(engagementMap as Engagement));
  }
  async createEngagement(data: any): Promise<void> {
      this.axios.post(`${this.baseUrl}/engagements`, data);
  }
}