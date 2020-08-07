import React from 'react';
import { AuthContext } from '../../context/auth_context/auth_context';
import { ConfigContext } from '../../context/config_context/config_context';

class LogoutPage extends React.Component<{
  session: AuthContext;
  config: ConfigContext;
}> {
  componentDidMount(): void {
    const { session } = this.props;
    session
      .logout()
      .then(
        () =>
          (window.location.href = `${
            this.props.config.appConfig.authBaseUrl
          }/logout?redirect_uri=${encodeURI(
            this.props.config.appConfig.baseUrl
          )}`)
      );
  }

  render() {
    return <></>;
  }
}

export default React.forwardRef((props, ref) => (
  <ConfigContext.Consumer>
    {config => (
      <AuthContext.Consumer>
        {session => <LogoutPage {...props} session={session} config={config} />}
      </AuthContext.Consumer>
    )}
  </ConfigContext.Consumer>
));
