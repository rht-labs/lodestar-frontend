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
    </Router>
  );
};

export default App;

// export default function BasicExample() {
//   return (
//     <Router>
//       <div>
//         <ul>
//           <li>
//             <Link to="/">Home</Link>
//           </li>
//           <li>
//             <Link to="/about">About</Link>
//           </li>
//           <li>
//             <Link to="/dashboard">Dashboard</Link>
//           </li>
//         </ul>
//
//         <hr />
//
//         {/*
//           A <Switch> looks through all its children <Route>
//           elements and renders the first one whose path
//           matches the current URL. Use a <Switch> any time
//           you have multiple routes, but you want only one
//           of them to render at a time
//         */}
//         <Switch>
//           <Route exact path="/">
//             <App />
//           </Route>
//           <Route path="/about">
//             {/*<About />*/}
//           </Route>
//           <Route path="/dashboard">
//             {/*<Dashboard />*/}
//           </Route>
//         </Switch>
//       </div>
//     </Router>
//   );
// }
