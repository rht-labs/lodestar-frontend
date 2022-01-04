import {
  PracticeCountFilter,
  PracticeCountService,
} from '../../services/practice_count_service/practice_count_service';

import { PracticeCount } from '../../schemas/engagement';
import { getApiV1HttpClient } from './client';

export class Apiv1PracticeCountService implements PracticeCountService {
  private get axios() {
    return getApiV1HttpClient();
  }
  private buildQueryString({
    perPage = 10,
    page = 1,
    startDate,
    endDate,
    regions = [],
  }: PracticeCountFilter = {}): string {
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
      searchParams.push(`engagement_region=${regions.join(',')}`);
    }
    if (searchParams.length > 0) {
      queries.push(`search=${encodeURIComponent(searchParams.join('&'))}`);
    }
    return queries.join('&');
  }
  async getPracticeCount(filter?: PracticeCountFilter): Promise<PracticeCount[]> {
    const { data } = await this.axios.get(
      `https://word-analyzer-engagements-dev.apps.openshift-4813-7bsw4.do500.redhatlabs.dev/aggregate-for-engagement?uuid=999`
    );
    
    let sorted = data.data.slice().sort((a, b) => b.value - a.value).splice(1, 5).reverse();
    
    return sorted.map(value => ({count: value.value, name: value.key}));
  }
}