import React from 'react';
import {
  TextInput,
  Grid,
  GridItem,
  Button,
  ButtonVariant,
} from '@patternfly/react-core';
import { EngagementFilter } from '../../schemas/engagement_filter';
import { SortSelect } from './components/sort_select';
import { EngagementStatusSelect } from './components/engagement_status_select';

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
        <TextInput
          value={searchTerm}
          onChange={searchTerm => onChange({ ...filter, searchTerm })}
          placeholder="Search for an engagement"
        />
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
