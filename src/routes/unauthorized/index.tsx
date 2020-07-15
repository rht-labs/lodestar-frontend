import React from 'react';
import {
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Title,
} from '@patternfly/react-core';
import { LockIcon } from '@patternfly/react-icons';
import { useConfig } from '../../context/config_context/config_hook';

export function UnauthorizedPage() {
  const contentPane: React.CSSProperties = {
    backgroundColor: '#EDEDED',
    height: '100vh',
    padding: 15,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const { appConfig } = useConfig();

  return (
    <>
      <div style={contentPane}>
        <EmptyState>
          <EmptyStateIcon icon={LockIcon} />
          <Title size="lg" headingLevel="h4">
            Access denied
          </Title>
          <EmptyStateBody>
            Sorry, your account has not yet been granted access to this system.
            Please send an email to&nbsp;
            <a href={`mailto:${appConfig?.supportEmailAddress}`}>
              {appConfig?.supportEmailAddress}
            </a>
          </EmptyStateBody>
        </EmptyState>
      </div>
    </>
  );
}
