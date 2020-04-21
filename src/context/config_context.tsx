import React, { createContext, useState, useCallback, useEffect } from 'react';
import { PublicConfigService } from '../services/config/implementations/public_config_service';
import { Config } from '../schemas/config';
export interface ConfigContextParams {
  appConfig: Config | null;
}

export interface ConfigContext extends ConfigContextParams {
  fetchConfig: () => void;
}

export const ConfigContext = createContext<ConfigContext>({
  appConfig: null,
  fetchConfig: () => null,
});
const { Provider } = ConfigContext;

export const ConfigProvider = ({
  children,
}: {
  children: React.ReactChild;
}) => {
  const [appConfig, setAppConfig] = useState<Config | null>(null);

  const fetchConfig = useCallback(async () => {
    const configRepository = new PublicConfigService({});
    const config = await configRepository.fetchConfig();
    setAppConfig(config);
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  return (
    <Provider
      value={{
        appConfig,
        fetchConfig,
      }}
    >
      {appConfig ? children : null}
    </Provider>
  );
};
