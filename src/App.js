import React from 'react';
import '@patternfly/react-core/dist/styles/base.css';
import '@patternfly/react-styles/css/utilities/Spacing/spacing.css';
import {
  Page,
  PageHeader,
  PageSidebar,
  PageSection,
  Wizard
} from '@patternfly/react-core';
import BasicInformation from  './Steps/01_BasicInformation';
import ClusterInformation from './Steps/03_ClusterInformation';
import PointOfContact from './Steps/02_PointOfContact';
import LaunchResidency from './Steps/04_LaunchResidency';
import Logo from './Logo';

const App = () => {
  return (
    <Page
      header={
        <PageHeader/>
      }
      sidebar={
        <PageSidebar
          isNavOpen
          theme="dark"
          nav={
            <Logo />
          }
        />
      }
      style={{height: '100vh'}}
    >
      <PageSection>
        <div className="pf-c-content">
          <h2>
            Residency Data Gathering
          </h2>
        </div>
      </PageSection>
      <PageSection>
        <Wizard
          isCompactNav
          isInPage
          steps={[
            { name: 'Basic Information', component: <BasicInformation/>, hideCancelButton: true },
            { name: 'Point of Contact', component: <PointOfContact/>, hideCancelButton: true },
            { name: 'Openshift Cluster', component: <ClusterInformation/>, hideCancelButton: true, nextButtonText: 'Launch Residency' },
            { name: 'Launch Residency',
              component: <LaunchResidency />,
              isFinishedStep: true
            }
          ]}
        />

      </PageSection>
    </Page>
  );
}

export default App;
