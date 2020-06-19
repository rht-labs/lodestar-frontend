import React from 'react';
import { Engagement } from '../../schemas/engagement_schema';
import { Alert, AlertVariant, Button } from '@patternfly/react-core';

interface LaunchMessageProps {
  engagement: Engagement;
  onLaunch: (engagement: Engagement) => void;
}
export function LaunchMessage({ engagement, onLaunch }: LaunchMessageProps) {
  if (!engagement?.launch) {
    return (
      <Alert
        isInline
        title="Engagement not launched"
        variant={AlertVariant.warning}
        actionLinks={
          <>
            <Button onClick={() => onLaunch(engagement)}>Launch</Button>
          </>
        }
      >
        This engagement has not been launched
      </Alert>
    );
  }
  return <div />;
}
