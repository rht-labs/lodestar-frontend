import React from 'react';
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
import { SessionProvider } from './context/session_context';
import { ConfigProvider } from './context/config_context';
import { EngagementFormProvider } from './context/engagement_form_context';
import { UserDropdown } from './components/user_dropdown';
import { EngagementProvider } from './context/engagement_context';
import { EngagementDropdown } from './components/engagement_dropdown';
import { ErrorBoundary } from './components/error_boundary';
export const App = () => {
  return (
    <ErrorBoundary>
      <ConfigProvider>
        <SessionProvider>
          <Router>
            <Providers>
              <MainTemplate>
                <MainTemplateRoutes />
              </MainTemplate>
            </Providers>
          </Router>
        </SessionProvider>
      </ConfigProvider>
    </ErrorBoundary>
  );
};

const Providers = ({ children }: { children: React.ReactChild }) => {
  return (
      <EngagementProvider>{children}</EngagementProvider>
  );
};

const MainTemplateRoutes = () => {
  return (
    <Switch>
      <PrivateRoute
        exact
        path="/"
        component={() => {
          return (
            <EngagementFormProvider>
              <EngagementForm />
            </EngagementFormProvider>
          );
        }}
      />
      <Route path="/feature-request" component={FeatureRequest} />
      <PrivateRoute path="/private" component={() => <Redirect to="/" />} />
      <Route path="/auth_callback" component={CallbackHandler} />
    </Switch>
  );
};

const MainTemplate = React.memo(
  ({ children }: { children: React.ReactChild }) => {
    return (
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
        {children}
      </Page>
    );
  }
);
