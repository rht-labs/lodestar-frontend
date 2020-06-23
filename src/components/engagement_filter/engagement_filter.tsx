import React, { useState } from 'react';
import {
  TextInput,
  Grid,
  GridItem,
  Select,
  SelectOption,
  SelectOptionObject,
} from '@patternfly/react-core';
import { EngagementStatus } from '../../schemas/engagement_schema';
import {
  EngagementListFilter,
  EngagementSortFields,
  SortOption,
} from '../../schemas/engagement_filter';

export interface EngagementFilterProps {
  onChange: (filter: EngagementListFilter) => void;
  filter: EngagementListFilter;
}

export function EngagementFilter({ onChange, filter }: EngagementFilterProps) {
  const [isStatusSelectOpen, setIsStatusSelectOpen] = useState<boolean>(false);
  const [isSortSelectOpen, setIsSortSelectOpen] = useState<boolean>(false);
  const createSortOption = (
    option: SortOption<EngagementSortFields>
  ): SelectOptionObject => {
    return {
      sortField: option?.sortField,
      isAscending: option.isAscending,
      toString: function() {
        return getSortDisplayValue(option?.sortField, option?.isAscending);
      },
    } as any;
  };
  const getStatusDisplayValue = (status: EngagementStatus) => {
    if (status === EngagementStatus.active) {
      return 'Active';
    } else if (status === EngagementStatus.past) {
      return 'Past';
    } else if (status === EngagementStatus.upcoming) {
      return 'Upcoming';
    }
  };
  const getSortDisplayValue = (
    field: EngagementSortFields,
    isAscending: boolean
  ) => {
    const getSortText = (e: EngagementSortFields) => {
      if (e === EngagementSortFields.startDate) {
        return 'Start Date';
      } else if (e === EngagementSortFields.endDate) {
        return 'End Date';
      } else if (e === EngagementSortFields.customerName) {
        return 'Customer Name';
      } else if (e === EngagementSortFields.projectName) {
        return 'Project Name';
      }
    };
    return `${getSortText(field)} ${isAscending ? 'Asc' : 'Desc'}`;
  };
  const sortSelectOptions = Object.keys(EngagementSortFields)
    .filter(f => typeof EngagementSortFields[f] === 'number')
    .reduce<any[]>((options, sortField) => {
      return [
        ...options,
        createSortOption({
          sortField: EngagementSortFields[sortField],
          isAscending: true,
        }),
        createSortOption({
          sortField: EngagementSortFields[sortField],
          isAscending: false,
        }),
      ];
    }, []);
  const sortSelection = sortSelectOptions.find(sortSelectOption => {
    return (
      sortSelectOption?.isAscending === filter?.sort?.isAscending &&
      sortSelectOption?.sortField === filter?.sort?.sortField
    );
  });

  return (
    <Grid hasGutter>
      <GridItem span={4}>
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
      </GridItem>
      <GridItem span={3}>
        <Select
          placeholderText="Sort by"
          isOpen={isSortSelectOpen}
          onToggle={() => setIsSortSelectOpen(!isSortSelectOpen)}
          selections={sortSelection}
          onSelect={(
            _,
            selection: { sortField: EngagementSortFields; isAscending: boolean }
          ) =>
            onChange({
              ...filter,
              sort: {
                sortField: selection?.sortField,
                isAscending: selection?.isAscending,
              },
            })
          }
        >
          {
            sortSelectOptions.map(option => [
              <SelectOption
                value={createSortOption({
                  sortField: option?.sortField as EngagementSortFields,
                  isAscending: option?.isAscending,
                })}
              >
                {getSortDisplayValue(option?.sortField, option?.isAscending)}
              </SelectOption>,
            ]) as []
          }
        </Select>
      </GridItem>
    </Grid>
  );
}
