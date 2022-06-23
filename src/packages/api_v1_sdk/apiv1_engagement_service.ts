import {
  EngagementSearchParameters,
  EngagementService,
} from '../../services/engagement_service/engagement_service';
import { Engagement } from '../../schemas/engagement';
import { EngagementFormConfig } from '../../schemas/engagement_config';
import { AlreadyExistsError, BadRequestError, NamingError } from '../../services/engagement_service/engagement_service_errors';
import { EngagementJsonSerializer } from '../../serializers/engagement/engagement_json_serializer';
import { Logger } from '../../utilities/logger';
import { handleAxiosResponseErrors } from './http_error_handlers';
import { getApiV1HttpClient } from './client';
import { AxiosInstance } from 'axios';

export class Apiv1EngagementService implements EngagementService {
  private axios: AxiosInstance;
  constructor() {
    this.axios = getApiV1HttpClient();
    this.getEngagementById = this.getEngagementById.bind(this);
  }

  async checkSubdomainUniqueness(subdomain: string): Promise<boolean> {
    return this.axios
      .head(`/engagements/subdomain/${subdomain}`)
      .then(() => true)
      .catch(() => false);
  }
  private static engagementSerializer = new EngagementJsonSerializer();

  private buildQueryStringFromParameters(
    parameters: EngagementSearchParameters
  ): string {
    let queries = [];
    let searchParams = [];
    if (!parameters.endDate && parameters.startDate) {
      parameters.endDate = new Date();
    }
    if (!parameters.startDate && parameters.endDate) {
      parameters.startDate = new Date();
    }
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
    if(parameters.types && parameters.types.length > 0) {
      parameters.types.forEach(type => queries.push(`types=${type}`))
    }
    if (parameters.regions && parameters.regions.length > 0) {
      parameters.regions.forEach(region => queries.push(`regions=${region}`))
    }
    if (parameters.engagementStatuses && parameters.engagementStatuses.length > 0) {
        parameters.engagementStatuses.forEach(stat => queries.push(`states=${stat.toLocaleUpperCase()}`))
    }
    if(parameters.search) {
      queries.push(`q=${parameters.search.trim()}`)
    }
    if (parameters.category) {
      queries.push(`category=${parameters.category}`)
    }
    if (parameters.include && parameters.include.length > 0) {
      queries.push(`include=${parameters.include.join(',')}`);
    }
    if (parameters.exclude && parameters.exclude.length > 0) {
      queries.push(`exclude=${parameters.exclude.join(',')}`);
    }
    if (parameters.pageNumber) {
      queries.push(`page=${parameters.pageNumber}`);
    }
    if (parameters.perPage) {
      queries.push(`perPage=${parameters.perPage}`);
    }
    if (parameters.sortField) {
      queries.push(`sortFields=${parameters.sortField}`);
    }
    if (searchParams.length > 0) {
      queries.push(`search=${encodeURIComponent(searchParams.join('&'))}`);
    }

    return queries.join('&');
  }
  async fetchEngagements(
    params?: EngagementSearchParameters
  ): Promise<Engagement[]> {
    try {
      const qs = this.buildQueryStringFromParameters(params);
      const { data: engagementsData } = await this.axios.get(
        `/engagements${qs.length > 0 ? '?' + qs : ''}`,
        {
          headers: {
            'Accept-version': 'v1',
          },
        }
      );
      const serializedEngagements = engagementsData.map(
        (engagementMap: { [key: string]: any }) =>
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
          'A project with this customer name and project name already exists 👀'
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
        `/engagements/${engagement.uuid}`,
        { ...serializedEngagement, commit_message: commitMessage }
      );
      return Apiv1EngagementService.engagementSerializer.deserialize(data);
    } catch (e) {
      if (e.isAxiosError) {
        if(e.response.status === 400) {

          if(e.response.data["parameter_violations"]) {
            const errorMessage = e.response.data["parameter_violations"][0];
            let field = "Parameter";
            if(errorMessage.path === 'put.engagement.customerName') {
              field = "Client name";
            } else if(errorMessage.path === 'put.engagement.name') {
              field = 'Engagement name';
            }
            throw new NamingError(
              `${field} value ${errorMessage.value} is invalid. 😔 ${errorMessage.message}`
            );
          } else if(e.response.data["lodestarMessage"]) {
            throw new BadRequestError(e.response.data["lodestarMessage"]);
          }
        }

        if (e.response.status === 409) {
          throw new AlreadyExistsError(
            'A project with this customer name and project name already exists 👀'
          );
        }
        handleAxiosResponseErrors(e);
      } else {
        throw e;
      }
    }
  }
  async launchEngagement(engagementData: Engagement): Promise<Engagement> {
    try {
      const { data } = await this.axios.put(`/engagements/launch`, {
        ...Apiv1EngagementService.engagementSerializer.serialize(
          engagementData
        ),
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
  async getConfig(type?: string): Promise<EngagementFormConfig> {
    try {
      const { data } = await this.axios.get(`/config`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept-version': 'v2',
          Accept: 'application/json',
        },
        params: {
          type,
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
    const response = await this.axios.head(`/engagements/${engagement.uuid}`);

    const lastUpdatedTimestamp = engagement.last_update_id;

    const headerStamp = response?.headers?.['last-update'];

    return lastUpdatedTimestamp !== headerStamp;
  }

  async getEngagementById(id: string): Promise<Engagement> {
    try {
      const { data } = await this.axios.get(`/engagements/${id}`);
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
