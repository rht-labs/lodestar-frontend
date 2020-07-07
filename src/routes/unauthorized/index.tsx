import React from 'react';
import {EmptyState, EmptyStateBody, EmptyStateIcon, Title} from "@patternfly/react-core";
import {LockIcon} from "@patternfly/react-icons";

export function UnauthorizedPage() {
  const contentPane: React.CSSProperties = {
    backgroundColor: '#EDEDED',
    height: '100vh',
    padding: 15,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <>
      <div style={contentPane}>
        <EmptyState>
          <EmptyStateIcon icon={LockIcon}/>
          <Title size="lg" headingLevel="h4">
            Access denied
          </Title>
          <EmptyStateBody>
            Sorry, your account has not yet been granted access to this system. Please contact the Open Innovation Labs SRE team to resolve
            this.
          </EmptyStateBody>
        </EmptyState>
      </div>
    </>
  );
}
