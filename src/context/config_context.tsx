import React, { createContext, useState, useCallback, useEffect } from 'react';
import { PublicConfigRepository } from '../repositories/config/implementations/public_config_repository';
import { Config } from '../models/config';
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
    const configRepository = new PublicConfigRepository({});
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
