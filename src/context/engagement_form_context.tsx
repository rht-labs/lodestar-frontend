import React, { createContext } from "react";
import { ISessionContext } from "./session_context";
import { IConfigContext } from "./config_context";

export interface IEngagementFormContext {
  getSessionData: () => Promise<any>;
}

// Provider and Consumer are connected through their "parent" Context
const EngagementFormContext = createContext<IEngagementFormContext>({
  getSessionData: async () => null
});
const { Provider } = EngagementFormContext;

// Provider will be exported wrapped in EngagementFormProvider component.
function EngagementFormProvider({
  children,
  sessionContext,
  configContext
}: {
  children: React.ReactChild;
  sessionContext: ISessionContext;
  configContext: IConfigContext;
}) {
  const getSessionData = () => {
    return sessionContext.axios.get(
      `${configContext.backendUrl}/engagements/config`
    );
  };
  return (
    <Provider
      value={{
        getSessionData
      }}
    >
      {children}
    </Provider>
  );
}

export { EngagementFormContext, EngagementFormProvider };

export default EngagementFormContext;
