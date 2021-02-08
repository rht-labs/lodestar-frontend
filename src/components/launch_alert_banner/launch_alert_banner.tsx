import React from 'react';
import { Engagement } from '../../schemas/engagement';
import { Alert, AlertVariant, Button, Flex, FlexItem } from '@patternfly/react-core';
import { format } from 'date-fns';
import { HealthStatus } from '../../schemas/cluster_status';
import { useLocation } from 'react-router';
import { HashLink } from 'react-router-hash-link';
import { Feature } from '../feature/feature';
import { useModalVisibility } from "../../context/edit_modal_visibility_context/edit_modal_visibility_hook";
import { DeleteModal } from "./delete_modal";

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
  hosting_environments: 'oc_summary_card',
  ocp_cloud_provider_name: 'oc_summary_card',
  ocp_cloud_provider_region: 'oc_summary_card',
  ocp_version: 'oc_summary_card',
  ocp_sub_domain: 'oc_summary_card',
  ocp_persistent_storage_size: { hash: 'oc_summary_card' },
  ocp_cluster_size: 'oc_summary_card',
  suggested_subdomain: 'oc_summary_card',
};

const DELETE_ENGAGEMENT_MODAL_KEY = 'delete_engagement';

export function LaunchAlertBanner({
  engagement,
  onLaunch,
  isLaunchable,
  missingRequiredFields,
}: LaunchAlertBannerProps) {
  const overallStatus = engagement?.status?.overall_status;
  const path = useLocation().pathname;
  const { requestOpen, activeModalKey } = useModalVisibility();

  return (
    <>
      <DeleteModal
        isOpen={activeModalKey?.includes(DELETE_ENGAGEMENT_MODAL_KEY)}
        engagement={engagement}
      />
      <Alert
        isInline
        title={
          engagement?.launch ? 'Engagement Launched' : 'Engagement Not Launched'
        }
        variant={statusAlert(overallStatus)}
        actionLinks={
          !engagement?.launch ? (
            <div>
              <Feature name={'writer'}>
                <Flex>
                  <FlexItem span={1}>
                    <Button
                      isDisabled={!isLaunchable}
                      onClick={() => onLaunch(engagement)}
                      data-cy={'launch_button'}
                    >
                      Launch
                    </Button>
                  </FlexItem>
                  <FlexItem span={1}>
                    <Button
                      variant="danger"
                      onClick={() => requestOpen(DELETE_ENGAGEMENT_MODAL_KEY)}
                    >
                      Delete
                    </Button>
                  </FlexItem>
                </Flex>
              </Feature>
            </div>
          ) : (
            undefined
          )
        }
      >
        <div>
          <LaunchMessage engagement={engagement} />
          {!engagement?.launch ? (
            <div>
              <div>
                <span style={{ fontStyle: 'italic' }}>
                  {missingRequiredFields?.length !== 0
                    ? 'Required fields are missing in the following sections:'
                    : null}
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
          )}
        </div>
      </Alert>
    </>
  );
}

interface LaunchMessageProps {
  engagement: Engagement;
}

export function LaunchMessage({ engagement }: LaunchMessageProps) {
  let launchMessage = '';
  if (!engagement?.launch) {
    launchMessage = '';
  } else {
    launchMessage = `This engagement was launched on ${format(
      engagement?.launch?.launched_date_time,
      'MMM d, yyyy'
    )} by ${engagement?.launch?.launched_by}`;
  }
  return (
    <span style={{ marginBottom: !!engagement?.launch ? '0.5rem' : 0 }}>
      {launchMessage}
    </span>
  );
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
