import React, { useContext } from 'react';
import { Button, Tooltip } from '@patternfly/react-core';
import { EngagementFormContext } from '../context/engagement_form_context';
import { EngagementContext } from '../context/engagement_context';
import { ConfigContext } from '../context/config_context';
import { slugProperties } from '../utilities/slug_properties';

function _OMPEngagementButtonPane() {
  const engagementContext = useContext(EngagementContext);
  const engagementFormContext = useContext(EngagementFormContext);
  const configContext = useContext(ConfigContext);

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
  }

  //TODO: Set this to config value.
  const isLaunchDisabled = configContext.appConfig?.disableLaunch;
  const launchTooltip: string = isLaunchDisabled ? 'Launching new Engagements is currently unavailable. Please try again later.': 'Launch cluster for this engagement.'

  return (  
    <div style={ buttonPane } >
      <Button onClick={saveCluster} style={ buttonDisplay } > Save </Button>
      <Tooltip
        content={
          <div>{launchTooltip}</div>
        }
      >
        <span>
        <Button isDisabled={isLaunchDisabled} onClick={launchCluster} style={ buttonDisplay } > Launch </Button>
        </span>
      </Tooltip>
    </div>
  );
}

export const OMPEngagementButtonPane = React.memo(_OMPEngagementButtonPane);