import React from "react";
import "@patternfly/react-core/dist/styles/base.css";
import { Page, PageHeader, PageSidebar } from "@patternfly/react-core";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PrivateRoute from "./components/authentication/private_route";
import CallbackHandler from "./components/authentication/callback_handler";
import Nav from "./components/navigation/nav";
import EngagementForm from "./routes/engagement_form";

import { SessionProvider } from './context/session_context';

const App = () => {
  return (
    <Router>
      <SessionProvider>
        <Page
          header={<PageHeader />}
          sidebar={<PageSidebar isNavOpen theme="dark" nav={<Nav />} />}
          style={{ height: "100vh" }}
        >
          <Switch>
            <Route exact path="/" component={EngagementForm} />
            <PrivateRoute path="/private" component={EngagementForm} />
            <Route path="/auth_callback" component={CallbackHandler} />
          </Switch>
        </Page>
      </SessionProvider>
    </Router>
  );
};

export default App;
