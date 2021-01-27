import { useCallback, useEffect, useState } from 'react';
import { validateHostingEnvironment } from '../common/validate_hosting_environment';
import { useServiceProviders } from '../context/service_provider_context/service_provider_context';
import { HostingEnvironment } from '../schemas/hosting_environment';

export const useHostingEnvironmentCheck = (
  hostingEnvironment: HostingEnvironment
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isValid, setIsValid] = useState<boolean | undefined>(undefined);
  const { engagementService } = useServiceProviders();
  const checkHostingEnvironment = useCallback(
    async (hostingEnvironment: HostingEnvironment) => {
      setIsLoading(true);
      try {
        const isValid = await validateHostingEnvironment(
          hostingEnvironment,
          engagementService
        );
        setIsValid(isValid);
      } catch (e) {
        setIsValid(false);
      } finally {
        setIsLoading(false);
      }
    },
    [setIsValid, setIsLoading, engagementService]
  );
  useEffect(() => {
    checkHostingEnvironment(hostingEnvironment);
  }, [hostingEnvironment, checkHostingEnvironment]);
  return { checkHostingEnvironment, isLoading, isValid };
};
