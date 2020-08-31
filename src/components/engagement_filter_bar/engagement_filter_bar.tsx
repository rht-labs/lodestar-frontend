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
import { EngagementRegionSelect } from '../../region_select';
import { EngagementFormConfig } from '../../schemas/engagement_config';

export interface EngagementFilterProps {
  onChange: (filter: EngagementFilter) => void;
  filter: EngagementFilter;
  formOptions?: EngagementFormConfig;
}

export function EngagementFilterBar({
  onChange,
  filter,
  formOptions,
}: EngagementFilterProps) {
  const { searchTerm = '' } = filter ?? {};
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
              formOptions?.basic_information?.engagement_regions?.options ?? []
            }
            onChange={onChange}
            filter={filter}
          />
        </FlexItem>
        <FlexItem>
          <SortSelect onChange={onChange} filter={filter} />
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
