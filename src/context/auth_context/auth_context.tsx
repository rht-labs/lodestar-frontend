import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { UserProfile } from '../../schemas/user_profile';
import { UserToken } from '../../schemas/user_token';
import Axios, { AxiosInstance } from 'axios';
import { IAnalyticsContext } from '../analytics_context/analytics_context';
import { KeycloakInstance } from 'keycloak-js';

export interface SessionData {
  profile?: UserProfile;
  tokens?: UserToken;
  roles?: any[];
}

export interface IAuthContext {
  authError?: any;
  setAuthError: (error: any) => void;
  axios?: AxiosInstance;
  checkIsAuthenticated: () => Promise<boolean>;
  userProfile?: UserProfile;
  roles: string[];
  logout: () => Promise<void>;
}

export const AuthContext = createContext<IAuthContext>({
  authError: null,
  roles: [],
  setAuthError: (error: any) => {},
  axios: Axios.create(),
  checkIsAuthenticated: async () => false,
  logout: async () => {},
});
const { Provider } = AuthContext;

export const AuthProvider = ({
  children,
  analyticsContext,
  keycloak,
}: {
  children: React.ReactChild;
  analyticsContext?: IAnalyticsContext;
  keycloak: KeycloakInstance;
}) => {
  const [authError, setAuthError] = useState<any>(null);

  const sessionData = useMemo(() => {
    console.log(keycloak?.tokenParsed);
    return {
      profile: keycloak.profile,
      roles: (keycloak?.tokenParsed as any)?.groups,
      tokens: {
        accessToken: keycloak.token,
        refreshToken: keycloak.refreshToken,
      },
    };
  }, [keycloak]);

  const logout = async () => {
    keycloak.logout();
    return;
  };

  const checkIsAuthenticated = useCallback(async () => {
    return keycloak.authenticated;
  }, [keycloak.authenticated]);

  return (
    <Provider
      value={{
        authError,
        userProfile: sessionData?.profile,
        setAuthError,
        checkIsAuthenticated,
        logout: logout,
        roles: sessionData?.roles ?? [],
      }}
    >
      {children}
    </Provider>
  );
};

export const useSession = () => useContext(AuthContext);
