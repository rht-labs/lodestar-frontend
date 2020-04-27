import React, { useContext } from 'react';
import { Button, Tooltip } from '@patternfly/react-core';
import { EngagementFormContext } from '../context/engagement_form_context';
import { EngagementContext } from '../context/engagement_context';
import { ConfigContext } from '../context/config_context';
import { Feature } from './feature';

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
  };

  const buttonDisplay: React.CSSProperties = {
    margin: 5,
  };

  const launchCluster = () => {
    engagementContext.launchEngagement(engagementFormContext.state);
  };

  const saveCluster = () => {
    engagementContext.saveEngagement(engagementFormContext.state);
  };

  const isLaunchDisabled = () => {
    if (configContext.appConfig?.disableLaunch) {
      return true;
    } else if (engagementContext.activeEngagement?.launch !== undefined) {
      return true;
    } else {
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
    <Feature name="writer">
      <div style={buttonPane}>
        <Button onClick={saveCluster} style={buttonDisplay}>
          {' '}
          Save{' '}
        </Button>
        <Tooltip content={<div>{getTooltipText()}</div>}>
          <span>
            <Button
              isDisabled={isLaunchDisabled()}
              onClick={launchCluster}
              style={buttonDisplay}
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
