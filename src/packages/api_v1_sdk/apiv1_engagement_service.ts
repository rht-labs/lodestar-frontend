import {
  EngagementSearchParameters,
  EngagementService,
} from '../../services/engagement_service/engagement_service';
import { Engagement, getEngagementStatus } from '../../schemas/engagement';
import { EngagementFormConfig } from '../../schemas/engagement_config';
import { AlreadyExistsError } from '../../services/engagement_service/engagement_service_errors';
import { EngagementJsonSerializer } from '../../serializers/engagement/engagement_json_serializer';
import { Logger } from '../../utilities/logger';
import { handleAxiosResponseErrors } from './http_error_handlers';
import { getApiV1HttpClient } from './client';
import { AxiosInstance } from 'axios';

export class Apiv1EngagementService implements EngagementService {
  private axios: AxiosInstance;
  constructor() {
    this.axios = getApiV1HttpClient();
  }
  async checkSubdomainUniqueness(subdomain: string): Promise<boolean> {
    return this.axios
      .head(`/engagements/subdomain/${subdomain}`)
      .then(() => true)
      .catch(() => false);
  }
  private static engagementSerializer = new EngagementJsonSerializer();
  private filterForParams(
    engagements: Array<Engagement>,
    params: EngagementSearchParameters
  ): Array<Engagement> {
    let filteredEngagements = engagements;
    if (params.engagementStatuses) {
      filteredEngagements = filteredEngagements.filter(
        e => params.engagementStatuses.indexOf(getEngagementStatus(e)) > -1
      );
    }
    if (params.regions && params.regions.length > 0) {
      filteredEngagements = filteredEngagements.filter(e =>
        params.regions.includes(e.engagement_region)
      );
    }
    if (params.startDate && params.endDate) {
      filteredEngagements = filteredEngagements.filter(
        e =>
          (e.start_date >= params.startDate &&
            e.start_date <= params.endDate) ||
          (e.end_date >= params.startDate && e.end_date <= params.endDate)
      );
    }
    if (params.include) {
      filteredEngagements = filteredEngagements.filter(e => ({
        ...params.include.reduce(
          (prev, param) => ({
            ...prev,
            [param]: e[param],
          }),
          {}
        ),
      }));
    }
    if (params.exclude) {
      for (let e of filteredEngagements) {
        for (let param of params.exclude) {
          delete e[param];
        }
      }
    }
    return filteredEngagements;
  }
  private buildQueryStringFromParameters(
    parameters: EngagementSearchParameters
  ): string {
    let queries = [];
    let searchParams = [];
    if (parameters.endDate) {
      searchParams.push(
        `end=${parameters.endDate.toISOString().split('T')[0]}`
      );
    }
    if (parameters.startDate) {
      searchParams.push(
        `start=${parameters.startDate.toISOString().split('T')[0]}`
      );
    }
    if (parameters.regions && parameters.regions.length > 0) {
      searchParams.push(`engagement_region=${parameters.regions.join(',')}`);
    }
    if (
      parameters.engagementStatuses &&
      parameters.engagementStatuses.length > 0
    ) {
      searchParams.push(`state=${parameters.engagementStatuses.join(',')}`);
    }
    if (searchParams.length > 0) {
      queries.push(`search=${searchParams.join(',')}`);
    }

    if (parameters.include && parameters.include.length > 0) {
      queries.push(`include=${parameters.include.join(',')}`);
    }

    return queries.join('&');
  }
  async fetchEngagements(
    params?: EngagementSearchParameters
  ): Promise<Engagement[]> {
    try {
      const qs = this.buildQueryStringFromParameters(params);
      console.log(qs);
      const { data: engagementsData } = await this.axios.get(
        `/engagements${qs.length > 0 ? '?' + qs : ''}`
      );
      const serializedEngagements = engagementsData.map(
        (engagementMap: { [key: string]: any }) =>
          Apiv1EngagementService.engagementSerializer.deserialize(engagementMap)
      );
      // return this.filterForParams(serializedEngagements, params);
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
