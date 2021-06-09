import { useCallback, useState } from 'react';
import { EngagementUseCase } from '../schemas/engagement';
import {
  UseCaseFilter,
  UseCaseService,
} from '../services/use_case_service/use_case_service';

export const useUseCases = (useCaseService: UseCaseService) => {
  const [useCases, setUseCases] = useState<EngagementUseCase[]>([]);

  const getUseCases = useCallback(
    async (filter: UseCaseFilter) => {
      const result = await useCaseService.getUseCases(filter);
      setUseCases(result);
    },
    [useCaseService]
  );

  return [useCases, getUseCases] as [
    EngagementUseCase[],
    (filter?: UseCaseFilter) => Promise<void>
  ];
};
