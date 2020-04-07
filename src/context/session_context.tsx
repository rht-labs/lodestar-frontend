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
import { SendToSSO } from '../components/authentication/send_to_sso';

export interface SessionData {
  profile?: UserProfile;
  tokens?: UserToken;
  roles?: any[];
}

export interface SessionContext {
  isLoggedIn: () => Promise<boolean>;
  sessionData?: SessionData;
  isLoading: boolean;
  axios?: AxiosInstance;
  handleLoginCallback: (authorizationCode: string) => void;
}

export const SessionContext = createContext<SessionContext>({
  isLoggedIn: async () => false,
  sessionData: undefined,
  isLoading: false,
  axios: Axios.create(),
  handleLoginCallback: () => null,
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
  const [hasTokens, setHasTokens] = useState<boolean | undefined>();

  const [sessionData, setSessionData] = useState<SessionData | undefined>(
    undefined
  );

  const [requestHandler, setRequestHandler] = useState<Request | undefined>();
  const handleLoginCallback = useCallback(
    async (authorizationCode: string) => {
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

        if (tokens) {
          if (isLoggedIn) {
            authenticationRepository.getUserProfile().then(profile => {
              setSessionData({
                profile,
                tokens,
                roles: profile.groups,
              });
            });
            setRequestHandler(new Request({ authenticationRepository }));
          }
        } else {
          setHasTokens(false);
        }
      });
    }
  }, [configContext, authRepo]);
  if (hasTokens === false) {
    return <SendToSSO />;
  }
  return (
    <Provider
      value={{
        isLoggedIn: authenticationRepository.isLoggedIn,
        sessionData,
        axios: requestHandler?.client,
        handleLoginCallback,
        isLoading: !sessionData,
      }}
    >
      {children}
    </Provider>
  );
};
