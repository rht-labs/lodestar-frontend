import React from 'react';
import { Engagement } from '../../schemas/engagement_schema';
import { Alert, AlertVariant, Button } from '@patternfly/react-core';
import { format } from 'date-fns';
import { RequiredFieldsWarning } from '../required_fields_warning/required_fields_warning';
import { HealthStatus } from '../../schemas/cluster_status';
interface LaunchAlertBannerProps {
  engagement: Engagement;
  onLaunch: (engagement: Engagement) => void;
  isLaunchable: boolean;
  requiredFields: string[];
  missingRequiredFields: string[];
}
export function LaunchAlertBanner({
  engagement,
  onLaunch,
  isLaunchable,
  requiredFields,
  missingRequiredFields,
}: LaunchAlertBannerProps) {
  const overallStatus = engagement?.status?.overall_status;
  return (
    <Alert
      isInline
      title={
        engagement?.launch ? 'Engagement Launched' : 'Engagement Not Launched'
      }
      variant={statusAlert(overallStatus)}
      actionLinks={
        !engagement?.launch ? (
          <div>
            <Button
              isDisabled={!isLaunchable}
              onClick={() => onLaunch(engagement)}
              data-cy={'launch_button'}
            >
              Launch
            </Button>
            <span style={{ margin: '0 0.5rem' }}>
              <RequiredFieldsWarning
                missingRequiredFields={missingRequiredFields}
                requiredFields={requiredFields}
              />
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

const statusAlert = (overallStatus?: HealthStatus) => {
  switch (overallStatus) {
    case HealthStatus.green: {
      return AlertVariant.success;
    }
    case HealthStatus.yellow: {
      return AlertVariant.warning;
    }
    case HealthStatus.red: {
      return AlertVariant.danger;
    }
    default: {
      return AlertVariant.info;
    }
  }
};
