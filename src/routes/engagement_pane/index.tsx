import React, { useEffect, useReducer, useState, useContext } from 'react';
import { formReducer } from './form_reducer';
import { initialState } from './initial_state';
import {
  Alert,
  Tabs,
  Tab,
} from '@patternfly/react-core';

import { BasicInformation } from './tabs/01_basic_information';
import { PointOfContact } from './tabs/02_point_of_contact';
import { ClusterInformation } from './tabs/03_cluster_information';
import { ClusterUsers } from './tabs/04_cluster_users';
import { EngagementFormContext } from '../../context/engagement_form_context';
import { Loading } from './Loading';
// import { LaunchCluster } from './tabs/05_launch_cluster';


export function EngagementPane() {
  const [state, dispatch] = useReducer<(state: any, action: any) => any>(
    formReducer,
    initialState
  );
  const [activeTabKey , setActiveTabKey] = useState<number>(0);
  const [clusterOptions, setClusterOptions] = useState(null);
  const engagementFormContext = useContext(EngagementFormContext);
  const contentPane: React.CSSProperties = {
    backgroundColor: '#EDEDED',
    height: '100vh'
  };

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

  const handleTabClick = function (this: any, event:any, tabIndex:any) {
    setActiveTabKey(tabIndex);
  };

  const engagementFormRequestError = engagementFormContext.error;
  return (
    <>
      <div style={contentPane}>
        <Tabs isFilled activeKey={activeTabKey} onSelect={handleTabClick}>
          <Tab eventKey={0} title="Basic Information">
            <BasicInformation values={state} onChange={dispatch} />
          </Tab>
          <Tab eventKey={1} title="Point of Contact">
            <PointOfContact values={state} onChange={dispatch} />
          </Tab>
          <Tab eventKey={2} title="OpenShift Cluster">
            {clusterOptions === null ? <Loading />  : <ClusterInformation options={clusterOptions} values={state} onChange={dispatch} />}
            
          </Tab>
          <Tab eventKey={3} title="Cluster Users">
            <ClusterUsers values={state} onChange={dispatch} />
          </Tab>
        </Tabs>
      </div>
      {engagementFormRequestError ? (
          <Alert isInline title="We encountered an error." variant="danger">
            {engagementFormRequestError.message}
          </Alert>
        ) : null}
    </>
  );
}



// export function EngagementPane() {
//   const [state, dispatch] = useReducer<(state: any, action: any) => any>(
//     formReducer,
//     initialState
//   );
//   const [clusterOptions, setClusterOptions] = useState(null);

//   const [activeTabKey , setActiveTabKey] = useState<number>(0);

//   const contentPane: React.CSSProperties = {
//     backgroundColor: '#EDEDED',
//     height: '100vh'
//   };

//   const engagementFormContext = useContext(EngagementFormContext);
//   useEffect(() => {
//     const data = engagementFormContext.sessionData;
//     console.log(data);
//     if (!data) {
//       return;
//     }
//     setClusterOptions(data);
//     dispatch({
//       type: 'ocp_cloud_provider_region',
//       payload: data.providers[0].regions[0].value,
//     });
//     dispatch({
//       type: 'ocp_cloud_provider_name',
//       payload: data.providers[0].value,
//     });
//     dispatch({
//       type: 'ocp_cluster_size',
//       payload: data.openshift['cluster-size'][0].value,
//     });
//     dispatch({
//       type: 'ocp_version',
//       payload: data.openshift.versions[0].value,
//     });
//   }, [engagementFormContext]);

//   const handleTabClick = function (this: any, event:any, tabIndex:any) {
//     setActiveTabKey(tabIndex);
//   };
//   const engagementFormRequestError = engagementFormContext.error;

//   return (
//     <>
//       <div style={contentPane}>
//         <Tabs isFilled activeKey={activeTabKey} onSelect={handleTabClick}>
//           <Tab eventKey={0} title="Basic Information">
//             <BasicInformation values={state} onChange={dispatch} />
//           </Tab>
//           <Tab eventKey={1} title="Point of Contact">
//             <PointOfContact values={state} onChange={dispatch} />
//           </Tab>
//           <Tab eventKey={2} title="OpenShift Cluster">
//             <ClusterInformation
//               options={clusterOptions}
//               values={state}
//               onChange={dispatch}
//             />
//           </Tab>
//           <Tab eventKey={3} title="Cluster Users">
//             <ClusterUsers values={state} onChange={dispatch} />
//           </Tab>
//         </Tabs>
//       </div>
//       {engagementFormRequestError ? (
//           <Alert isInline title="We encountered an error." variant="danger">
//             {engagementFormRequestError.message}
//           </Alert>
//         ) : null}
//     </>
//   );
// }
