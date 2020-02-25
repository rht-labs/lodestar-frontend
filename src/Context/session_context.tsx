import React, { Component, createContext } from "react";
import { AuthenticationRepository } from "../repositories/authentication/authentication_repository";
import { UserProfile } from "../models/user_profile";
import { UserToken } from "../models/user_token";
import { AxiosInstance } from "axios";

export interface ISessionContext {
  userLoggedIn: boolean;
  profile?: UserProfile;
  axios: AxiosInstance;
  tokens?: UserToken;
  roles: any[];
  performLogout: () => void;
  performLogin: (profile: UserProfile, tokens: UserToken, roles: any[]) => void;
}

// Provider and Consumer are connected through their "parent" Context
const SessionContext = createContext<ISessionContext>({
  userLoggedIn: false,
  profile: new UserProfile(),
  tokens: new UserToken(),
  roles: [],
  axios: AuthenticationRepository.getInstance().axios,
  performLogout: () => null,
  performLogin: (profile: UserProfile, tokens: UserToken, roles: any[]) => null,
});
const { Provider } = SessionContext;



// Provider will be exported wrapped in ConfigProvider component.
class SessionProvider extends Component {
  state: ISessionContext = {
    userLoggedIn: false,
    profile: new UserProfile(),
    tokens: new UserToken(),
    roles: [],
    axios: AuthenticationRepository.getInstance().axios,
    performLogout: () => {
      this.setState({ userLoggedIn: false });
    },
    performLogin: (profile: UserProfile, tokens: UserToken, roles: any[]) => {
      this.setState({ userLoggedIn: true, profile, tokens, roles });
    },
  };
  render() {
    return (
      <Provider
        value={{
          userLoggedIn: this.state.userLoggedIn,
          profile: this.state.profile,
          performLogout: this.state.performLogout,
          performLogin: this.state.performLogin,
          roles: this.state.roles,
          axios: AuthenticationRepository.getInstance().axios
        }
        }
      >
        {this.props.children}
      </Provider>
    );
  }
}

export { SessionContext, SessionProvider };

export default SessionContext;
