import React, { Component, createContext } from "react";

// Provider and Consumer are connected through their "parent" Context
const SessionContext = createContext("session");
const { Provider, Consumer } = SessionContext;

// Provider will be exported wrapped in ConfigProvider component.
class SessionProvider extends Component {
  state = {
    userLoggedIn: false,
    profile: {
      username: "",
      firstName: "",
      lastName: "",
      email: ""
    },
    tokens: {
      accessToken: "",
      refreshToken: "",
      accessTokenExpiry: new Date(),
      refreshTokenExpiry: new Date()
    },
    roles: [],
    performLogout: () => {
      this.setState({ userLoggedIn: false });
    },
    performLogin: (profile, tokens, roles) => {
      this.setState({ userLoggedIn: true, profile, tokens, roles });
    }
  };

  render() {
    return (
      <Provider
        value={{
          userLoggedIn: this.state.userLoggedIn,
          profile: this.state.profile,
          performLogout: this.state.performLogout,
          performLogin: this.state.performLogin
        }}
      >
        {this.props.children}
      </Provider>
    );
  }
}

export { SessionContext, SessionProvider };

export default SessionContext;
