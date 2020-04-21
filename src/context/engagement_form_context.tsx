import React, {
  createContext,
  useEffect,
  useState,
  useCallback,
  useContext,
} from 'react';
import yaml from 'yaml';
import { ConfigContext } from './config_context';
import { AxiosError, AxiosInstance } from 'axios';
import { SessionContext } from './session_context';

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
}: {
  children: React.ReactChild;
}) => {
  const [sessionData, setSessionData] = useState<any>(null);
  const [requestError, setRequestError] = useState<AxiosError | null>(null);
  const configContext = useContext(ConfigContext);
  const sessionContext = useContext(SessionContext);
  const getSessionData = useCallback(async () => {
    try {
      const { data } = await sessionContext.axios.get(
        `${configContext.appConfig?.backendUrl}/config`
      );
      setSessionData(yaml.parse(data.content));
    } catch (e) {
      console.error(e);
      setRequestError(e);
    }
  }, [configContext.appConfig, sessionContext.axios]);

  useEffect(() => {
    if (sessionContext.axios) {
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
