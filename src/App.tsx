import React, { useContext, useEffect } from "react";
import "@patternfly/react-core/dist/styles/base.css";
import { Page, PageHeader, PageSidebar } from "@patternfly/react-core";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PrivateRoute from "./components/authentication/private_route";
import CallbackHandler from "./components/authentication/callback_handler";
import Nav from "./components/navigation/nav";
import EngagementForm from "./routes/engagement_form";

import SessionContext, { SessionProvider } from "./context/session_context";
import ConfigContext, { ConfigProvider } from "./context/config_context";
import Axios from "axios";
import { EngagementFormProvider } from "./context/engagement_form_context";

const App = () => {
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
    Axios.get(`${process.env.PUBLIC_URL}/config.json`).then(({ data }) => {
      configContext.setConfig(data);
    });
  }, []);
  if (configContext.isLoading) {
    return <div />;
  }

  return (
    <Page
      header={<PageHeader />}
      sidebar={<PageSidebar isNavOpen theme="dark" nav={<Nav />} />}
      style={{ height: "100vh" }}
    >
      <Switch>
        <EngagementFormProvider
          sessionContext={sessionContext}
          configContext={configContext}
        >
          <Route exact path="/" component={EngagementForm} />
        </EngagementFormProvider>
        <PrivateRoute path="/private" component={EngagementForm} />
        <Route path="/auth_callback" component={CallbackHandler} />
      </Switch>
    </Page>
  );
};

export default App;
