import { EngagementUseCase } from '../../schemas/engagement';
import { UseCaseService } from '../../services/use_case_service/use_case_service';
import { getApiV1HttpClient } from './client';

export class Apiv1UseCasesService implements UseCaseService {
  private get axios() {
    return getApiV1HttpClient();
  }
  private apiResponseToUseCase = (
    apiResponseObject: any
  ): EngagementUseCase => {
    return {
      id: apiResponseObject['uuid'],
      description: apiResponseObject['description'],
    };
  };
  async getUseCases(): Promise<EngagementUseCase[]> {
    const { data } = await this.axios.get('/engagements/usecases');
    const engagementUseCases = data.map(this.apiResponseToUseCase);
    return engagementUseCases;
  }
}
