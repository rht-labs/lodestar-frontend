import React, { createContext, useContext, useState, useCallback } from 'react';
import { AuthService } from '../../services/auth_service/authentication_service';

import { UserProfile } from '../../schemas/user_profile_schema';
import {
  UserToken,
  LocalStoragePersistence,
} from '../../schemas/user_token_schema';
import Axios, { AxiosInstance } from 'axios';
import { Logger } from '../../utilities/logger';
import { ErrorBoundary } from '../../components/error_boundary/error_boundary';

export type AuthenticationState =
  | 'initial'
  | 'authenticated'
  | 'unauthenticated'
  | 'unauthorized';

export interface SessionData {
  profile?: UserProfile;
  tokens?: UserToken;
  roles?: any[];
}

export interface AuthContext {
  sessionData?: SessionData;
  axios?: AxiosInstance;
  checkAuthStatus: () => Promise<boolean>;
  authState: AuthenticationState;
  handleLoginCallback: (authorizationCode: string) => Promise<void>;
  logout: () => Promise<void>;
}

UserToken.setPersistenceStrategy(new LocalStoragePersistence());

export const AuthContext = createContext<AuthContext>({
  sessionData: undefined,
  axios: Axios.create(),
  authState: 'initial',
  handleLoginCallback: async () => {},
  logout: async () => {},
  checkAuthStatus: async () => null,
});
const { Provider } = AuthContext;

export const AuthProvider = ({
  children,
  authService,
}: {
  children: React.ReactChild;
  authService: AuthService;
}) => {
  const [sessionData, setSessionData] = useState<SessionData | undefined>(
    undefined
  );
  const [authStatus, setAuthStatus] = useState<AuthenticationState>('initial');

  const handleLoginCallback = useCallback(
    async (authorizationCode: string) => {
      setAuthStatus('initial');
      try {
        const userToken = await authService.fetchToken(
          authorizationCode,
          'authorization_code'
        );
        if (await authService.isLoggedIn()) {
          const profile = await authService.getUserProfile();
          setSessionData({
            profile,
            roles: profile.groups,
            tokens: userToken,
          });
          return;
        }
      } catch (e) {
        Logger.instance.error(e);
        setAuthStatus('unauthenticated');
      }
    },
    [authService]
  );

  const logout = async () => {
    await authService.clearSession();
    return;
  };

  const checkAuthStatus = useCallback(async () => {
    if (!!authService) {
      const isLoggedIn = await authService.isLoggedIn();
      const tokens = authService.getToken();
      if (isLoggedIn && tokens) {
        let profile;
        if (!sessionData?.profile) {
          profile = await authService.getUserProfile();
          setSessionData({
            profile,
            tokens,
            roles: profile.groups,
          });
        } else {
          profile = sessionData?.profile;
        }
        if (profile.groups && profile.groups.includes('reader')) {
          setAuthStatus('authenticated');
          return true;
        } else {
          setAuthStatus('unauthorized');
          return false;
        }
      } else {
        setAuthStatus('unauthenticated');
        return false;
      }
    }
  }, [setAuthStatus, setSessionData, authService, sessionData]);

  return (
    <ErrorBoundary>
      <Provider
        value={{
          checkAuthStatus,
          sessionData,
          handleLoginCallback,
          authState: authStatus,
          logout: logout,
        }}
      >
        {children}
      </Provider>
    </ErrorBoundary>
  );
};

export const useSession = () => useContext(AuthContext);
