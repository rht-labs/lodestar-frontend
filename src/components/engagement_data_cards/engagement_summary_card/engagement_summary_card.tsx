import React from 'react';
import { DataCard } from '../data_card';
import { Engagement, getEngagementStatus } from '../../../schemas/engagement';
import { Grid, GridItem } from '@patternfly/react-core';
import { TitledDataPoint } from '../../titled_data_point/titled_data_point';
import { format as formatDate } from 'date-fns';
import { EngagementSummaryEditModal } from '../../engagement_edit_modals/engagement_summary_edit_modal';
import { useModalVisibility } from '../../../context/edit_modal_visibility_context/edit_modal_visibility_hook';
import { EditButton } from '../../data_card_edit_button/data_card_edit_button';
import { RequiredFieldsWarning } from '../../required_fields_warning/required_fields_warning';
import { EngagementStatusText } from '../../engagement_status_text/engagement_status_text';
import { DisplayCreatedByName } from '../../../common/display_created_by_name';

export interface EngagementSummaryCardProps {
  currentEngagement: Engagement;
  currentEngagementChanges: Partial<Engagement>;
  onChange: (fieldName: string, value: any) => void;
  onSave: (engagement: Engagement) => void;
  onClear: () => void;
  missingRequiredFields: string[];
}
const ENGAGEMENT_SUMMARY_MODAL_KEY = 'engagement_summary';

export function EngagementSummaryCard({
  onClear,
  currentEngagement,
  currentEngagementChanges,
  onChange = () => null,
  missingRequiredFields,
  onSave,
}: EngagementSummaryCardProps) {
  const { requestClose, requestOpen, activeModalKey } = useModalVisibility();
  const engagementSummaryRequiredFields = [
    'customer_name',
    'end_date',
    'start_date',
    'project_name',
  ];
  const status = getEngagementStatus(currentEngagement);
  const onClose = () => {
    requestClose();
    onClear();
  };
  return (
    <>
      <EngagementSummaryEditModal
        onClose={onClose}
        onSave={onSave}
        onChange={onChange}
        engagement={currentEngagementChanges}
        isOpen={activeModalKey === ENGAGEMENT_SUMMARY_MODAL_KEY}
      />
      <DataCard
        trailingIcon={() =>
          !currentEngagement || currentEngagement?.launch ? (
            <div />
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
            dataCy={'edit_summary_card'}
          />
        )}
        title="Engagement Summary"
      >
        <Grid hasGutter>
          <GridItem md={12} lg={12} style={{ marginBottom: '1rem' }}>
            <EngagementStatusText status={status} />
          </GridItem>
          <GridItem md={12} lg={6}>
            <Grid hasGutter>
              <GridItem md={6} lg={4}>
                <TitledDataPoint title="Company" dataCy={'company_label'}>
                  {currentEngagement?.customer_name}
                </TitledDataPoint>
              </GridItem>
              <GridItem md={6} lg={4}>
                <TitledDataPoint title="Project" dataCy={'project_label'}>
                  {currentEngagement?.project_name}
                </TitledDataPoint>
              </GridItem>
              <GridItem md={6} lg={4}>
                <TitledDataPoint title="Location" dataCy={'location_label'}>
                  {currentEngagement?.location}
                </TitledDataPoint>
              </GridItem>

              <GridItem md={6} lg={4}>
                <TitledDataPoint title="Start Date" dataCy={'start_date_label'}>
                  {currentEngagement?.start_date
                    ? formatDate(currentEngagement?.start_date, 'MMM dd, yyyy')
                    : null}
                </TitledDataPoint>
              </GridItem>
              <GridItem md={6} lg={4}>
                <TitledDataPoint title="End Date" dataCy={'end_date_label'}>
                  {currentEngagement?.end_date
                    ? formatDate(currentEngagement?.end_date, 'MMM dd, yyyy')
                    : null}
                </TitledDataPoint>
              </GridItem>
              <GridItem md={6} lg={4}>
                <TitledDataPoint title="Created By" dataCy={'created_by_label'}>
                  <DisplayCreatedByName
                    userFromServer={
                      currentEngagement?.creation_details?.created_by_user
                    }
                    lastUpdatedBy={currentEngagement?.last_update_by_name}
                  />
                </TitledDataPoint>
              </GridItem>
              <GridItem md={12}>
                <TitledDataPoint title="Use Cases" dataCy={'use_cases'}>
                  <>
                    {currentEngagement?.use_cases?.map?.(useCase => (
                      <p>{useCase.description}</p>
                    ))}
                  </>
                </TitledDataPoint>
              </GridItem>
            </Grid>
          </GridItem>
          <GridItem md={12} lg={4}>
            <TitledDataPoint title="Description" dataCy={'description_label'}>
              <span style={{ whiteSpace: 'pre-line' }}>
                {currentEngagement?.description}
              </span>
            </TitledDataPoint>
          </GridItem>
        </Grid>
      </DataCard>
    </>
  );
}
