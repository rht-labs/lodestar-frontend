import { useEffect, useState } from 'react';

import { PracticeCount } from '../schemas/engagement';

export const usePracticeCount = (fetcher: () => Promise<PracticeCount>) => {
  const [practiceCount, setPracticeCount] = useState<PracticeCount | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetcher()
      .then(practiceCount => {
        setPracticeCount(practiceCount);
      })
      .finally(() => setIsLoading(false));
  }, [fetcher]);

  return { practiceCount, isLoading };
};
