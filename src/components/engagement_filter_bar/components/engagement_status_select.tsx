import React, { useState } from 'react';
import {
  Select,
  SelectOption,
} from '@patternfly/react-core';
import { EngagementStatus } from '../../../schemas/engagement_schema';
import { EngagementFilterProps } from '../engagement_filter_bar';

export function EngagementStatusSelect({
  onChange,
  filter,
}: EngagementFilterProps) {
  const [isStatusSelectOpen, setIsStatusSelectOpen] = useState<boolean>(false);

  const getStatusDisplayValue = (status: EngagementStatus) => {
    if (status === EngagementStatus.active) {
      return 'Active';
    } else if (status === EngagementStatus.past) {
      return 'Past';
    } else if (status === EngagementStatus.upcoming) {
      return 'Upcoming';
    }
  };
  return (
    <Select
      placeholderText="Engagement Status"
      isOpen={isStatusSelectOpen}
      onToggle={() => setIsStatusSelectOpen(!isStatusSelectOpen)}
      selections={filter?.allowedStatuses}
      onSelect={(_, status: EngagementStatus) =>
        onChange({
          ...filter,
          allowedStatuses: status ? [status] : undefined,
        })
      }
    >
      {[<SelectOption value={undefined}>Any</SelectOption>].concat(
        Object.keys(EngagementStatus).map(statusKey => (
          <SelectOption value={EngagementStatus[statusKey]}>
            {getStatusDisplayValue(EngagementStatus[statusKey])}
          </SelectOption>
        ))
      )}
    </Select>
  );
}
