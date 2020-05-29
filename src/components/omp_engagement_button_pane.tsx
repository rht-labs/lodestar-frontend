import React, { useContext } from 'react';
import { Button, Tooltip } from '@patternfly/react-core';
import { EngagementContext } from '../context/engagement_context/engagement_context';
import { ConfigContext } from '../context/config_context/config_context';
import { Feature } from './feature';
import { APP_FEATURES } from '../common/app_features';

function _OMPEngagementButtonPane() {
  const engagementContext = useContext(EngagementContext);
  const configContext = useContext(ConfigContext);

  const buttonPane: React.CSSProperties = {
    position: 'absolute',
    right: 10,
    bottom: 10,
    backgroundColor: 'rgba(255,255,255, 0.6)',
    padding: 5,
    borderRadius: 4,
  };

  const buttonDisplay: React.CSSProperties = {
    margin: 5,
  };

  const launchCluster = () => {
    engagementContext.launchEngagement(engagementContext.engagementFormState);
  };

  const saveCluster = () => {
    engagementContext.saveEngagement(engagementContext.engagementFormState);
  };

  const isLaunchDisabled = () => {
    if (configContext.appConfig?.disableLaunch) {
      return true;
    } else if (engagementContext.activeEngagement?.launch !== undefined) {
      return true;
    } else if (!engagementContext.isLaunchable) { 
      return true;
    }else {
      return false;
    }
  };

  const getTooltipText = () => {
    if (configContext.appConfig?.disableLaunch) {
      return 'Launching new Engagement clusters is currently unavailable. Please try again later.';
    } else if (engagementContext.activeEngagement?.launch !== undefined) {
      return 'The cluster for this engagement has been launched.';
    } else {
      return 'Launch the cluster for this engagement.';
    }
  };

  return (
    <Feature name={APP_FEATURES.writer}>
      <div style={buttonPane}>
        <Button onClick={saveCluster} style={buttonDisplay} data-cy="engagement-save">
          {' '}
          Save{' '}
        </Button>
        <Tooltip content={<div>{getTooltipText()}</div>}>
          <span>
            <Button
              isDisabled={isLaunchDisabled()}
              onClick={launchCluster}
              style={buttonDisplay}
              data-cy="launch"
            >
              {' '}
              Launch{' '}
            </Button>
          </span>
        </Tooltip>
      </div>
    </Feature>
  );
}

export const OMPEngagementButtonPane = React.memo(_OMPEngagementButtonPane);
