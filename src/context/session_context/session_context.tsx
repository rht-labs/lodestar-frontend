import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { AuthService } from '../../services/authentication_service/authentication_service';

import { UserProfile } from '../../schemas/user_profile_schema';
import {
  UserToken,
  LocalStoragePersistence,
} from '../../schemas/user_token_schema';
import Axios, { AxiosInstance } from 'axios';
import { useServiceProviders } from '../service_provider_context/service_provider_context';
import { Logger } from '../../utilities/logger';
import { ErrorBoundary } from '../../components/error_boundary';
import { AuthenticationValidator } from '../../utilities/authentication_validator';

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

export interface SessionContext {
  sessionData?: SessionData;
  axios?: AxiosInstance;
  checkAuthStatus: () => Promise<boolean>;
  authState: AuthenticationState;
  handleLoginCallback: (authorizationCode: string) => Promise<void>;
  logout: () => Promise<void>;
}

UserToken.setPersistenceStrategy(new LocalStoragePersistence());

export const SessionContext = createContext<SessionContext>({
  sessionData: undefined,
  axios: Axios.create(),
  authState: 'initial',
  handleLoginCallback: async () => {},
  logout: async () => {},
  checkAuthStatus: async () => null,
});
const { Provider } = SessionContext;

export const SessionProvider = ({
  children,
  authenticationService: authRepo,
}: {
  children: React.ReactChild;
  authenticationService?: AuthService;
}) => {
  const { authenticationService } = useServiceProviders();

  const [sessionData, setSessionData] = useState<SessionData | undefined>(
    undefined
  );
  const [authStatus, setAuthStatus] = useState<AuthenticationState>('initial');

  const handleLoginCallback = useCallback(
    async (authorizationCode: string) => {
      setAuthStatus('initial');
      try {
        const userToken = await authenticationService.fetchToken(
          authorizationCode,
          'authorization_code'
        );
        if (await authenticationService.isLoggedIn()) {
          const profile = await authenticationService.getUserProfile();
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
    [authenticationService]
  );

  const logout = async () => {
    await authenticationService.clearSession();
    return;
  };

  const checkAuthStatus = useCallback(async () => {
    if (!!authenticationService) {
      return authenticationService.isLoggedIn().then(isLoggedIn => {
        const tokens = authenticationService.getToken();
        if (isLoggedIn && tokens) {
          authenticationService.getUserProfile().then(profile => {
            setSessionData({
              profile,
              tokens,
              roles: profile.groups,
            });
            if (profile.groups ? profile.groups.includes('reader') : false) {
              setAuthStatus('authenticated');
              return true;
            } else {
              setAuthStatus('unauthorized');
              return false;
            }
          });
        } else {
          setAuthStatus('unauthenticated');
          return false;
        }
      });
    }
  }, [setAuthStatus, setSessionData, authenticationService]);

  useEffect(() => {
    AuthenticationValidator.validator = checkAuthStatus;
  });

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

export const useSession = () => useContext(SessionContext);
