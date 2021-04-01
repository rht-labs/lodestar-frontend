import {
  EngagementSearchParameters,
  EngagementService,
} from '../../services/engagement_service/engagement_service';
import { Engagement } from '../../schemas/engagement';
import { EngagementFormConfig } from '../../schemas/engagement_config';
import { AlreadyExistsError } from '../../services/engagement_service/engagement_service_errors';
import { EngagementJsonSerializer } from '../../serializers/engagement/engagement_json_serializer';
import { Logger } from '../../utilities/logger';
import { handleAxiosResponseErrors } from '../../services/common/axios/http_error_handlers';
import { getApiV1HttpClient } from './client';

export class Apiv1EngagementService implements EngagementService {
  private baseUrl: string;
  constructor(baseURL: string) {
    this.baseUrl = baseURL;
  }
  get axios() {
    return getApiV1HttpClient(this.baseUrl);
  }
  checkSubdomainUniqueness(subdomain: string): Promise<boolean> {
    return this.axios
      .head(`/engagements/subdomain/${subdomain}`)
      .then(() => true)
      .catch(() => false);
  }
  private static engagementSerializer = new EngagementJsonSerializer();
  async fetchEngagements(
    params?: EngagementSearchParameters
  ): Promise<Engagement[]> {
    try {
      const { data: engagementsData } = await this.axios.get(`/engagements`);
      const serializedEngagements = engagementsData.map(engagementMap =>
        Apiv1EngagementService.engagementSerializer.deserialize(engagementMap)
      );
      return serializedEngagements;
    } catch (e) {
      if (e.isAxiosError) {
        handleAxiosResponseErrors(e);
      } else {
        throw e;
      }
    }
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
      if (e.isAxiosError) {
        handleAxiosResponseErrors(e);
      } else {
        throw e;
      }
    }
  }
  async saveEngagement(
    engagement: Engagement,
    commitMessage?: string
  ): Promise<Engagement> {
    try {
      const serializedEngagement = Apiv1EngagementService.engagementSerializer.serialize(
        engagement
      );
      const {
        data,
      } = await this.axios.put(
        `/engagements/customers/${engagement.customer_name}/projects/${engagement.project_name}`,
        { ...serializedEngagement, commit_message: commitMessage }
      );
      return Apiv1EngagementService.engagementSerializer.deserialize(data);
    } catch (e) {
      if (e.isAxiosError) {
        handleAxiosResponseErrors(e);
      } else {
        throw e;
      }
    }
  }
  async launchEngagement(engagementData: Engagement): Promise<Engagement> {
    try {
      const { data } = await this.axios.put(`/engagements/launch`, {
        ...engagementData,
        commit_message: 'Engagement Launched',
      });
      return Apiv1EngagementService.engagementSerializer.deserialize(data);
    } catch (e) {
      if (e.isAxiosError) {
        handleAxiosResponseErrors(e);
      } else {
        throw e;
      }
    }
  }
  async deleteEngagement(engagement: Engagement): Promise<Engagement> {
    try {
      const { data } = await this.axios.delete(
        `/engagements/${engagement.uuid}`
      );
      return Apiv1EngagementService.engagementSerializer.deserialize(data);
    } catch (e) {
      if (e.response.status === 400) {
        throw new AlreadyExistsError(
          'This engagement is already launched and has not been removed'
        );
      }
      if (e.response.status === 404) {
        throw new AlreadyExistsError('Engagement is not found');
      }
      if (e.isAxiosError) {
        handleAxiosResponseErrors(e);
      } else {
        throw e;
      }
    }
  }
  async getConfig(): Promise<EngagementFormConfig> {
    try {
      const { data } = await this.axios.get(`/config`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept-version': 'v2',
          Accept: 'application/json',
        },
      });
      return data as EngagementFormConfig;
    } catch (e) {
      if (e.isAxiosError) {
        handleAxiosResponseErrors(e);
      } else {
        throw e;
      }
    }
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
    try {
      const { data } = await this.axios.get(
        `/engagements/customers/${customer_name}/projects/${project_name}`
      );
      const deserializedEngagement = Apiv1EngagementService.engagementSerializer.deserialize(
        data
      );
      return deserializedEngagement;
    } catch (e) {
      if (e.isAxiosError) {
        handleAxiosResponseErrors(e);
      } else {
        throw e;
      }
    }
  }
}
