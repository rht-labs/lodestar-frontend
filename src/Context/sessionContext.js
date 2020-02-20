import React, { Component, createContext } from "react";
import axios from "axios";

// Provider and Consumer are connected through their "parent" Context
const SessionContext = createContext("session");
const { Provider } = SessionContext;

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
    },
  };

  axios() {
    const instance = axios.create();
    console.log("creating axios instance")
    instance.interceptors.request.use(function(config) {
      const token = this.getState().tokens.accessToken;
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`Setting axios token to ${token}`);
      return config;
    });
    return instance;
  }

  render() {
    return (
      <Provider
        value={{
          userLoggedIn: this.state.userLoggedIn,
          profile: this.state.profile,
          performLogout: this.state.performLogout,
          performLogin: this.state.performLogin,
          axios: this.axios()
        }}
      >
        {this.props.children}
      </Provider>
    );
  }
}

export { SessionContext, SessionProvider };

export default SessionContext;
