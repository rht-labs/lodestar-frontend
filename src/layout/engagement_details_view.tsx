import React from 'react';
import { Engagement } from '../schemas/engagement_schema';
import {
  PageSection,
  TextContent,
  Text,
  PageSectionVariants,
} from '@patternfly/react-core';
import { LaunchMessage } from '../components/launch_alert_banner/launch_alert_banner';
import { useEngagements } from '../context/engagement_context/engagement_hook';

export function EngagementDetailsViewTemplate({
  engagement,
  children,
}: {
  engagement: Engagement;
  children: any;
}) {
  const { launchEngagement } = useEngagements();
  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">{engagement?.project_name}</Text>
          <Text component="h3">{engagement?.customer_name}</Text>
        </TextContent>
        <div style={{ marginTop: '1rem' }}>
          <LaunchMessage onLaunch={launchEngagement} engagement={engagement} />
        </div>
      </PageSection>
      <PageSection variant={PageSectionVariants.light}>{children}</PageSection>
    </>
  );
}
