import React from 'react';
import {
  TextInput,
  Button,
  ButtonVariant,
  InputGroup,
  Flex,
  FlexItem,
} from '@patternfly/react-core';
import { EngagementFilter } from '../../schemas/engagement_filter';
import { SortSelect } from './components/sort_select';
import { EngagementStatusSelect } from './components/engagement_status_select';
import { SearchIcon } from '@patternfly/react-icons';
import { EngagementRegionSelect } from './components/region_select';
import {
  useAnalytics,
  AnalyticsCategory,
} from '../../context/analytics_context/analytics_context';
import { EngagementStatus } from '../../schemas/engagement';
import { EngagementTypeSelect } from './components/type_select';

export interface EngagementFilterBarProps {
  onChange: (filter: EngagementFilter) => void;
  availableRegions: { label: string; value: string }[];
  availableTypes: { label: string; value: string }[];
  filter: EngagementFilter;
}

export function EngagementFilterBar({
  onChange: _propsOnChange,
  filter,
  availableRegions,
  availableTypes,
}: EngagementFilterBarProps) {  
  const { searchTerm = '' } = filter ?? {};
  const { logEvent } = useAnalytics();
  const onChange = (filter: EngagementFilter) => {
    _propsOnChange(filter);
    logEvent({
      category: AnalyticsCategory.search,
      action: 'Filtered engagement list',
    });
  };

  const updateAllowedStatuses = (status: EngagementStatus) => {
    return status
      ? status === EngagementStatus.past
        ? [EngagementStatus.past, EngagementStatus.terminating]
        : [status]
      : undefined;
  };
  return (
    <Flex justifyContent={{ default: 'justifyContentFlexStart' }}>
      <Flex
        style={{ marginTop: '2rem' }}
        direction={{ default: 'column', md: 'row' }}
      >
        <FlexItem grow={{ default: 'grow' }}>
          <InputGroup>
            <Button
              variant="control"
              aria-label="search button for search input"
            >
              <SearchIcon />
            </Button>
            <TextInput
              style={{ minWidth: '15rem' }}
              aria-label="Search for an engagement"
              value={searchTerm}
              onChange={searchTerm => onChange({ ...filter, searchTerm })}
              placeholder="Search for an engagement"
              data-cy={'search_input'}
            />
          </InputGroup>
        </FlexItem>
        <FlexItem>
          <EngagementStatusSelect
            onChange={status => {
              onChange({
                ...filter,
                allowedStatuses: updateAllowedStatuses(status),
              });
            }}
            selectedStatuses={filter?.allowedStatuses ?? []}
          />
        </FlexItem>
        <FlexItem>
          <EngagementTypeSelect
            types={availableTypes ?? []}
            onChange={selection => {
              if (selection === 'any') {
                return onChange({
                  ...filter,
                  engagementTypes: undefined,
                });
              } else if (
                !filter.engagementTypes ||
                filter.engagementTypes.indexOf(selection) === -1
              ) {
                onChange({
                  ...filter,
                  engagementTypes: [
                    ...(filter.engagementTypes ?? []),
                    selection,
                  ],
                });
              } else {
                onChange({
                  ...filter,
                  engagementTypes: filter.engagementTypes.filter(
                    s => s !== selection
                  ),
                });
              }
            }}
            selectedOptions={filter?.engagementTypes ?? []}
          />
        </FlexItem>
        <FlexItem>
          <EngagementRegionSelect
            regions={availableRegions ?? []}
            onChange={selection => {
              if (selection === 'any') {
                return onChange({
                  ...filter,
                  engagementRegions: undefined,
                });
              } else if (
                !filter.engagementRegions ||
                filter.engagementRegions.indexOf(selection) === -1
              ) {
                onChange({
                  ...filter,
                  engagementRegions: [
                    ...(filter.engagementRegions ?? []),
                    selection,
                  ],
                });
              } else {
                onChange({
                  ...filter,
                  engagementRegions: filter.engagementRegions.filter(
                    s => s !== selection
                  ),
                });
              }
            }}
            selectedOptions={filter?.engagementRegions ?? []}
          />
        </FlexItem>
        <FlexItem>
          <SortSelect
            onChange={sortFilter => {
              onChange(sortFilter);
            }}
            filter={filter}
          />
        </FlexItem>
        <FlexItem>
          <Button
            variant={ButtonVariant.secondary}
            onClick={() => onChange({})}
            data-cy={'reset_button'}
          >
            Reset
          </Button>
        </FlexItem>
      </Flex>
    </Flex>
  );
}
