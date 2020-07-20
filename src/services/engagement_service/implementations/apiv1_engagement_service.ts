import { EngagementService } from '../engagement_service';
import { Engagement } from '../../../schemas/engagement_schema';
import Axios, { AxiosInstance } from 'axios';
import { EngagementFormConfig } from '../../../schemas/engagement_config';
import { AlreadyExistsError } from '../engagement_service_errors';
import { EngagementJsonSerializer } from '../../../serializers/engagement/engagement_json_serializer';
import { Logger } from '../../../utilities/logger';

export class Apiv1EngagementService extends EngagementService {
  constructor(baseURL: string, onBeforeRequest, onAfterRequest, onFailure) {
    super();
    this.axios = Axios.create({ baseURL });
    this.axios.interceptors.request.use(onBeforeRequest);
    this.axios.interceptors.response.use(onAfterRequest, onFailure);
  }
  private static engagementSerializer = new EngagementJsonSerializer();
  axios?: AxiosInstance;
  async fetchEngagements(): Promise<Engagement[]> {
    const { data: engagementsData } = await this.axios.get(`/engagements`);
    const serializedEngagements = engagementsData.map(engagementMap =>
      Apiv1EngagementService.engagementSerializer.deserialize(engagementMap)
    );
    return serializedEngagements;
  }
  async createEngagement(engagementData: any): Promise<Engagement> {
    try {
      const { data } = await this.axios.post(`/engagements`, engagementData);
      return Apiv1EngagementService.engagementSerializer.deserialize(data);
    } catch (e) {
      Logger.instance.error(e);
      if (e.response.status === 409) {
        throw new AlreadyExistsError(
          'A project with this customer name and project name already exists'
        );
      }
    }
  }
  async saveEngagement(engagementData: any): Promise<Engagement> {
    const { data } = await this.axios.put(
      `/engagements/customers/${engagementData.customer_name}/projects/${engagementData.project_name}`,
      Apiv1EngagementService.engagementSerializer.serialize(engagementData)
    );
    return Apiv1EngagementService.engagementSerializer.deserialize(data);
  }
  async launchEngagement(engagementData: any): Promise<Engagement> {
    const { data } = await this.axios.put(
      `/engagements/launch`,
      engagementData
    );
    return Apiv1EngagementService.engagementSerializer.deserialize(data);
  }
  async getConfig(): Promise<EngagementFormConfig> {
    const { data } = await this.axios.get(`/config`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept-version': 'v2',
        Accept: 'application/json',
      },
    });
    return data as EngagementFormConfig;
  }
  async checkHasUpdates(engagement: Engagement): Promise<boolean> {
    const response = await this.axios.head(
      `/engagements/customers/${engagement?.customer_name}/projects/${engagement?.project_name}`
    );

    return engagement['last_update'] !== response?.headers?.['last-update'];
  }

  async getEngagementByCustomerAndProjectName(
    customer_name: string,
    project_name: string
  ): Promise<Engagement> {
    const { data } = await this.axios.get(
      `/engagements/customers/${customer_name}/projects/${project_name}`
    );
    return Apiv1EngagementService.engagementSerializer.deserialize(data);
  }
}
