import React from 'react';
import { useServiceProviders } from '../context/service_provider_context/service_provider_context';
import { useDebouncedCallback } from './use_debounce';

export const useSubdomainUniqueness = () => {
  const { engagementService } = useServiceProviders();
  const [isUnique, setIsUnique] = React.useState<boolean | undefined>(true);
  const [loading, setLoading] = React.useState<boolean>(false);

  const _checkSubdomain = async (
    subdomain: string,
    deconflictedSubdomain?: string
  ) => {
    setLoading(true);
    try {
      if (subdomain === deconflictedSubdomain) {
        setIsUnique(true);
      } else {
        const result = await engagementService.checkSubdomainUniqueness(
          subdomain
        );
        setIsUnique(result);
      }
    } catch (e) {
      setIsUnique(false);
    } finally {
      setLoading(false);
    }
  };

  const checkSubdomain = useDebouncedCallback(_checkSubdomain, 1000);

  return { isUnique, checkSubdomain, loading };
};
