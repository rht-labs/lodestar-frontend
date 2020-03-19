import React, { createContext } from 'react';
import { SessionContext } from './session_context';
import { ConfigContext } from './config_context';

export interface EngagementFormContext {
  getSessionData: () => Promise<any>;
}

// Provider and Consumer are connected through their "parent" Context
export const EngagementFormContext = createContext<EngagementFormContext>({
  getSessionData: async () => null,
});
const { Provider } = EngagementFormContext;

// Provider will be exported wrapped in EngagementFormProvider component.
export const EngagementFormProvider = ({
  children,
  sessionContext,
  configContext,
}: {
  children: React.ReactChild;
  sessionContext: SessionContext;
  configContext: ConfigContext;
}) => {
  const getSessionData = () => {
    return sessionContext.axios.get(
      `${configContext.backendUrl}/engagements/config`
    );
  };
  return (
    <Provider
      value={{
        getSessionData,
      }}
    >
      {children}
    </Provider>
  );
};
