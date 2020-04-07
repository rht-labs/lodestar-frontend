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
      const profile = await authenticationRepository.getUserProfile();
      setSessionData({
        profile,
        roles: profile.groups,
        tokens: userToken,
      });
    },
    [authenticationRepository]
  );

  useEffect(() => {
    if (!!configContext.appConfig) {
      console.log('firing session context effect');
      const authenticationRepository: AuthenticationRepository =
        authRepo ?? new ApiV1AuthenticationRepository(configContext);

      const tokens = authenticationRepository.getToken();

      if (tokens) {
        authenticationRepository.getUserProfile().then(profile => {
          setSessionData({
            profile,
            tokens,
            roles: profile.groups,
          });
        });
        setRequestHandler(new Request({ authenticationRepository }));
      }
    }
  }, [configContext, authRepo]);

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
      {sessionData ? children : null}{' '}
      {/** TODO: Add a loading spinner or something fancier than "null" */}
    </Provider>
  );
};
