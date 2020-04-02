import React, { createContext, useContext, useState, useEffect } from 'react';
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
  axios: AxiosInstance;
  performLogin: (profile: UserProfile, tokens: UserToken, roles: any[]) => void;
}

export const SessionContext = createContext<SessionContext>({
  isLoggedIn: async () => false,
  profile: new UserProfile(),
  tokens: new UserToken(),
  roles: [],
  axios: Axios.create(),
  performLogin: () => null,
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
  useEffect(() => {
    if (!configContext.isLoading) {
      const authenticationRepository: AuthenticationRepository =
        authRepo ?? new ApiV1AuthenticationRepository(configContext);
      const tokens = authenticationRepository.getToken();
      if (tokens) {
        authenticationRepository.getUserProfile().then(profile => {
          performLogin(profile, tokens, profile.groups as string[]);
        });
      }
    }
  }, [configContext, authRepo]);
  const performLogin = (
    newProfile: UserProfile,
    newTokens: UserToken,
    newRoles: any[]
  ) => {
    setProfile(newProfile);
    setTokens(newTokens);
    setRoles(newRoles);
  };
  const request = new Request({ authenticationRepository });
  return (
    <Provider
      value={{
        isLoggedIn: authenticationRepository.isLoggedIn,
        profile,
        tokens,
        roles,
        axios: request.client,
        performLogin,
      }}
    >
      {children}
    </Provider>
  );
};
