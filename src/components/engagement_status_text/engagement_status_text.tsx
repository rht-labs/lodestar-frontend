import React from 'react';
import { EngagementStatus } from '../../schemas/engagement';

export const EngagementStatusText = ({
  status,
}: {
  status: EngagementStatus;
}) => {
  const getEngagementStatusText = () => {
    if (status === EngagementStatus.active) {
      return 'Active';
    } else if (status === EngagementStatus.upcoming) {
      return 'Upcoming';
    } else if (status === EngagementStatus.past) {
      return 'Past';
    }
    return '';
  };
  const getStatusColor = (status?: EngagementStatus) => {
    switch (status) {
      case EngagementStatus.upcoming: {
        return '#EC7A08';
      }
      case EngagementStatus.active: {
        return 'green';
      }
      default: {
        return '#B8BBBE';
      }
    }
  };
  return (
    <b style={{ color: getStatusColor(status) }} data-cy={status}>
      {getEngagementStatusText().toUpperCase()}
    </b>
  );
};
