import React, { createContext, useState, useCallback } from 'react';
import { Config } from '../../schemas/config';
import { ConfigService } from '../../services/config_service/config_service';
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
  configRepository,
}: {
  configRepository: ConfigService;
  children: React.ReactChild;
}) => {
  const [appConfig, setAppConfig] = useState<Config>();

  const fetchConfig = useCallback(async () => {
    const config = await configRepository.fetchConfig();
    setAppConfig(config);
  }, [configRepository]);

  return (
    <Provider
      value={{
        appConfig,
        fetchConfig,
      }}
    >
      {children}
    </Provider>
  );
};
