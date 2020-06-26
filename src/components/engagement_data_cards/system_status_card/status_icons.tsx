import React from 'react';
import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
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
      return <ExclamationTriangleIcon color="#EC7A08" />
    case HealthStatus.yellow:
      return <CheckCircleIcon color="green" />
    case HealthStatus.red:
      return <ExclamationTriangleIcon color="red" />
    default:
      return <div/>
  }
}
