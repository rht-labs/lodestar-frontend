import React from 'react';
import { Engagement } from '../schemas/engagement';
import {
  PageSection,
  TextContent,
  Text,
  PageSectionVariants,
  Flex,
  FlexItem,
} from '@patternfly/react-core';
import { LaunchAlertBanner } from '../components/launch_alert_banner/launch_alert_banner';
import { useEngagements } from '../context/engagement_context/engagement_hook';
import { Region } from '../components/region/region';

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
      <PageSection
        variant={PageSectionVariants.light}
        style={{ paddingBottom: 0 }}
      >
        <Flex>
          <FlexItem grow={{ default: 'grow' }}>
            <TextContent>
              <Text component="h1">{engagement?.project_name}</Text>
              <Text component="h3">{engagement?.customer_name}</Text>
            </TextContent>
          </FlexItem>
          <Flex
            alignSelf={{ default: 'alignSelfStretch' }}
            justifyContent={{ default: 'justifyContentCenter' }}
          >
            <FlexItem>
              <Region region={engagement?.engagement_region} />
            </FlexItem>
          </Flex>
        </Flex>
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
