import React from 'react';
import { Engagement } from '../../schemas/engagement_schema';
import { Alert, AlertVariant, Button } from '@patternfly/react-core';
import { format } from 'date-fns';
import { useEngagements } from '../../context/engagement_context/engagement_hook';
import { RequiredFieldsWarning } from '../required_fields_warning/required_fields_warning';
interface LaunchAlertBannerProps {
  engagement: Engagement;
  onLaunch: (engagement: Engagement) => void;
}
export function LaunchAlertBanner({
  engagement,
  onLaunch,
}: LaunchAlertBannerProps) {
  const { isLaunchable, requiredFields } = useEngagements();
  return (
    <Alert
      isInline
      title={
        engagement?.launch ? 'Engagement Launched' : 'Engagement Not Launched'
      }
      variant={AlertVariant.info}
      actionLinks={
        !engagement?.launch ? (
          <div>
            <Button
              isDisabled={!isLaunchable}
              onClick={() => onLaunch(engagement)}
            >
              Launch
            </Button>
            <span style={{ margin: '0 0.5rem' }}>
              <RequiredFieldsWarning requiredFields={requiredFields} />
            </span>
          </div>
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
    launchMessage = `This engagement was launched on ${format(
      engagement?.launch?.launched_date_time,
      'MMM d, yyyy'
    )} by ${engagement?.launch?.launched_by}`;
  }
  return <span>{launchMessage}</span>;
}
