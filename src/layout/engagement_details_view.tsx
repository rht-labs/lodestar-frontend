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
import { useConfig } from '../context/config_context/config_hook';
import { useEngagement } from '../context/engagement_context/engagement_hook';
import { Region } from '../components/region/region';
import { EngagementEditableCategories } from '../components/engagement_categories/engagement_editable_categories';
import { getLabelForValue } from '../common/label_value_tools';

export function EngagementDetailsViewTemplate({
  engagement,
  children,
}: {
  engagement: Engagement;
  onSave: (engagement: Engagement) => void;
  children: any;
}) {
  const {
    launchEngagement,
    missingRequiredFields,
    isLaunchable: isEngagementLaunchable,
    requiredFields,
  } = useEngagement();

  const { appConfig } = useConfig();

  const { engagementFormConfig } = useEngagement();

  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <Flex>
          <FlexItem grow={{ default: 'grow' }}>
            <TextContent>
              <Text component="h1" style={{ marginTop: '1rem' }}>
                {engagement?.project_name}
              </Text>
              <Text component="h3" style={{ marginTop: '1rem' }}>
                {engagement?.customer_name}
              </Text>
            </TextContent>
            <div style={{ marginTop: '1.5rem' }}>
              <EngagementEditableCategories />
            </div>
          </FlexItem>
          <Flex
            alignSelf={{ default: 'alignSelfStretch' }}
            justifyContent={{ default: 'justifyContentCenter' }}
            alignItems={{ default: 'alignItemsCenter' }}
            direction={{ default: 'column' }}
          >
            <FlexItem>
              <TextContent>
                <Text component="h3" style={{ marginTop: '0.5rem' }}>
                  {getLabelForValue(
                    engagementFormConfig?.basic_information?.engagement_types
                      ?.options ?? [],
                    engagement?.engagement_type
                  )}
                </Text>
              </TextContent>
            </FlexItem>
            <FlexItem>
              <Region region={engagement?.engagement_region} />
            </FlexItem>
          </Flex>
        </Flex>
      </PageSection>
      <LaunchAlertBanner
        requiredFields={requiredFields}
        isLaunchable={isEngagementLaunchable && !appConfig.disableLaunch}
        missingRequiredFields={missingRequiredFields}
        onLaunch={launchEngagement}
        engagement={engagement}
      />
      <PageSection variant={PageSectionVariants.default}>
        {children}
      </PageSection>
    </>
  );
}
