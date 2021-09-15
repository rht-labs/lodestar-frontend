import { useEffect, useState } from 'react';

import { EnabledUsers } from '../schemas/engagement';

export const useEnabledUsers = (fetcher: () => Promise<EnabledUsers>) => {
  const [enabledUsers, setEnabledUsers] = useState<EnabledUsers | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetcher()
      .then(enabledUsers => {
        setEnabledUsers(enabledUsers);
      })
      .finally(() => setIsLoading(false));
  }, [fetcher]);

  return { enabledUsers, isLoading };
};
