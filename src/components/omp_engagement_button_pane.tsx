import React, { useContext } from 'react';
import { Button } from '@patternfly/react-core';
import { EngagementFormContext } from '../context/engagement_form_context';
import { EngagementContext } from '../context/engagement_context';
import { slugProperties } from '../utilities/slug_properties';

function _OMPEngagementButtonPane() {
  const engagementContext = useContext(EngagementContext);
  const engagementFormContext = useContext(EngagementFormContext);
  
  const buttonPane: React.CSSProperties = {
    position: 'absolute',
    right: 10,
    bottom: 10,
    backgroundColor: 'rgba(255,255,255, 0.6)',
    padding: 5,
    borderRadius: 4,
  }

  const buttonDisplay: React.CSSProperties = {
    margin: 5,
  }

  const launchCluster = () => {
    engagementContext.createEngagement(
      slugProperties(engagementContext.activeEngagement, [
        'ocp_sub_domain',
        'customer_name',
        'project_name',
      ])
    );
  }

  const saveCluster = () => {
    engagementContext.saveEngagement(engagementFormContext.state);
    // const cn = engagementFormContext.state.customer_name;
    // const pn = engagementFormContext.state.project_name
    // engagementContext.engagements.find( ({ customer_name, project_name }) => customer_name === engagementFormContext.state.customer_name && project_name === engagementFormContext.state.project_name) = undefined;
    // engagementContext.engagements.find(v => v.customer_name === cn && v.project_name === pn) = engagementFormContext.state;
    // engagementContext.engagements[0] = engagementFormContext.state;
  }

  return (
    <div style={ buttonPane } >
      <Button onClick={saveCluster} style={ buttonDisplay } > Save </Button>
      <Button onClick={launchCluster} style={ buttonDisplay } > Launch </Button>
    </div>
  );
}

export const OMPEngagementButtonPane = React.memo(_OMPEngagementButtonPane);