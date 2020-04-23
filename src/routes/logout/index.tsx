import React from 'react';
import { SessionContext } from '../../context/session_context';

class LogoutPage extends React.Component<{}, { session: SessionContext }> {

  componentDidMount(): void {
    const { session } = this.props;
    session.logout().then(
      // not my favorite solution... but SSO seems to need a second after /logout is hit before it actually "takes"...
      setTimeout(() => {
        window.location.reload();
      }, 500)
    );
  }

  render() {
    return <></>;
  }
}

export default React.forwardRef(props => (
  <SessionContext.Consumer>
    {session => <LogoutPage {...props} session={session} />}
  </SessionContext.Consumer>
));
