import React, { createContext, useState } from 'react';

export interface ConfigContextParams {
  baseUrl: string;
  clientId: string;
  authBaseUrl: string;
  backendUrl: string;
}

export interface ConfigContext extends ConfigContextParams {
  isLoading: boolean;
  setConfig: (params: ConfigContextParams) => void;
}

export const ConfigContext = createContext<ConfigContext>({
  baseUrl: '',
  clientId: '',
  authBaseUrl: '',
  backendUrl: '',
  isLoading: true,
  setConfig: () => null,
});
const { Provider } = ConfigContext;

function ConfigProvider({ children }: { children: React.ReactChild }) {
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

  return (
    <Provider
      value={{
        baseUrl,
        clientId,
        authBaseUrl,
        backendUrl,
        isLoading,
        setConfig,
      }}
    >
      {children}
    </Provider>
  );
}

export { ConfigContext, ConfigProvider };
