import React from 'react';
import { Logger } from '../utilities/logger';
import {
  EmptyState,
  PageSection,
  EmptyStateIcon,
  Title,
  EmptyStateBody,
} from '@patternfly/react-core';
import { OutlinedSadTearIcon } from '@patternfly/react-icons';

export interface ErrorBoundaryProps {
  children: React.ReactChild;
  fallbackUI: React.FunctionComponent;
  meta?: any;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * @see https://reactjs.org/docs/error-boundaries.html
 */

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    Logger.error(error);
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {}
  render() {
    const { fallbackUI: FallbackUI = () => <ErrorFallbackUI /> } = this.props;
    if (this.state.hasError) {
      return <FallbackUI />;
    }
    return this.props.children;
  }
}

const ErrorFallbackUI = () => {
  return (
    <PageSection style={{ height: '100%' }}>
      <>
        <EmptyState>
          <EmptyStateIcon icon={OutlinedSadTearIcon} />
          <Title size="lg" headingLevel="h4">
            Something went wrong
          </Title>
          <EmptyStateBody>
            It seems we've bumped into an error. This is likely Oystein's fault.
            Send him an email:{' '}
            <a href="mailto:obedin@redhat.com">obedin@redhat.com</a>
          </EmptyStateBody>
        </EmptyState>
      </>
    </PageSection>
  );
};
