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
import { KeycloakInstance } from 'keycloak-js';
import { AppFeature } from '../../common/app_features';

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
  keycloak,
  publicUrl,
  roleMapping = {},
}: {
  children: React.ReactChild;
  keycloak: KeycloakInstance;
  publicUrl: string;
  roleMapping: { [key: string]: AppFeature[] };
}) => {
  const [authError, setAuthError] = useState<any>(null);
  const sessionData = useMemo(() => {
    const getUserRoles = (groups: string[] = []): AppFeature[] => {
      const roleMappings = roleMapping;
      const roles = Array.from(
        new Set(
          groups.reduce<AppFeature[]>(
            (prev: AppFeature[], curr: string) => [
              ...prev,
              ...(roleMappings[curr] ?? []),
            ],
            []
          )
        )
      );
      return roles;
    };
    return {
      profile: {
        email: (keycloak?.tokenParsed as any)?.email,
        firstName: (keycloak?.tokenParsed as any)?.given_name,
        lastName: (keycloak?.tokenParsed as any)?.family_name,
        groups: (keycloak?.tokenParsed as any)?.groups,
        username: (keycloak?.tokenParsed as any)?.preferred_username,
      } as UserProfile,
      roles: getUserRoles((keycloak?.tokenParsed as any)?.groups),
      tokens: {
        accessToken: keycloak?.token,
        refreshToken: keycloak?.refreshToken,
      },
    };
  }, [
    keycloak?.token,
    keycloak?.refreshToken,
    keycloak?.tokenParsed,
    roleMapping,
  ]);

  const logout = async () => {
    keycloak.logout({ redirectUri: publicUrl });
    return;
  };

  const checkIsAuthenticated = useCallback(async () => {
    return keycloak?.authenticated || false;
  }, [keycloak?.authenticated]);

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
