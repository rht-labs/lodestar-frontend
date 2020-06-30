import React from 'react';
import {
  ExclamationTriangleIcon,
  CheckCircleIcon, ExclamationCircleIcon,
} from '@patternfly/react-icons';
import {HealthStatus} from "../../../schemas/cluster_status";

interface StatusIconProps {
  status: HealthStatus;
}
export function StatusIcon({
  status
}: StatusIconProps) {

  switch(status){
    case HealthStatus.green:
      return <CheckCircleIcon color="green"/>;
    case HealthStatus.yellow:
      return <ExclamationTriangleIcon color='#EC7A08' />;
    case HealthStatus.red:
      return <ExclamationCircleIcon color="#C9190B" />;
    default:
      return <div/>
  }
}
