import React, { createContext, useState } from "react";

export interface IConfig {
  baseUrl: string;
  clientId: string;
  authBaseUrl: string;
  backendUrl: string;
}

export interface IConfigContext extends IConfig {
  isLoading: boolean;
  setConfig: (params: IConfig) => void;
}

// Provider and Consumer are connected through their "parent" Context
const ConfigContext = createContext<IConfigContext>({
  baseUrl: "",
  clientId: "",
  authBaseUrl: "",
  backendUrl: "",
  isLoading: true,
  setConfig: () => null
});
const { Provider } = ConfigContext;

// Provider will be exported wrapped in ConfigProvider component.
function ConfigProvider({ children }: { children: React.ReactChild }) {
  const [baseUrl, setBaseUrl] = useState<string>("");
  const [clientId, setClientId] = useState<string>("");
  const [authBaseUrl, setAuthBaseUrl] = useState<string>("");
  const [backendUrl, setBackendUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const setConfig = (params: IConfig) => {
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
        setConfig
      }}
    >
      {children}
    </Provider>
  );
}

export { ConfigContext, ConfigProvider };

export default ConfigContext;
