import { useCallback, useState } from 'react';
import { EngagementUseCase } from '../schemas/engagement';
import { UseCaseFilter } from '../services/use_case_service/use_case_service';

export const useUseCases = (fetcher: () => Promise<EngagementUseCase[]>) => {
  const [useCases, setUseCases] = useState<EngagementUseCase[]>([]);

  const getUseCases = useCallback(async () => {
    setUseCases(await fetcher());
  }, [fetcher]);

  return [useCases, getUseCases] as [
    EngagementUseCase[],
    (filter?: UseCaseFilter) => Promise<void>
  ];
};
