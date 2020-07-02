import React from 'react';
import { DataCard } from '../data_card';
import {
  Engagement,
  getEngagementStatus,
} from '../../../schemas/engagement_schema';
import { Grid, GridItem } from '@patternfly/react-core';
import { TitledDataPoint } from '../../titled_data_point/titled_data_point';
import { format as formatDate } from 'date-fns';
import { EngagementSummaryEditModal } from '../../engagement_edit_modals/engagement_summary_edit_modal';
import { useModalVisibility } from '../../../context/edit_modal_visibility_context/edit_modal_visibility_hook';
import { EditButton } from '../../data_card_edit_button/data_card_edit_button';
import { RequiredFieldsWarning } from '../../required_fields_warning/required_fields_warning';
import { EngagementFormConfig } from '../../../schemas/engagement_config';
import { EngagementStatusText } from '../../../routes/engagement_list/engagement_status_text';
import {DisplayCreatedByName} from "../../../common/display_created_by_name";

export interface EngagementSummaryCardProps {
  currentEngagement: Engagement;
  currentEngagementChanges: Engagement;
  onChange: (fieldName: string, value: any) => void;
  formOptions: EngagementFormConfig;
  onSave: (engagement: Engagement) => void;
  missingRequiredFields: string[];
}
const ENGAGEMENT_SUMMARY_MODAL_KEY = 'engagement_summary';

export function EngagementSummaryCard({
  currentEngagement,
  currentEngagementChanges,
  onChange = () => null,
  formOptions,
  missingRequiredFields,
  onSave,
}: EngagementSummaryCardProps) {
  const { requestOpen, activeModalKey } = useModalVisibility();
  const engagementSummaryRequiredFields = [
    'customer_name',
    'end_date',
    'start_date',
    'project_name',
  ];
  const status = getEngagementStatus(currentEngagement);

  return (
    <>
      <EngagementSummaryEditModal
        onSave={onSave}
        formOptions={formOptions}
        onChange={onChange}
        engagement={currentEngagementChanges}
        isOpen={activeModalKey === ENGAGEMENT_SUMMARY_MODAL_KEY}
      />
      <DataCard
        trailingIcon={() =>
          !currentEngagement || currentEngagement?.launch ? (
            <div/>
          ) : (
            <RequiredFieldsWarning
              missingRequiredFields={missingRequiredFields}
              requiredFields={engagementSummaryRequiredFields}
            />
          )
        }
        actionButton={() => (
          <EditButton
            onClick={() => requestOpen(ENGAGEMENT_SUMMARY_MODAL_KEY)}
            text={'Edit'}
          />
        )}
        title="Engagement Summary"
      >
        <Grid hasGutter>
          <GridItem style={{marginBottom: '1rem'}}>
            <EngagementStatusText status={status}/>
          </GridItem>
          <GridItem span={3}>
            <TitledDataPoint title="Company">
              {currentEngagement?.customer_name}
            </TitledDataPoint>
          </GridItem>
          <GridItem span={3}>
            <TitledDataPoint title="Project">
              {currentEngagement?.project_name}
            </TitledDataPoint>
          </GridItem>
          <GridItem span={3}>
            <TitledDataPoint title="Location">
              {currentEngagement?.location}
            </TitledDataPoint>
          </GridItem>
          <GridItem span={3}>
            <TitledDataPoint title="Description">
              {currentEngagement?.description}
            </TitledDataPoint>
          </GridItem>
          <GridItem span={3}>
            <TitledDataPoint title="Start Date">
              {currentEngagement?.start_date
                ? formatDate(currentEngagement?.start_date, 'MMM dd, yyyy')
                : null}
            </TitledDataPoint>
          </GridItem>
          <GridItem span={3}>
            <TitledDataPoint title="End Date">
              {currentEngagement?.end_date
                ? formatDate(currentEngagement?.end_date, 'MMM dd, yyyy')
                : null}
            </TitledDataPoint>
          </GridItem>
          <GridItem span={3}>
            <TitledDataPoint title="Created By">
              <DisplayCreatedByName
                userFromServer={currentEngagement?.creation_details?.created_by_user}
                lastUpdatedBy={currentEngagement?.last_update_by_name}/>
            </TitledDataPoint>
          </GridItem>
        </Grid>
      </DataCard>
    </>
  );
}

