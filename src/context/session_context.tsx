import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { ApiV1AuthenticationRepository } from '../repositories/authentication/implementations/api_v1_repository';
import { AuthenticationRepository } from '../repositories/authentication/authentication_repository';

import { UserProfile } from '../models/user_profile';
import { UserToken } from '../models/user_token';
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
}

export const SessionContext = createContext<SessionContext>({
  sessionData: undefined,
  axios: Axios.create(),
  authState: 'initial',
  handleLoginCallback: async () => {},
});
const { Provider } = SessionContext;

export const SessionProvider = ({
  children,
  authenticationRepository: authRepo,
}: {
  children: React.ReactChild;
  authenticationRepository?: AuthenticationRepository;
}) => {
  const configContext = useContext(ConfigContext);
  const authenticationRepository: AuthenticationRepository =
    authRepo ?? new ApiV1AuthenticationRepository(configContext);

  const [sessionData, setSessionData] = useState<SessionData | undefined>(
    undefined
  );
  const [authStatus, setAuthStatus] = useState<AuthenticationState>('initial');
  const [requestHandler, setRequestHandler] = useState<Request | undefined>();

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

  useEffect(() => {
    if (!!configContext.appConfig) {
      const authenticationRepository: AuthenticationRepository =
        authRepo ?? new ApiV1AuthenticationRepository(configContext);
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
          setRequestHandler(new Request({ authenticationRepository }));
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
      }}
    >
      {children}
    </Provider>
  );
};
