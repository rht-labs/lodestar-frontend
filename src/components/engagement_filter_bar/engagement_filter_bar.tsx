import React from 'react';
import {
  TextInput,
  Grid,
  GridItem,
  Button,
  ButtonVariant,
  InputGroup,
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
    <Grid hasGutter>
      <GridItem span={4}>
        <InputGroup>
          <Button variant="control" aria-label="search button for search input">
            <SearchIcon />
          </Button>
          <TextInput
            value={searchTerm}
            onChange={searchTerm => onChange({ ...filter, searchTerm })}
            placeholder="Search for an engagement"
          />
        </InputGroup>
      </GridItem>
      <GridItem span={3}>
        <EngagementStatusSelect onChange={onChange} filter={filter} />
      </GridItem>
      <GridItem span={3}>
        <SortSelect onChange={onChange} filter={filter} />
      </GridItem>
      <GridItem span={2}>
        <Button variant={ButtonVariant.secondary} onClick={() => onChange({})}>
          Reset
        </Button>
      </GridItem>
    </Grid>
  );
}
