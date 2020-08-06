import React, { createContext, useContext, useState, useCallback } from 'react';
import { AuthService } from '../../services/auth_service/authentication_service';

import { UserProfile } from '../../schemas/user_profile';
import { UserToken, LocalStoragePersistence } from '../../schemas/user_token';
import Axios, { AxiosInstance } from 'axios';
import { Logger } from '../../utilities/logger';

export interface SessionData {
  profile?: UserProfile;
  tokens?: UserToken;
  roles?: any[];
}

export interface AuthContext {
  sessionData?: SessionData;
  axios?: AxiosInstance;
  checkAuthStatus: () => Promise<boolean>;
  authState: AuthState;
  handleLoginCallback: (authorizationCode: string) => Promise<void>;
  logout: () => Promise<void>;
}

UserToken.setPersistenceStrategy(new LocalStoragePersistence());

export enum AuthState {
  initial,
  authenticated,
  unauthorized,
  unauthenticated,
}

export const AuthContext = createContext<AuthContext>({
  sessionData: undefined,
  axios: Axios.create(),
  authState: AuthState.initial,
  handleLoginCallback: async () => { },
  logout: async () => { },
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
  const [authStatus, setAuthStatus] = useState<AuthState>(AuthState.initial);

  const handleLoginCallback = useCallback(
    async (authorizationCode: string) => {
      setAuthStatus(AuthState.initial);
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
          setAuthStatus(AuthState.authenticated)
        }
      } catch (e) {
        Logger.instance.error(e);
        setAuthStatus(AuthState.unauthenticated);
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
          setAuthStatus(AuthState.authenticated);
          return true;
        } else {
          setAuthStatus(AuthState.unauthorized);
          return false;
        }
      } else {
        setAuthStatus(AuthState.unauthenticated);
        return false;
      }
    } else {
      setAuthStatus(AuthState.unauthenticated);
    }
  }, [setAuthStatus, setSessionData, authService, sessionData]);

  return (
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
  );
};

export const useSession = () => useContext(AuthContext);
