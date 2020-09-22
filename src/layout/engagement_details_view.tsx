import React, {useEffect} from 'react';
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
import { EngagementEditableCategories } from "../components/engagement_categories/engagement_editable_categories";
import {useVersion} from "../context/version_context/version_context";
import {useCategories} from "../context/categories_context/categories_context";

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
    updateEngagementFormField,
    saveEngagement,
  } = useEngagements();

  const categoriesContext = useCategories();
  useEffect(() => {
    if (!categoriesContext.categories) {
      categoriesContext.fetchCategories();
    }
  }, [categoriesContext]);

  return (
    <>
      <PageSection
        variant={PageSectionVariants.light}
      >
        <Flex>
          <FlexItem grow={{ default: 'grow' }}>
            <TextContent>
              <Text component="h1" style={{marginTop: '1rem'}}>{engagement?.project_name}</Text>
              <Text component="h3" style={{marginTop: '1rem'}}>{engagement?.customer_name}</Text>
            </TextContent>
            <div style={{marginTop:'1.5rem'}}>
              <EngagementEditableCategories categories={categoriesContext}
                                            onChange={updateEngagementFormField}
                                            onSave={saveEngagement}/>
            </div>
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
