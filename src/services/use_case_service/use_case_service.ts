import { EngagementUseCase } from '../../schemas/engagement';

export interface UseCaseFilter {
  page?: number;
  perPage?: number;
  startDate?: Date;
  endDate?: Date;
  regions?: string[];
}
export interface UseCaseService {
  getUseCases(filter?: UseCaseFilter): Promise<EngagementUseCase[]>;
}
