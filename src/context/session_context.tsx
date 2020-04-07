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

export interface SessionContext {
  isLoggedIn: () => Promise<boolean>;
  profile?: UserProfile;
  tokens?: UserToken;
  roles: any[];
  isLoading: boolean;
  axios?: AxiosInstance;
  handleLoginCallback: (authorizationCode: string) => void;
}

export const SessionContext = createContext<SessionContext>({
  isLoggedIn: async () => false,
  profile: new UserProfile(),
  tokens: new UserToken(),
  roles: [],
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
  const [profile, setProfile] = useState(new UserProfile());
  const [tokens, setTokens] = useState(new UserToken());
  const [roles, setRoles] = useState<string[]>([] as string[]);
  const [loading, setLoading] = useState<boolean>(false);
  const [requestHandler, setRequestHandler] = useState<Request | undefined>();

  const handleLoginCallback = useCallback(
    async (authorizationCode: string) => {
      setLoading(true);

      const userToken = await authenticationRepository.fetchToken(
        authorizationCode,
        'authorization_code'
      );
      const profile = await authenticationRepository.getUserProfile();
      setSessionData(profile, userToken, profile.groups as string[]);
      setLoading(false);
    },
    [authenticationRepository]
  );

  useEffect(() => {
    if (!configContext.isLoading) {
      const authenticationRepository: AuthenticationRepository =
        authRepo ?? new ApiV1AuthenticationRepository(configContext);
      const tokens = authenticationRepository.getToken();
      if (tokens) {
        authenticationRepository.getUserProfile().then(profile => {
          setSessionData(profile, tokens, profile.groups as string[]);
        });
        setRequestHandler(new Request({ authenticationRepository }));
      }
    }
  }, [configContext, authRepo]);
  const setSessionData = (
    newProfile: UserProfile,
    newTokens: UserToken,
    newRoles: any[]
  ) => {
    setProfile(newProfile);
    setTokens(newTokens);
    setRoles(newRoles);
  };
  return (
    <Provider
      value={{
        isLoggedIn: authenticationRepository.isLoggedIn,
        profile,
        tokens,
        roles,
        axios: requestHandler?.client,
        handleLoginCallback,
        isLoading: loading,
      }}
    >
      {children}
    </Provider>
  );
};
