import React, { useState } from 'react';
import {
  TextInput,
  Grid,
  GridItem,
  Select,
  SelectOption,
} from '@patternfly/react-core';
import { EngagementStatus } from '../../schemas/engagement_schema';
import { EngagementListFilter } from '../../schemas/engagement_filter';

export interface EngagementFilterProps {
  onChange: (filter: EngagementListFilter) => void;
  filter: EngagementListFilter;
}

export function EngagementFilter({ onChange, filter }: EngagementFilterProps) {
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
    <Grid hasGutter>
      <GridItem span={5}>
        <TextInput
          onChange={searchTerm => onChange({ ...filter, searchTerm })}
          placeholder="Search for an engagement"
        ></TextInput>
      </GridItem>
      <GridItem span={3}>
        <Select
          placeholderText="Engagement Status"
          isOpen={isStatusSelectOpen}
          onToggle={() => setIsStatusSelectOpen(!isStatusSelectOpen)}
          selections={filter?.allowedStatuses}
          onSelect={(_, status: EngagementStatus) =>
            onChange({ ...filter, allowedStatuses: [status] })
          }
        >
          {Object.keys(EngagementStatus).map(statusKey => (
            <SelectOption value={EngagementStatus[statusKey]}>
              {getStatusDisplayValue(EngagementStatus[statusKey])}
            </SelectOption>
          ))}
        </Select>
      </GridItem>
    </Grid>
  );
}
