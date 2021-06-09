import { EngagementUseCase } from '../../schemas/engagement';
import {
  UseCaseFilter,
  UseCaseService,
} from '../../services/use_case_service/use_case_service';
import { getApiV1HttpClient } from './client';

export class Apiv1UseCasesService implements UseCaseService {
  private get axios() {
    return getApiV1HttpClient();
  }
  private buildQueryString({
    perPage = 10,
    page = 1,
    startDate,
    endDate,
    regions = [],
  }: UseCaseFilter = {}): string {
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
  private apiResponseToUseCase = (
    apiResponseObject: any
  ): EngagementUseCase => {
    return {
      id: apiResponseObject['uuid'],
      description: apiResponseObject['description'],
    };
  };
  async getUseCases(filter?: UseCaseFilter): Promise<EngagementUseCase[]> {
    const { data } = await this.axios.get(
      `/engagements/usecases?${this.buildQueryString(filter)}`
    );
    const engagementUseCases = data.map(this.apiResponseToUseCase);
    return engagementUseCases;
  }
}
