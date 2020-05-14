import React, { createContext, useEffect, useState } from 'react';
import { useConfig } from './config_hook';
import { Config } from '../../schemas/config';
import { PublicConfigService } from '../../services/config_service/implementations/public_config_service';
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
  const [configRepository] = useState(new PublicConfigService());
  const { appConfig, fetchConfig } = useConfig({
    configRepository,
  });

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
