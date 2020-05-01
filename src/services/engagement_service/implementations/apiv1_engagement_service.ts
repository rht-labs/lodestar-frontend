import { EngagementService } from '../engagement_service';
import { Engagement } from '../../../schemas/engagement_schema';
import Axios, { AxiosInstance } from 'axios';
import yaml from 'yaml';
import { UserToken } from '../../../schemas/user_token_schema';
const TOKEN_STORAGE_KEY = 'token';

export class Apiv1EngagementService extends EngagementService {
  constructor(baseURL: string) {
    super();
    this.axios = Axios.create({ baseURL });
    this.axios.interceptors.request.use(request => {
      const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY) || '';

      const tokenMap = JSON.parse(storedToken);

      const { accessToken } = UserToken.fromMap(tokenMap);
      request.headers.Authorization = `Bearer ${accessToken}`;
      return request;
    });
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
    const { data } = await this.axios.get(`/config`);
    const parsedData = yaml.parse(data.content);
    return {
      openshiftOptions: parsedData['openshift'],
      providerOptions: parsedData['providers'],
      userManagementOptions: parsedData['user-management'],
    };
  }
}
