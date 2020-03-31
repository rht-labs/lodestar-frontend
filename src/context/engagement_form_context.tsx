import React, { createContext, useEffect, useState, useCallback } from 'react';
import yaml from 'yaml';
import { SessionContext } from './session_context';
import { ConfigContext } from './config_context';
import Axios, { AxiosError } from 'axios';

export interface EngagementFormContext {
  getSessionData: () => Promise<any>;
  sessionData: any;
  error: AxiosError | null;
}

export const EngagementFormContext = createContext<EngagementFormContext>({
  getSessionData: async () => null,
  sessionData: null,
  error: null,
});
const { Provider } = EngagementFormContext;

export const EngagementFormProvider = ({
  children,
  configContext,
}: {
  children: React.ReactChild;
  sessionContext: SessionContext;
  configContext: ConfigContext;
}) => {
  // TODO: When authentication bug when requesting config is fixed in the backend,
  // update with sessionContext's axios instance
  const [sessionData, setSessionData] = useState<any>(null);
  const [requestError, setRequestError] = useState<AxiosError | null>(null);
  const getSessionData = useCallback(() => {
    return Axios.get(`${configContext.backendUrl}/config`);
  }, [configContext.backendUrl]);

  useEffect(() => {
    getSessionData()
      .then(({ data }) => {
        console.log(data);
        setSessionData(yaml.parse(data.fileContent));
      })
      .catch(e => setRequestError(e));
  }, [getSessionData]);
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
