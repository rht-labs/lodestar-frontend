import React from 'react';
import { TitledDataPoint } from '../titled_data_point/titled_data_point';
import { ButtonVariant, Button } from '@patternfly/react-core';
import { Engagement } from '../../schemas/engagement_schema';
import { useEngagements } from '../../context/engagement_context/engagement_hook';
import { Feature } from '../feature';
import { APP_FEATURES } from '../../common/app_features';

export function LaunchAction(props: { engagement: Engagement }) {
  const { launchEngagement } = useEngagements();
  if (!props.engagement) {
    return <div />;
  } else if (!props.engagement?.launch) {
    return (
      <Feature name={APP_FEATURES.writer}>
        <TitledDataPoint title="Launch Cluster">
          <Button
            variant={ButtonVariant.primary}
            onClick={() => launchEngagement(props.engagement)}
          >
            Launch
          </Button>
        </TitledDataPoint>
      </Feature>
    );
  } else {
    return (
      <TitledDataPoint title="Launched On">
        {(props.engagement?.launch as any)?.launched_date_time}
      </TitledDataPoint>
    );
  }
}
