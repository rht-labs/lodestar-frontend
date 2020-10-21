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
import { EngagementFormConfig } from '../../schemas/engagement_config';
import { useAnalytics, AnalyticsCategory } from '../../context/analytics_context/analytics_context';

export interface EngagementFilterProps {
  onChange: (filter: EngagementFilter) => void;
  filter: EngagementFilter;
  engagementFormConfig?: EngagementFormConfig;
}

export function EngagementFilterBar({
  onChange: _propsOnChange,
  filter,
  engagementFormConfig,
}: EngagementFilterProps) {
  const { searchTerm = '' } = filter ?? {};
  const { logEvent } = useAnalytics();
  const onChange = (filter: EngagementFilter) => {
    _propsOnChange(filter);
    logEvent({
      category: AnalyticsCategory.search,
      action: 'Filtered engagement list',
    });
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
          <EngagementStatusSelect onChange={onChange} filter={filter} />
        </FlexItem>
        <FlexItem>
          <EngagementRegionSelect
            regions={
              engagementFormConfig?.basic_information?.engagement_regions
                ?.options ?? []
            }
            onChange={sortFilter => {
              onChange(sortFilter);
            }}
            filter={filter}
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
