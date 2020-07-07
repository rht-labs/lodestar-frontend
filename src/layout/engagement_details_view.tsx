import React from 'react';
import { Engagement } from '../schemas/engagement_schema';
import {
  PageSection,
  TextContent,
  Text,
  PageSectionVariants,
} from '@patternfly/react-core';
import { LaunchAlertBanner } from '../components/launch_alert_banner/launch_alert_banner';
import { useEngagements } from '../context/engagement_context/engagement_hook';
import { useValidation } from '../context/validation_context/validation_hook';

export function EngagementDetailsViewTemplate({
  engagement,
  children,
}: {
  engagement: Engagement;
  children: any;
}) {
  const {
    launchEngagement,
    missingRequiredFields,
    isLaunchable,
    requiredFields,
  } = useEngagements();
  const { getValidationResult } = useValidation();
  return (
    <>
      <PageSection
        variant={PageSectionVariants.light}
        style={{ paddingBottom: 0 }}
      >
        <TextContent>
          <Text component="h1">{engagement?.project_name}</Text>
          <Text component="h3">{engagement?.customer_name}</Text>
        </TextContent>
      </PageSection>
      <div style={{ marginTop: '1rem' }}>
        <LaunchAlertBanner
          requiredFields={requiredFields}
          isLaunchable={isLaunchable}
          missingRequiredFields={missingRequiredFields}
          onLaunch={launchEngagement}
          engagement={engagement}
          getValidationResult={getValidationResult}
        />
      </div>
      <PageSection variant={PageSectionVariants.default}>
        {children}
      </PageSection>
    </>
  );
}
