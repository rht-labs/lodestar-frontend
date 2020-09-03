import React from 'react';
import { Engagement } from '../schemas/engagement';
import {
  PageSection,
  TextContent,
  Text,
  PageSectionVariants,
} from '@patternfly/react-core';
import { LaunchAlertBanner } from '../components/launch_alert_banner/launch_alert_banner';
import { useEngagements } from '../context/engagement_context/engagement_hook';
import { EngagementCategories } from "../components/engagement_categories/engagement_categories";

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

  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1" style={{marginTop: '1rem'}}> {engagement?.project_name} </Text>
          <Text component="h3" style={{marginTop: '1rem'}}> {engagement?.customer_name} </Text>
        </TextContent>
        <div style={{marginTop: '1rem'}}>
          <EngagementCategories engagement={engagement} />
        </div>
      </PageSection>
      <div style={{ marginTop: '1rem' }}>
        <LaunchAlertBanner
          requiredFields={requiredFields}
          isLaunchable={isLaunchable}
          missingRequiredFields={missingRequiredFields}
          onLaunch={launchEngagement}
          engagement={engagement}
        />
      </div>
      <PageSection variant={PageSectionVariants.default}>
        {children}
      </PageSection>
    </>
  );
}
