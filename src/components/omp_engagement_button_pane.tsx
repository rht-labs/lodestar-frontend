import React from 'react';
import { Button, Tooltip } from '@patternfly/react-core';
import { Feature } from './feature';
import { APP_FEATURES } from '../common/app_features';
import { useEngagements } from '../context/engagement_context/engagement_hook';
import { useConfig } from '../context/config_context/config_hook';
function _OMPEngagementButtonPane() {
  const engagementContext = useEngagements();
  const configContext = useConfig();

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
    } else {
      return false;
    }
  };

  const getTooltipText = () => {
    if (configContext.appConfig?.disableLaunch) {
      return 'Launching new Engagements is currently unavailable. Please try again later.';
    } else if (engagementContext.activeEngagement?.launch !== undefined) {
      return 'This engagement has been launched';
    } else {
      return 'Launch this engagement.';
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
