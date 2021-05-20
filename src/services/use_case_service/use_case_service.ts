import { EngagementUseCase } from '../../schemas/engagement';

export interface UseCaseFilter {
  page?: number;
  perPage?: number;
}
export interface UseCaseService {
  getUseCases(filter?: UseCaseFilter): Promise<EngagementUseCase[]>;
}
