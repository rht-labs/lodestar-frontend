import React, { createContext, useState, useCallback, useEffect } from 'react';
import { Config } from '../../schemas/config';
import { ConfigService } from '../../services/config_service/config_service';
import { Logger, createLogger } from '../../utilities/logger';
export interface ConfigContextParams {
  appConfig: Config | null;
}

export interface IConfigContext extends ConfigContextParams {
  fetchConfig: () => void;
}

export const ConfigContext = createContext<IConfigContext>({
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

  useEffect(() => {
    if (appConfig) {
      Logger.instance = createLogger(appConfig.loggerType, appConfig.logLevel);
    }
  }, [appConfig]);

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
