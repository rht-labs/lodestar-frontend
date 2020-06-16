import React from 'react';
import { DataCard } from '../data_card';
import { Engagement } from '../../../schemas/engagement_schema';
import { Grid, GridItem } from '@patternfly/react-core';
import { TitledDataPoint } from '../../titled_data_point/titled_data_point';
import { format as formatDate } from 'date-fns';
import { EngagementSummaryEditModal } from './engagement_summary_edit_modal';
import { useModalVisibility } from '../../../context/edit_modal_visibility_context/edit_modal_visibility_hook';

export interface EngagementSummaryCardProps {
  engagement: Engagement;
  onChange: (fieldName: string, value: any) => void;
  formOptions: object;
}
const ENGAGEMENT_SUMMARY_MODAL_KEY = 'engagement_summary';

export function EngagementSummaryCard({
  engagement,
  onChange = () => null,
  formOptions,
}: EngagementSummaryCardProps) {
  const { requestOpen, activeModalKey } = useModalVisibility();
  return (
    <>
      <EngagementSummaryEditModal
        formOptions={formOptions}
        onChange={onChange}
        engagement={engagement}
        isOpen={activeModalKey === ENGAGEMENT_SUMMARY_MODAL_KEY}
      />
      <DataCard
        isEditable
        onEdit={() => requestOpen(ENGAGEMENT_SUMMARY_MODAL_KEY)}
        title="Engagement Summary"
      >
        <Grid hasGutter>
          <GridItem span={4}>
            <TitledDataPoint title="Company">
              {engagement?.customer_name}
            </TitledDataPoint>
          </GridItem>
          <GridItem span={4}>
            <TitledDataPoint title="Project">
              {engagement?.project_name}
            </TitledDataPoint>
          </GridItem>
          <GridItem span={4}>
            <TitledDataPoint title="Start Date">
              {engagement?.start_date
                ? formatDate(engagement?.start_date, 'MMM dd, yyyy')
                : null}
            </TitledDataPoint>
          </GridItem>
          <GridItem span={4}>
            <TitledDataPoint title="End Date">
              {engagement?.end_date
                ? formatDate(engagement?.end_date, 'MMM dd, yyyy')
                : null}
            </TitledDataPoint>
          </GridItem>
          <GridItem span={4}>
            <TitledDataPoint title="Description">
              {engagement?.description}
            </TitledDataPoint>
          </GridItem>
          <GridItem span={4}>
            <TitledDataPoint title="Location">
              {engagement.location}
            </TitledDataPoint>
          </GridItem>
        </Grid>
      </DataCard>
    </>
  );
}
