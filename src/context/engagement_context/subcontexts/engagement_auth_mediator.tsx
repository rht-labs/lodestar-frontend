import React, { useCallback } from 'react';
import { AuthContext } from '../../auth_context/auth_context';
import { AuthenticationError } from '../../../services/auth_service/auth_errors';
export interface EngagementAuthMediatorContext {
  validateAuthStatus: () => Promise<void>;
}
export const EngagementAuthMediatorContext = React.createContext<
  EngagementAuthMediatorContext
>(null);
interface EngagementAuthMediatorContextProviderProps {
  children: any;
  authContext: AuthContext;
}

export const EngagementAuthMediatorContextProvider = ({
  children,
  authContext,
}: EngagementAuthMediatorContextProviderProps) => {
  const validateAuthStatus = useCallback(async () => {
    if (!(await authContext.checkIsAuthenticated())) {
      authContext.setAuthError(new AuthenticationError());
      throw new AuthenticationError();
    }
  }, [authContext]);
  return (
    <EngagementAuthMediatorContext.Provider value={{ validateAuthStatus }}>
      {children}
    </EngagementAuthMediatorContext.Provider>
  );
};
