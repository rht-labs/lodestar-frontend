import React, { Component, createContext } from "react";
import { AuthenticationRepository } from "../repositories/authentication/authentication_repository";
import { UserProfile } from "../models/user_profile";
import { UserToken } from "../models/user_token";

// Provider and Consumer are connected through their "parent" Context
const SessionContext = createContext({});
const { Provider } = SessionContext;

// Provider will be exported wrapped in ConfigProvider component.
class SessionProvider extends Component {
  state = {
    userLoggedIn: false,
    profile: new UserProfile(),
    tokens: new UserToken(),
    roles: [],
    performLogout: () => {
      this.setState({ userLoggedIn: false });
    },
    performLogin: (profile, tokens, roles) => {
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
          axios: AuthenticationRepository.getInstance().axios
        }}
      >
        {this.props.children}
      </Provider>
    );
  }
}

export { SessionContext, SessionProvider };

export default SessionContext;
