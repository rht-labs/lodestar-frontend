import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { Apiv1AuthService } from '../services/authentication_service/implementations/apiv1_auth_service';
import { AuthService } from '../services/authentication_service/authentication_service';

import { UserProfile } from '../schemas/user_profile_schema';
import { UserToken } from '../schemas/user_token_schema';
import { ConfigContext } from './config_context';
import Axios, { AxiosInstance } from 'axios';
import { Request } from '../utilities/request';

export type AuthenticationState =
  | 'initial'
  | 'authenticated'
  | 'unauthenticated';

export interface SessionData {
  profile?: UserProfile;
  tokens?: UserToken;
  roles?: any[];
}

export interface SessionContext {
  sessionData?: SessionData;
  axios?: AxiosInstance;
  authState: AuthenticationState;
  handleLoginCallback: (authorizationCode: string) => Promise<void>;
  logout: () => {};
}

export const SessionContext = createContext<SessionContext>({
  sessionData: undefined,
  axios: Axios.create(),
  authState: 'initial',
  handleLoginCallback: async () => {},
  logout: async () => {},
});
const { Provider } = SessionContext;

export const SessionProvider = ({
  children,
  authenticationRepository: authRepo,
}: {
  children: React.ReactChild;
  authenticationRepository?: AuthService;
}) => {
  const configContext = useContext(ConfigContext);
  const authenticationRepository: AuthService =
    authRepo ?? new Apiv1AuthService(configContext);

  const [sessionData, setSessionData] = useState<SessionData | undefined>(
    undefined
  );
  const [authStatus, setAuthStatus] = useState<AuthenticationState>('initial');
  const requestHandler = new Request({authenticationRepository})

  const handleLoginCallback = useCallback(
    async (authorizationCode: string) => {
      setAuthStatus('initial');
      try {
        const userToken = await authenticationRepository.fetchToken(
          authorizationCode,
          'authorization_code'
        );
        if (await authenticationRepository.isLoggedIn()) {
          const profile = await authenticationRepository.getUserProfile();
          setSessionData({
            profile,
            roles: profile.groups,
            tokens: userToken,
          });
          return;
        }
      } catch (e) {
        setAuthStatus('unauthenticated');
      }
    },
    [authenticationRepository]
  );

  const logout = async () => {
    await authenticationRepository.clearSession()
    return;
  }

  useEffect(() => {
    if (!!configContext.appConfig) {
      const authenticationRepository: AuthService =
        authRepo ?? new Apiv1AuthService(configContext);
      authenticationRepository.isLoggedIn().then(isLoggedIn => {
        const tokens = authenticationRepository.getToken();
        if (isLoggedIn && tokens) {
          setAuthStatus('authenticated');
          authenticationRepository.getUserProfile().then(profile => {
            setSessionData({
              profile,
              tokens,
              roles: profile.groups,
            });
          });
        } else {
          setAuthStatus('unauthenticated');
        }
      });
    }
  }, [configContext, authRepo]);

  return (
    <Provider
      value={{
        sessionData,
        axios: requestHandler?.client,
        handleLoginCallback,
        authState: authStatus,
        logout: logout,
      }}
    >
      {children}
    </Provider>
  );
};
