import React, { useEffect, useReducer, useState } from 'react'
import formReducer from './formReducer'
import initialState from './initialState'
import yaml from 'yaml'
import { Alert, PageSection, Text, TextVariants, Wizard } from '@patternfly/react-core'
import BasicInformation from './Steps/01_BasicInformation'
import PointOfContact from './Steps/02_PointOfContact'
import ClusterInformation from './Steps/03_ClusterInformation'
import LaunchCluster from './Steps/04_ClusterUsers'
import { AuthenticationRepository } from './repositories/authentication/authentication_repository'
import { AppSettings } from './settings/config'

export default function EngagementForm() {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const [clusterOptions, setClusterOptions] = useState(null);
  const [hasError, setHasError] = useState(null);
  useEffect(() => {
    AuthenticationRepository.getInstance().axios
      .get(`${AppSettings.backendUrl}/engagements/config`)
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
    <>
      <PageSection>
        <div className="pf-c-content">
          <Text component={TextVariants.h1}>Engagement Data Gathering</Text>
        </div>
        {hasError ? (
          <Alert isInline title="We encountered an error." variant="danger">
            {hasError.statusText}
          </Alert>
        ) : null}
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
    </>
  );
};