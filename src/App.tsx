import React, { useContext, useEffect } from 'react';
import '@patternfly/react-core/dist/styles/base.css';
import {
  Page,
  PageHeader,
  PageSidebar,
  Brand,
  Toolbar,
  ToolbarItem,
  ToolbarGroup,
  Avatar,
} from '@patternfly/react-core';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import avatarImg from './assets/images/avatar.svg';
import { FeatureRequest } from './components/feature_request';
import { PrivateRoute } from './components/authentication/private_route';
import { CallbackHandler } from './components/authentication/callback_handler';
import { NavDefaultList } from './components/navigation/nav';
import { EngagementForm } from './routes/engagement_form';
import { SessionContext, SessionProvider } from './context/session_context';
import { ConfigContext, ConfigProvider } from './context/config_context';
import Axios from 'axios';
import { EngagementFormProvider } from './context/engagement_form_context';
import { PopupProvider } from './context/popup_context';
import { UserDropdown } from './components/user_dropdown';
import { EngagementProvider } from './context/engagement_context';
import { FakedEngagementRepository } from './repositories/engagement/faked_engagement_repository';
import { EngagementDropdown } from './components/engagement_dropdown';

export const App = () => {
  return (
    <Router>
      <ConfigProvider>
        <SessionProvider>
          <EngagementProvider
            engagementRepository={new FakedEngagementRepository()}
          >
            <Routes />
          </EngagementProvider>
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
        header={
          <PageHeader
            showNavToggle
            logo={
              <div>
                <Toolbar>
                  <Brand
                    alt="Open Innovation Labs"
                    src={`${process.env.PUBLIC_URL}/oil_logo.png`}
                  ></Brand>
                  <div style={{ width: 50 }} />
                  <ToolbarItem>
                    <EngagementDropdown />
                  </ToolbarItem>
                </Toolbar>
              </div>
            }
            toolbar={
              <Toolbar>
                <ToolbarGroup>
                  <ToolbarItem>
                    <UserDropdown />
                  </ToolbarItem>
                </ToolbarGroup>
              </Toolbar>
            }
            avatar={<Avatar src={avatarImg} alt={'User Avatar'} />}
          ></PageHeader>
        }
        isManagedSidebar={true}
        sidebar={
          <PageSidebar isManagedSidebar theme="dark" nav={<NavDefaultList />} />
        }
        style={{ height: '100vh' }}
      >
        <Switch>
          <PrivateRoute
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
          <Route path="/feature-request" component={FeatureRequest} />
          <PrivateRoute path="/private" component={() => <Redirect to="/" />} />
          <Route path="/auth_callback" component={CallbackHandler} />
        </Switch>
      </Page>
    </PopupProvider>
  );
};
