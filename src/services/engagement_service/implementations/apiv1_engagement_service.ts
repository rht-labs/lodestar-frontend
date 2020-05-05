import { EngagementService } from '../engagement_service';
import { Engagement } from '../../../schemas/engagement_schema';
import Axios, { AxiosInstance } from 'axios';

export class Apiv1EngagementService extends EngagementService {
  constructor(baseURL: string, onBeforeRequest, onAfterRequest, onFailure) {
    super();
    this.axios = Axios.create({ baseURL });
    this.axios.interceptors.request.use(onBeforeRequest);
    this.axios.interceptors.response.use(onAfterRequest, onFailure);
  }
  axios?: AxiosInstance;
  async fetchEngagements(): Promise<Engagement[]> {
    const { data: engagementsData } = await this.axios.get(`/engagements`);
    return engagementsData.map(
      engagementMap => new Engagement(engagementMap as Engagement)
    );
  }
  async createEngagement(engagementData: any): Promise<Engagement> {
    const { data } = await this.axios.post(`/engagements`, engagementData);
    return new Engagement(data as Engagement);
  }
  async saveEngagement(engagementData: any): Promise<Engagement> {
    const { data } = await this.axios.put(
      `/engagements/customers/${engagementData.customer_name}/projects/${engagementData.project_name}`,
      engagementData
    );
    return new Engagement(data as Engagement);
  }
  async launchEngagement(engagementData: any): Promise<Engagement> {
    const { data } = await this.axios.put(
      `/engagements/launch`,
      engagementData
    );
    return new Engagement(data as Engagement);
  }
  async getConfig(): Promise<any> {
    const { data } = await this.axios.get(`/config`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept-version': 'v2',
        Accept: 'application/json',
      },
    });
    return {
      openshiftOptions: data['openshift'],
      providerOptions: data['providers'],
      userManagementOptions: data['user-management'],
    };
  }
}
