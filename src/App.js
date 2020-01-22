import React, { useReducer, useEffect, useState } from "react";
import "@patternfly/react-core/dist/styles/base.css";
import {
  Page,
  PageHeader,
  PageSidebar,
  PageSection,
  Text,
  TextVariants,
  Wizard
} from "@patternfly/react-core";
import BasicInformation from "./Steps/01_BasicInformation";
import ClusterInformation from "./Steps/03_ClusterInformation";
import PointOfContact from "./Steps/02_PointOfContact";
import LaunchCluster from "./Steps/04_LaunchCluster";
import Logo from "./Components/Logo/Logo";
import formReducer from "./formReducer";
import initialState from "./initialState";
import yaml from "yaml";
import axios from "axios";

const App = () => {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const [clusterOptions, setClusterOptions] = useState(null);
  useEffect(() => {
    axios
      .get(
        "https://gist.githubusercontent.com/jacobsee/894ef91d9f8722c87a403bcca67ba305/raw/35ce8e2b6b76b1e69a5245acf1943389a2ad6c2c/lucas-test.yml"
      )
      .then(response => {
        const data = yaml.parse(response.data);
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
      });
  }, []);
  return (
    <Page
      header={<PageHeader />}
      sidebar={<PageSidebar isNavOpen theme="dark" nav={<Logo />} />}
      style={{ height: "100vh" }}
    >
      <PageSection>
        <div className="pf-c-content">
          <Text component={TextVariants.h1}>Data Gathering Sheet</Text>
        </div>
      </PageSection>
      <PageSection>
        <Wizard
          isCompactNav
          isInPage
          steps={[
            {
              name: "Basic Information",
              component: (
                <BasicInformation values={state} onChange={dispatch} />
              ),
              hideCancelButton: true
            },
            {
              name: "Point of Contact",
              component: <PointOfContact values={state} onChange={dispatch} />,
              hideCancelButton: true
            },
            {
              name: "OpenShift Cluster",
              component: (
                <ClusterInformation
                  options={clusterOptions}
                  values={state}
                  onChange={dispatch}
                />
              ),
              hideCancelButton: true
            },
            {
              name: "Launch Cluster",
              component: <LaunchCluster values={state} onChange={dispatch} />,
              hideCancelButton: true,
              isFinishedStep: true
            }
          ]}
        />
      </PageSection>
    </Page>
  );
};

export default App;
