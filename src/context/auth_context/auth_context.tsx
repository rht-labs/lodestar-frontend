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
  authError?: any;
  setAuthError: (error: any) => void;
  sessionData?: SessionData;
  axios?: AxiosInstance;
  checkIsAuthenticated: () => Promise<boolean>;
  handleLoginCallback: (authorizationCode: string) => Promise<void>;
  logout: () => Promise<void>;
}

UserToken.setPersistenceStrategy(new LocalStoragePersistence());

export const AuthContext = createContext<AuthContext>({
  sessionData: undefined,
  authError: null,
  setAuthError: (error: any) => {},
  axios: Axios.create(),
  checkIsAuthenticated: async () => false,
  handleLoginCallback: async () => {},
  logout: async () => {},
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
  const [authError, setAuthError] = useState<any>(null);
  const createSessionData = (profile: UserProfile, tokens: UserToken) => ({
    profile,
    roles: profile.groups,
    tokens,
  });
  const handleLoginCallback = useCallback(
    async (authorizationCode: string) => {
      try {
        const userToken = await authService.fetchToken(
          authorizationCode,
          'authorization_code'
        );
        if (await authService.isLoggedIn()) {
          const profile = await authService.getUserProfile();
          setSessionData(createSessionData(profile, userToken));
          return;
        }
      } catch (e) {
        Logger.instance.error(e);
        throw e;
      }
    },
    [authService]
  );

  const logout = async () => {
    await authService.clearSession();
    return;
  };

  const checkIsAuthenticated = useCallback(async () => {
    if (!authService) {
      return false;
    }
    const isLoggedIn = await authService.isLoggedIn();
    if (!isLoggedIn) {
      return false;
    }
    const tokens = authService.getToken();
    if (!sessionData?.profile || !sessionData?.roles || !sessionData?.tokens) {
      const profile = await authService.getUserProfile();
      setSessionData(createSessionData(profile, tokens));
    }
    if (isLoggedIn && tokens) {
      return true;
    }
    return false;
  }, [authService, sessionData]);

  return (
    <Provider
      value={{
        authError,
        setAuthError,
        checkIsAuthenticated,
        sessionData,
        handleLoginCallback,
        logout: logout,
      }}
    >
      {children}
    </Provider>
  );
};

export const useSession = () => useContext(AuthContext);
