import { useEffect, useState } from 'react';

import { EnabledUsers } from '../schemas/engagement';
// import { EnabledUsersFilter } from '../services/enabled_users_service/enabled_users_service';

export const useEnabledUsers = (fetcher: () => Promise<EnabledUsers>) => {
  const [enabledUsers, setEnabledUsers] = useState<EnabledUsers | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
   setIsLoading(true);
   fetcher(filter)
   .then((enabledUsers) => {
     setEnabledUsers(enabledUsers);
   })
   .finally(() => setIsLoading(false)); 
  }, [fetcher, filter])

  return {enabledUsers , isLoading}
}
