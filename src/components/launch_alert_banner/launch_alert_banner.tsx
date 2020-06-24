import React from 'react';
import { Engagement } from '../../schemas/engagement_schema';
import { Alert, AlertVariant, Button } from '@patternfly/react-core';
import { format } from 'date-fns';
interface LaunchAlertBannerProps {
  engagement: Engagement;
  onLaunch: (engagement: Engagement) => void;
}
export function LaunchAlertBanner({
  engagement,
  onLaunch,
}: LaunchAlertBannerProps) {
  return (
    <Alert
      isInline
      title={
        engagement?.launch ? 'Engagement Launched' : 'Engagement Not Launched'
      }
      variant={AlertVariant.info}
      actionLinks={
        !engagement?.launch ? (
          <>
            <Button onClick={() => onLaunch(engagement)}>Launch</Button>
          </>
        ) : (
          undefined
        )
      }
    >
      <LaunchMessage engagement={engagement} />
    </Alert>
  );
}

interface LaunchMessageProps {
  engagement: Engagement;
}
export function LaunchMessage({ engagement }: LaunchMessageProps) {
  let launchMessage = '';
  if (!engagement?.launch) {
    launchMessage = 'This engagement has not been launched';
  } else {
    launchMessage = `This engagement was launched on ${format(engagement?.launch?.launched_date_time, 'MMM d, yyyy')} by ${engagement?.launch?.launched_by}`;
  }
  return <span>{launchMessage}</span>;
}
