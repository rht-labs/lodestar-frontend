import { useEffect, useState } from 'react';

import { SummaryCount } from '../schemas/engagement';

export const useSummaryCount = (fetcher: () => Promise<SummaryCount>) => {
  const [summaryCount, setSummaryCount] = useState<SummaryCount | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetcher()
      .then(summaryCount => {
        setSummaryCount(summaryCount);
      })
      .finally(() => setIsLoading(false));
  }, [fetcher]);

  return { summaryCount, isLoading };
};
