import React from 'react';
import { Logger } from '../utilities/logger';

export interface ErrorBoundaryProps {
  children: React.ReactChild;
  meta?: any;
}

/**
 * @see https://reactjs.org/docs/error-boundaries.html
 */

export class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
  componentDidCatch(error: any, errorInfo: any) {
    Logger.log(this.props.meta, error, errorInfo);
  }
  render() {
    return this.props.children;
  }
}
