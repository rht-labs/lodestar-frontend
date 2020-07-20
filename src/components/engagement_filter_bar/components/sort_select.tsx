import React, { useState } from 'react';
import {
  Button,
  InputGroup,
  Select,
  SelectOption,
  SelectOptionObject,
} from '@patternfly/react-core';
import {
  EngagementSortFields,
  SortOption,
} from '../../../schemas/engagement_filter';
import { EngagementFilterProps } from '../engagement_filter_bar';
import { SortAmountDownIcon } from "@patternfly/react-icons";
export function SortSelect({ filter, onChange }: EngagementFilterProps) {
  const [isSortSelectOpen, setIsSortSelectOpen] = useState<boolean>(false);

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
  const createSortOption = (
    option: SortOption<EngagementSortFields>
  ): SelectOptionObject => {
    return {
      sortField: option?.sortField,
      isAscending: option.isAscending,
      toString: function () {
        return getSortDisplayValue(option?.sortField, option?.isAscending);
      },
    } as any;
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
    <>
      <InputGroup>
        <Button variant="control" aria-label="search button for search input">
          <SortAmountDownIcon />
        </Button>
        <Select
          placeholderText="Sort by"
          isOpen={isSortSelectOpen}
          onToggle={() => setIsSortSelectOpen(!isSortSelectOpen)}
          toggleId={'sort_dropdown'}
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
                data-testid={option}
              >
                {getSortDisplayValue(option?.sortField, option?.isAscending)}
              </SelectOption>,
            ]) as []
          }
        </Select>
      </InputGroup>
    </>
  );
}
