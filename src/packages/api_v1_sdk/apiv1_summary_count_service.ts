import {
  SummaryCountFilter,
  SummaryCountService,
} from '../../services/summary_count_service/summary_count_service';

import { SummaryCount } from '../../schemas/engagement';
import { getApiV1HttpClient } from './client';

export class Apiv1SummaryCountService implements SummaryCountService {
  private get axios() {
    return getApiV1HttpClient();
  }
  private buildQueryString({
    perPage = 10,
    page = 1,
    startDate,
    endDate,
    regions = [],
  }: SummaryCountFilter = {}): string {
    const queries: string[] = [];
    queries.push(`perPage=${perPage}`);
    queries.push(`page=${page}`);
    const searchParams = [];
    if (startDate != null) {
      searchParams.push(`start=${startDate.toISOString().split('T')[0]}`);
    }
    if (endDate != null) {
      searchParams.push(`end=${endDate.toISOString().split('T')[0]}`);
    }
    if (regions.length > 0) {
      regions.forEach(region => queries.push(`region=${region}`));
    }
    if (searchParams.length > 0) {
      queries.push(`search=${encodeURIComponent(searchParams.join('&'))}`);
    }
    return queries.join('&');
  }
  async getSummaryCount(filter?: SummaryCountFilter): Promise<SummaryCount> {
    const { data } = await this.axios.get(
      `/engagements/count?${this.buildQueryString(filter)}`
    );
    return {
      upcoming: data.UPCOMING,
      past: data.PAST,
      terminating: data.TERMINATING,
      active: data.ACTIVE,
      any: data.ANY
    };
  }
}