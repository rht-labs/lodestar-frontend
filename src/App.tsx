import React from 'react';
import '@patternfly/react-core/dist/styles/base.css';
import {
  Page,
  PageHeader,
  Brand,
  Toolbar,
  ToolbarItem,
  ToolbarGroup,
  Nav,
  NavItem,
  NavList,
  NavVariants,
  Avatar,
} from '@patternfly/react-core';

import {
  BrowserRouter as Router,
  Switch,
  Link,
  useLocation,
  Route,
  Redirect,
} from 'react-router-dom';

import {
  CogsIcon,
  ListUlIcon,
  HomeIcon,
  HandPaperIcon,
  BoltIcon } from '@patternfly/react-icons';

import avatarImg from './assets/images/avatar.svg';
import { FeatureRequest } from './components/feature_request';
import { PrivateRoute } from './components/authentication/private_route';
import { CallbackHandler } from './components/authentication/callback_handler';
import { EngagementPane } from './routes/engagement_pane';
import { Admin } from './routes/admin';
import { Dashboard } from './routes/dashboard';
import { EngagementForm } from './routes/engagement_form';
import { SessionProvider } from './context/session_context';
import { ConfigProvider } from './context/config_context';
import { EngagementFormProvider } from './context/engagement_form_context';
import { UserDropdown } from './components/user_dropdown';
import { EngagementProvider } from './context/engagement_context';
// import { EngagementDropdown } from './components/engagement_dropdown';
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
  return <EngagementProvider>{children}</EngagementProvider>;
};

const MainTemplateRoutes = () => {
  return (
    <Switch>
      <PrivateRoute
        exact
        path="/"
        component={() => {
          return (
            <Dashboard />
          );
        }}
      />
      <PrivateRoute
        exact
        path="/engagements"
        component={() => {
          return (
            <EngagementFormProvider>
              <EngagementPane />
            </EngagementFormProvider>
          );
        }}
      />
      <PrivateRoute
        exact
        path="/wizard"
        component={() => {
          return (
            <EngagementFormProvider>
              <EngagementForm />
            </EngagementFormProvider>
          );
        }}
      />
      <PrivateRoute
        exact
        path="/admin"
        component={() => {
          return (
            <Admin />
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
    const iconPad: React.CSSProperties = {
      paddingBottom: 0,
      paddingTop: 0,
    };

    const { pathname } = useLocation();

    return (
      <Page
        header={
          <PageHeader
            logo={
              <div>
                <Toolbar>
                  <Brand
                    alt="Open Innovation Labs"
                    src={`${process.env.PUBLIC_URL}/oil_logo.png`}
                  ></Brand>
                  <div style={{ width: 50 }} />
                  {/* <ToolbarItem>
                    <EngagementDropdown />
                  </ToolbarItem> */}
                </Toolbar>
              </div>
            }
            toolbar={
              <Toolbar>
                <ToolbarGroup>
                  <Nav theme="dark">
                    <NavList variant={NavVariants.horizontal}>
                      <NavItem id="homeLink" itemId={0} isActive={pathname === '/'}>
                        <Link to="/" style={iconPad}>
                          <HomeIcon size="md" title="Home" />
                        </Link>
                      </NavItem>
                      <NavItem id="engagementPaneLink" itemId={1} isActive={pathname === '/engagements'}>
                        <Link style={iconPad} to="/engagements">
                          <ListUlIcon size="md" title="Engagements" />
                        </Link>
                      </NavItem>
                      <NavItem id="engagementWizardLink" itemId={2} isActive={pathname === '/wizard'}>
                        <Link style={iconPad} to="/wizard">
                          <BoltIcon size="md" title="Wizard" />
                        </Link>
                      </NavItem>
                      <NavItem id="adminLink" itemId={3} isActive={pathname === '/admin'}>
                        <Link style={iconPad} to="/admin">
                          <CogsIcon size="md" title="Administration" />
                        </Link>
                      </NavItem>
                    </NavList>
                  </Nav>
                </ToolbarGroup>
                <ToolbarGroup>
                  <ToolbarItem>
                    <a
                      href="https://docs.google.com/forms/d/e/1FAIpQLSfcKY5eKwDYSxIF9oYeDDVyYCqwcq_AD0eqhY4uLtpcCgfWwA/viewform"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <HandPaperIcon size="md" title="Feature Request" />
                    </a>
                  </ToolbarItem> 
                </ToolbarGroup>
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
        style={{ height: '100vh' }}
      >
        {children}
      </Page>
    );
  }
);
