import React from 'react';
import { Logger } from '../utilities/logger';
import { ErrorFallbackUI } from './error_fallback_ui/error_fallback_ui';

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
  componentDidCatch(error: any, errorInfo: any) {
    Logger.error(this.props.meta, error, errorInfo);
  }
  render() {
    const { fallbackUI: FallbackUI = () => <ErrorFallbackUI /> } = this.props;
    if (this.state.hasError) {
      return <FallbackUI />;
    }
    return this.props.children;
  }
}
