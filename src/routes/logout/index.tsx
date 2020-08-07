import React from 'react';
import { AuthContext } from '../../context/auth_context/auth_context';

class LogoutPage extends React.Component<{ session: AuthContext }> {
  componentDidMount(): void {
    const { session } = this.props;
    session.logout().then(() =>
      setTimeout(() => {
        window.location.href = '/';
      }, 500)
    );
  }

  render() {
    return <></>;
  }
}

export default React.forwardRef((props, ref) => (
  <AuthContext.Consumer>
    {session => <LogoutPage {...props} session={session} />}
  </AuthContext.Consumer>
));
