import React from 'react';
import { AuthContext } from '../../auth_context/auth_context';
import { useState, useCallback } from 'react';
import { AuthenticationError } from '../../../services/auth_service/auth_errors';
import { Logger } from '../../../utilities/logger';

export interface EngagementErrorContext {
  checkErrors(e: any): Promise<void>;
  error: any;
}

export const EngagementErrorContext = React.createContext<
  EngagementErrorContext
>(null);
interface EngagementErrorContextProps {
  authContext: AuthContext;
  children: any;
}
export const EngagementErrorContextProvider = ({
  children,
  authContext,
}: EngagementErrorContextProps) => {
  const [error] = useState<string>(null);
  const checkErrors = useCallback(
    async error => {
      Logger.instance.debug('EngagementContext:_handleErrors', error);
      if (error instanceof AuthenticationError) {
        if (!(await authContext.checkIsAuthenticated())) {
          authContext.setAuthError(error);
        }
      } else {
        throw error;
      }
    },
    [authContext]
  );
  return (
    <EngagementErrorContext.Provider value={{ error, checkErrors }}>
      {children}
    </EngagementErrorContext.Provider>
  );
};
