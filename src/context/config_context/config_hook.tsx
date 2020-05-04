import { useCallback, useState, useEffect } from 'react';
import { PublicConfigService } from '../../services/config_service/implementations/public_config_service';
import { Config } from '../../schemas/config';
import { ConfigService } from '../../services/config_service/config_service';

export const useConfig = ({
  configRepository,
}: {
  configRepository: ConfigService;
}) => {
  const [appConfig, setAppConfig] = useState<Config>();

  const fetchConfig = useCallback(async () => {
    const config = await configRepository.fetchConfig();
    setAppConfig(config);
  }, [configRepository]);

  return {
    appConfig,
    fetchConfig,
  };
};
