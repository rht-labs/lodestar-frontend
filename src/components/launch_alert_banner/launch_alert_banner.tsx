import React from 'react';
import { Engagement } from '../../schemas/engagement';
import { Alert, AlertVariant, Button, Title } from '@patternfly/react-core';
import { format } from 'date-fns';
import { RequiredFieldsWarning } from '../required_fields_warning/required_fields_warning';
import { HealthStatus } from '../../schemas/cluster_status';
import { useLocation } from 'react-router';
import { HashLink } from 'react-router-hash-link';
interface LaunchAlertBannerProps {
  engagement: Engagement;
  onLaunch: (engagement: Engagement) => void;
  isLaunchable: boolean;
  requiredFields: string[];
  missingRequiredFields: string[];
}
const ENGAGEMENT_CARDS = {
  engagement_summary_card: 'Engagement Summary',
  poc_card: 'Point of Contact',
  oc_summary_card: 'Hosting Environment',
  user_card: 'Users',
};
const ENGAGEMENT_FIELD_MAP = {
  description: 'engagement_summary_card',
  location: 'engagement_summary_card',
  start_date: 'engagement_summary_card',
  end_date: 'engagement_summary_card',
  launch: 'engagement_summary_card',
  archive_date: 'engagement_summary_card',
  engagement_users: 'user_card',
  engagement_lead_name: 'poc_card',
  engagement_lead_email: 'poc_card',
  technical_lead_name: 'poc_card',
  technical_lead_email: 'poc_card',
  customer_contact_name: 'poc_card',
  customer_contact_email: 'poc_card',
  ocp_cloud_provider_name: 'oc_summary_card',
  ocp_cloud_provider_region: 'oc_summary_card',
  ocp_version: 'oc_summary_card',
  ocp_sub_domain: 'oc_summary_card',
  ocp_persistent_storage_size: { hash: 'oc_summary_card' },
  ocp_cluster_size: 'oc_summary_card',
  suggested_subdomain: 'oc_summary_card',
};
export function LaunchAlertBanner({
  engagement,
  onLaunch,
  isLaunchable,
  requiredFields,
  missingRequiredFields,
}: LaunchAlertBannerProps) {
  const overallStatus = engagement?.status?.overall_status;
  const path = useLocation().pathname;
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
            <div style={{ margin: '0.5rem 0' }}>
              <span>
                Required fields are missing in the following sections:
              </span>
              <ul>
                {Array.from(
                  new Set(
                    missingRequiredFields.map(
                      field => ENGAGEMENT_FIELD_MAP[field]
                    )
                  )
                ).map(section => (
                  <li>
                    <HashLink smooth to={`${path}#${section}`}>
                      {ENGAGEMENT_CARDS[section]}
                    </HashLink>
                  </li>
                ))}
              </ul>
            </div>
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
