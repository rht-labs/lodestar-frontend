import React, { useReducer, useEffect, useState } from "react";
import "@patternfly/react-core/dist/styles/base.css";
import { Page, PageHeader, PageSidebar } from "@patternfly/react-core";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PrivateRoute from "./Components/Authentication/PrivateRoute";
import CallbackHandler from "./Components/Authentication/CallbackHandler";
import Nav from "./Components/Navigation/Nav";
import formReducer from "./formReducer";
import initialState from "./initialState";
import EngagementForm from "./engagementForm";
import yaml from "yaml";
import axios from "axios";

import { SessionProvider } from './Context/sessionContext';

const App = () => {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const [clusterOptions, setClusterOptions] = useState(null);
  const [hasError, setHasError] = useState(null);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URI}/engagements/config`)
      .then(response => {
        const data = yaml.parse(response.data.fileContent);
        setClusterOptions(data);
        dispatch({
          type: "ocp_cloud_provider_region",
          payload: data.providers[0].regions[0].value
        });
        dispatch({
          type: "ocp_cloud_provider_name",
          payload: data.providers[0].value
        });
        dispatch({
          type: "ocp_cluster_size",
          payload: data.openshift["cluster-size"][0].value
        });
        dispatch({
          type: "ocp_version",
          payload: data.openshift.versions[0].value
        });
      })
      .catch(error => {
        setHasError(error);
      });
  }, []);
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
