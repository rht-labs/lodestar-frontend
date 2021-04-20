import { EngagementUseCase } from '../../schemas/engagement';

export interface UseCaseService {
  getUseCases(): Promise<EngagementUseCase[]>;
}
