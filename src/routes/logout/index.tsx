import React from 'react';
import { SessionContext } from '../../context/auth_context/auth_context';

class LogoutPage extends React.Component<{ session: SessionContext }> {
  componentDidMount(): void {
    const { session } = this.props;
    session.logout().then(() =>
      // not my favorite solution... but SSO seems to need a second after /logout is hit before it actually "takes"...
      setTimeout(() => {
        // retrigger forward to SSO
        window.location.href = '/';
      }, 500)
    );
  }

  render() {
    return <></>;
  }
}

export default React.forwardRef((props, ref) => (
  <SessionContext.Consumer>
    {session => <LogoutPage {...props} session={session} />}
  </SessionContext.Consumer>
));
