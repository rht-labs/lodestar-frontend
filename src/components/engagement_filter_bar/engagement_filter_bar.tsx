import React from 'react';
import {
  TextInput,
  Grid,
  GridItem,
  Button,
  ButtonVariant,
  InputGroup, Flex, FlexItem,
} from '@patternfly/react-core';
import { EngagementFilter } from '../../schemas/engagement_filter';
import { SortSelect } from './components/sort_select';
import { EngagementStatusSelect } from './components/engagement_status_select';
import { SearchIcon } from "@patternfly/react-icons";

export interface EngagementFilterProps {
  onChange: (filter: EngagementFilter) => void;
  filter: EngagementFilter;
}

export function EngagementFilterBar({
  onChange,
  filter,
}: EngagementFilterProps) {
  const { searchTerm = '' } = filter ?? {};
  return (
    <Flex justifyContent={{ default: 'justifyContentCenter' }} >
      <Flex style={{marginTop: '1rem'}}>
        <FlexItem grow={{ default: 'grow' }}>
          <InputGroup>
            <Button variant="control" aria-label="search button for search input">
              <SearchIcon />
            </Button>
            <TextInput
              style={{minWidth: '15rem'}}
              value={searchTerm}
              onChange={searchTerm => onChange({ ...filter, searchTerm })}
              placeholder="Search for an engagement"
            />
          </InputGroup>
        </FlexItem>
        <FlexItem>
          <EngagementStatusSelect onChange={onChange} filter={filter} />
        </FlexItem>
        <FlexItem>
          <SortSelect onChange={onChange} filter={filter} />
        </FlexItem>
        <FlexItem>
          <Button variant={ButtonVariant.secondary} onClick={() => onChange({})}>
            Reset
          </Button>
        </FlexItem>
      </Flex>
    </Flex>
  );
}
