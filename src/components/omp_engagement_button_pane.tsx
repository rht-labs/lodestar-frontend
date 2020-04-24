import React, { useContext, useEffect, useState } from 'react';
import { Button, Tooltip } from '@patternfly/react-core';
import { EngagementFormContext } from '../context/engagement_form_context';
import { EngagementContext } from '../context/engagement_context';
import { ConfigContext } from '../context/config_context';
// import { slugProperties } from '../utilities/slug_properties';

function _OMPEngagementButtonPane() {
  console.log("hitting this");
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
    engagementContext.launchEngagement(engagementFormContext.state);
  }

  const saveCluster = () => {
    engagementContext.saveEngagement(engagementFormContext.state);
  }

  const [isLaunchDisabled, setIsLaunchDisabled] = useState<boolean>(
    false
  );

  const [launchTooltip, setLaunchTooltip] = useState<string>(
    "Launch the cluster for this engagement."
  )
  
  useEffect(() => {
    if(configContext.appConfig?.disableLaunch){
      setIsLaunchDisabled(true);
      setLaunchTooltip("Launching new Engagement clusters is currently unavailable. Please try again later.");
    } else if( engagementContext.activeEngagement?.launch !== undefined ){
      setIsLaunchDisabled(true);
      setLaunchTooltip("The cluster for this engagement has been launched.")
    } else {
      setIsLaunchDisabled(false);
      setLaunchTooltip("Launch the cluster for this engagement.")
    }
  }, [configContext.appConfig, engagementContext.activeEngagement]);

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