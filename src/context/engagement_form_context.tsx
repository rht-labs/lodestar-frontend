import React, { createContext, useEffect, useState, useCallback } from 'react';
import yaml from 'yaml';
import { SessionContext } from './session_context';
import { ConfigContext } from './config_context';
import { AxiosError, AxiosInstance } from 'axios';

export interface EngagementFormContext {
  getSessionData: (requestHandler: AxiosInstance) => Promise<any>;
  sessionData: any;
  error: AxiosError | null;
}

export const EngagementFormContext = createContext<EngagementFormContext>({
  getSessionData: async (requestHandler: AxiosInstance) => null,
  sessionData: null,
  error: null,
});
const { Provider } = EngagementFormContext;

export const EngagementFormProvider = ({
  children,
  configContext,
  sessionContext,
}: {
  children: React.ReactChild;
  sessionContext: SessionContext;
  configContext: ConfigContext;
}) => {
  const [sessionData, setSessionData] = useState<any>(null);
  const [requestError, setRequestError] = useState<AxiosError | null>(null);
  const getSessionData = useCallback(
    (requestHandler: AxiosInstance) => {
      return requestHandler.get(`${configContext.backendUrl}/config`);
    },
    [configContext.backendUrl]
  );

  useEffect(() => {
    if (sessionContext.axios) {
      getSessionData(sessionContext.axios)
        .then(({ data }) => {
          console.log(data);
          setSessionData(yaml.parse(data.fileContent));
        })
        .catch(e => setRequestError(e));
    }
  }, [getSessionData, sessionContext.axios]);
  return (
    <Provider
      value={{
        getSessionData,
        sessionData,
        error: requestError,
      }}
    >
      {children}
    </Provider>
  );
};
