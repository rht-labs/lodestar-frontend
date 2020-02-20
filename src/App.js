import React from "react";
import "@patternfly/react-core/dist/styles/base.css";
import { Page, PageHeader, PageSidebar } from "@patternfly/react-core";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PrivateRoute from "./Components/Authentication/PrivateRoute";
import CallbackHandler from "./Components/Authentication/CallbackHandler";
import Nav from "./Components/Navigation/Nav";
import EngagementForm from "./engagementForm";

import { SessionProvider } from './Context/sessionContext';

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
