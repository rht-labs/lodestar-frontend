import React, { createContext, useState, useCallback } from 'react';
import { PublicConfigRepository } from '../repositories/config/implementations/public_config_repository';
export interface ConfigContextParams {
  baseUrl: string;
  clientId: string;
  authBaseUrl: string;
  backendUrl: string;
}

export interface ConfigContext extends ConfigContextParams {
  isLoading: boolean;
  fetchConfig: () => void;
}

export const ConfigContext = createContext<ConfigContext>({
  baseUrl: '',
  clientId: '',
  authBaseUrl: '',
  backendUrl: '',
  isLoading: true,
  fetchConfig: () => null,
});
const { Provider } = ConfigContext;

export const ConfigProvider = ({
  children,
}: {
  children: React.ReactChild;
}) => {
  const [baseUrl, setBaseUrl] = useState<string>('');
  const [clientId, setClientId] = useState<string>('');
  const [authBaseUrl, setAuthBaseUrl] = useState<string>('');
  const [backendUrl, setBackendUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const setConfig = (params: ConfigContextParams) => {
    setBaseUrl(params.baseUrl);
    setClientId(params.clientId);
    setAuthBaseUrl(params.authBaseUrl);
    setBackendUrl(params.backendUrl);
    setIsLoading(false);
  };

  const fetchConfig = useCallback(async () => {
    const configRepository = new PublicConfigRepository({});
    const config = await configRepository.fetchConfig();
    setConfig(config);
  }, []) 

  return (
    <Provider
      value={{
        baseUrl,
        clientId,
        authBaseUrl,
        backendUrl,
        isLoading,
        fetchConfig,
      }}
    >
      {children}
    </Provider>
  );
};
