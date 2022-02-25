import React from 'react';
import { AuthContext } from '../../context/auth_context/auth_context';
import { ConfigContext } from '../../context/config_context/config_context';
import { AnalyticsContext } from '../../context/analytics_context/analytics_context';
import { AnalyticsCategory } from '../../schemas/analytics';

class LogoutPage extends React.Component<{
  session: AuthContext;
  config: ConfigContext;
}> {
  componentDidMount(): void {
    const { session } = this.props;
    session
      .logout();
    this.context?.logEvent?.({
      category: AnalyticsCategory.profile,
      action: 'Log Out',
    });
  }

  render() {
    return <></>;
  }
}

LogoutPage.contextType = AnalyticsContext;

export default React.forwardRef((props, _) => (
  <ConfigContext.Consumer>
    {config => (
      <AuthContext.Consumer>
        {session => <LogoutPage {...props} session={session} config={config} />}
      </AuthContext.Consumer>
    )}
  </ConfigContext.Consumer>
));
