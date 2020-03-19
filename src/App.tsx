import React, { useContext, useEffect } from 'react';
import '@patternfly/react-core/dist/styles/base.css';
import { Page, PageHeader, PageSidebar } from '@patternfly/react-core';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { PrivateRoute } from './components/authentication/private_route';
import { CallbackHandler } from './components/authentication/callback_handler';
import { NavDefaultList } from './components/navigation/nav';
import { EngagementForm } from './routes/engagement_form';

import { SessionContext, SessionProvider } from './context/session_context';
import { ConfigContext, ConfigProvider } from './context/config_context';
import Axios from 'axios';
import { EngagementFormProvider } from './context/engagement_form_context';
import { PopupProvider } from './context/popup_context';

export const App = () => {
  return (
    <Router>
      <ConfigProvider>
        <SessionProvider>
          <Routes />
        </SessionProvider>
      </ConfigProvider>
    </Router>
  );
};

const Routes = () => {
  const configContext = useContext(ConfigContext);
  const sessionContext = useContext(SessionContext);
  useEffect(() => {
    Axios.get(`${process.env.PUBLIC_URL}/config/config.json`).then(
      ({ data }) => {
        configContext.setConfig(data);
      }
    );
  }, [configContext]);
  if (configContext.isLoading) {
    return <div />;
  }

  return (
    <PopupProvider>
      <Page
        header={<PageHeader />}
        sidebar={
          <PageSidebar isNavOpen theme="dark" nav={<NavDefaultList />} />
        }
        style={{ height: '100vh' }}
      >
        <Switch>
          <Route
            exact
            path="/"
            component={(props: any) => {
              return (
                <EngagementFormProvider
                  sessionContext={sessionContext}
                  configContext={configContext}
                >
                  <EngagementForm {...props} />
                </EngagementFormProvider>
              );
            }}
          />
          <PrivateRoute path="/private" component={EngagementForm} />
          <Route path="/auth_callback" component={CallbackHandler} />
        </Switch>
      </Page>
    </PopupProvider>
  );
};
