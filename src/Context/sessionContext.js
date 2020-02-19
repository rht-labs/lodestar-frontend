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
    toggleLogin: () => {
      const setTo = !this.state.userLoggedIn;
      this.setState({ userLoggedIn: setTo });
    },
    performLogin: (profile, tokens) => {
      this.setState({ userLoggedIn: true, profile, tokens });
    }
  };

  render() {
    return (
      <Provider
        value={{
          userLoggedIn: this.state.userLoggedIn,
          profile: this.state.profile,
          toggleLogin: this.state.toggleLogin,
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
