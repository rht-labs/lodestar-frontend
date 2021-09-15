import {
  EnabledUsersFilter,
  EnabledUsersService,
} from '../../services/enabled_users_service/enabled_users_service';

import { EnabledUsers } from '../../schemas/engagement';
import { getApiV1HttpClient } from './client';

export class Apiv1EnabledUsersService implements EnabledUsersService {
  private get axios() {
    return getApiV1HttpClient();
  }
  private buildQueryString({
    perPage = 10,
    page = 1,
    startDate,
    endDate,
    regions = [],
  }: EnabledUsersFilter = {}): string {
    const queries: string[] = [];
    queries.push(`perPage=${perPage}`);
    queries.push(`page=${page}`);
    const searchParams = [];
    if (startDate != null) {
      searchParams.push(`start=${startDate.toISOString().split('T')[0]}`);
    }
    if (endDate != null) {
      searchParams.push(`start=${endDate.toISOString().split('T')[0]}`);
    }
    if (regions.length > 0) {
      searchParams.push(`engagement_region=${regions.join(',')}`);
    }
    if (searchParams.length > 0) {
      queries.push(`search=${encodeURIComponent(searchParams.join('&'))}`);
    }
    return queries.join('&');
  }
  // private apiResponseToUseCase = (
  //   apiResponseObject: any
  // ): EnabledUsers => {
  //   return {
  //     id: apiResponseObject['uuid'],
  //     description: apiResponseObject['description'],
  //   };
  // };
  async getEnabledUsers(filter?: EnabledUsersFilter): Promise<EnabledUsers[]> {
    const { data } = await this.axios.get(
      `/engagements/users/summary?${this.buildQueryString(filter)}`
    );
    // const engagementUseCases = data.map(this.apiResponseToUseCase);
    return data;
  }
}