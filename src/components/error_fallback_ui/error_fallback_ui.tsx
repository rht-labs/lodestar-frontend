import React from 'react';
import {
  EmptyState,
  PageSection,
  EmptyStateIcon,
  Title,
  EmptyStateBody,
} from '@patternfly/react-core';
import { OutlinedSmileBeamIcon } from '@patternfly/react-icons';
import { useConfig } from '../../context/config_context/config_hook';

export const ErrorFallbackUI = () => {
  const { appConfig } = useConfig();
  return (
    <PageSection style={{ height: '100%' }}>
      <>
        <EmptyState>
          <EmptyStateIcon icon={OutlinedSmileBeamIcon} />
          <Title size="lg" headingLevel="h4">
            You've found an unexpected feature.
          </Title>
          <EmptyStateBody>
            <p>
              First, try refreshing your browser and navigating back to this
              page.
            </p>
            <p>
              If that doesn't work, please send an email to&nbsp;
              <a href={`mailto:${appConfig.supportEmailAddress}`}>
                {appConfig.supportEmailAddress}
              </a>
              .
            </p>
          </EmptyStateBody>
        </EmptyState>
      </>
    </PageSection>
  );
};
