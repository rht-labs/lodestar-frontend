import React, { useEffect, useReducer, useState, useContext } from 'react';
import { formReducer } from './form_reducer';
import { initialState } from './initial_state';
import {
  Alert,
  PageSection,
  Text,
  TextVariants,
  Wizard,
} from '@patternfly/react-core';
import { BasicInformation } from './steps/01_basic_information';
import { PointOfContact } from './steps/02_point_of_contact';
import { ClusterInformation } from './steps/03_cluster_information';
import { ClusterUsers } from './steps/04_cluster_users';
import { EngagementFormContext } from '../../context/engagement_form_context';
import { LaunchCluster } from './steps/05_launch_cluster';

export function EngagementForm() {
  const [state, dispatch] = useReducer<(state: any, action: any) => any>(
    formReducer,
    initialState
  );
  const [clusterOptions, setClusterOptions] = useState(null);
  const engagementFormContext = useContext(EngagementFormContext);
  useEffect(() => {
    const data = engagementFormContext.sessionData;
    if (!data) {
      return;
    }
    setClusterOptions(data);
    dispatch({
      type: 'ocp_cloud_provider_region',
      payload: data.providers[0].regions[0].value,
    });
    dispatch({
      type: 'ocp_cloud_provider_name',
      payload: data.providers[0].value,
    });
    dispatch({
      type: 'ocp_cluster_size',
      payload: data.openshift['cluster-size'][0].value,
    });
    dispatch({
      type: 'ocp_version',
      payload: data.openshift.versions[0].value,
    });
  }, [engagementFormContext]);
  const engagementFormRequestError = engagementFormContext.error;
  return (
    <>
      <PageSection>
        <div className="pf-c-content">
          <Text component={TextVariants.h1}>Engagement Data Gathering</Text>
        </div>
        {engagementFormRequestError ? (
          <Alert isInline title="We encountered an error." variant="danger">
            {engagementFormRequestError.message}
          </Alert>
        ) : null}
      </PageSection>
      <PageSection>
        <Wizard
          isCompactNav
          isInPage
          steps={[
            {
              name: 'Basic Information',
              component: (
                <BasicInformation values={state} onChange={dispatch} />
              ),
              hideCancelButton: true,
            },
            {
              name: 'Point of Contact',
              component: <PointOfContact values={state} onChange={dispatch} />,
              hideCancelButton: true,
            },
            {
              name: 'OpenShift Cluster',
              component: (
                <ClusterInformation
                  options={clusterOptions}
                  values={state}
                  onChange={dispatch}
                />
              ),
              hideCancelButton: true,
            },
            {
              name: 'Cluster Users',
              component: (
                <ClusterUsers
                  values={state}
                  onChange={dispatch}
                  options={clusterOptions}
                />
              ),
              hideCancelButton: true,
            },
            {
              name: 'Launch Cluster',
              component: (
                <LaunchCluster
                  values={state}
                  onChange={dispatch}
                  options={{}}
                />
              ),
              hideCancelButton: true,
              isFinishedStep: true,
            },
          ]}
        />
      </PageSection>
    </>
  );
}
