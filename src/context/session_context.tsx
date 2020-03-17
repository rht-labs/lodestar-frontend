import React, { createContext, useContext, useState } from "react";
import { AuthenticationRepository } from "../repositories/authentication/authentication_repository";
import { UserProfile } from "../models/user_profile";
import { UserToken } from "../models/user_token";
import ConfigContext from "./config_context";
import Axios, { AxiosInstance } from "axios";

export interface ISessionContext {
  isLoggedIn: () => Promise<boolean>;
  profile?: UserProfile;
  tokens?: UserToken;
  roles: any[];
  axios: AxiosInstance;
  performLogin: (profile: UserProfile, tokens: UserToken, roles: any[]) => void;
}

// Provider and Consumer are connected through their "parent" Context
const SessionContext = createContext<ISessionContext>({
  isLoggedIn: async () => false,
  profile: new UserProfile(),
  tokens: new UserToken(),
  roles: [],
  axios: Axios.create(),
  performLogin: (profile: UserProfile, tokens: UserToken, roles: any[]) => null
});
const { Provider } = SessionContext;

function SessionProvider({ children }: { children: React.ReactChild }) {
  const configContext = useContext(ConfigContext);
  const authenticationRepository: AuthenticationRepository = new AuthenticationRepository(
    configContext
  );
  const [profile, setProfile] = useState(new UserProfile());
  const [tokens, setTokens] = useState(new UserToken());
  const [roles, setRoles] = useState<string[]>([] as string[]);
  const performLogin = (
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
        axios: authenticationRepository.axios,
        performLogin
      }}
    >
      {children}
    </Provider>
  );
}

export { SessionContext, SessionProvider };

export default SessionContext;
