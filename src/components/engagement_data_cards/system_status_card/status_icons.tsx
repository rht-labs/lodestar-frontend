import React from 'react';
import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@patternfly/react-icons';
import {
  HealthStatus,
  getColorForHealthStatus,
} from '../../../schemas/cluster_status';

interface StatusIconProps {
  status: HealthStatus;
}

export function StatusIcon({ status }: StatusIconProps) {
  switch (status) {
    case HealthStatus.green:
      return <CheckCircleIcon color={getColorForHealthStatus(status)} />;
    case HealthStatus.yellow:
      return (
        <ExclamationTriangleIcon color={getColorForHealthStatus(status)} />
      );
    case HealthStatus.red:
      return <ExclamationCircleIcon color={getColorForHealthStatus(status)} />;
    default:
      return <div />;
  }
}
