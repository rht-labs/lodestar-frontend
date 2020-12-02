import React from 'react';
import { DataCard } from '../data_card';
import { Engagement } from '../../../schemas/engagement';
import { EmptyState, EmptyStateBody, EmptyStateIcon, Grid, GridItem, Title } from '@patternfly/react-core';
import { TitledDataPoint } from '../../titled_data_point/titled_data_point';
import { useModalVisibility } from '../../../context/edit_modal_visibility_context/edit_modal_visibility_hook';
import { PointOfContactEditModal } from '../../engagement_edit_modals/point_of_contact_edit_modal';
import { EditButton } from '../../data_card_edit_button/data_card_edit_button';
import { RequiredFieldsWarning } from '../../required_fields_warning/required_fields_warning';
import { UsersIcon } from "@patternfly/react-icons";

const POINT_OF_CONTACT_MODAL_KEY = 'poc_modal';

export interface PointOfContactCardProps {
  currentEngagement: Engagement;
  currentEngagementChanges: Partial<Engagement>;
  onChange: (fieldName: string, value: any) => void;
  onSave: (engagement: Engagement) => void;
  missingRequiredFields: string[];
  onClear: () => void;
}

export function PointOfContactCard({
  onClear,
  currentEngagement,
  currentEngagementChanges,
  onChange,
  onSave,
  missingRequiredFields,
}: PointOfContactCardProps) {
  const { requestOpen, activeModalKey, requestClose } = useModalVisibility();

  const pointOfContactRequiredFields = [
    'engagement_lead_email',
    'technical_lead_email',
    'engagement_lead_name',
    'technical_lead_name',
    'customer_contact_email',
    'customer_contact_name',
  ];

  return (
    <>
      <PointOfContactEditModal
        onChange={onChange}
        engagement={currentEngagementChanges}
        onSave={onSave}
        onClose={() => {
          requestClose();
          onClear();
        }}
        isOpen={activeModalKey === POINT_OF_CONTACT_MODAL_KEY}
      />
      <DataCard
        title="Points of Contact"
        trailingIcon={() =>
          !currentEngagement || currentEngagement?.launch ? (
            <div />
          ) : (
            <RequiredFieldsWarning
              missingRequiredFields={missingRequiredFields}
              requiredFields={pointOfContactRequiredFields}
            />
          )
        }
        actionButton={() => (
          <EditButton
            onClick={() => requestOpen(POINT_OF_CONTACT_MODAL_KEY)}
            text={'Edit'}
            dataCy={'points_of_contact'}
          />
        )}
      >
        {
          currentEngagement?.engagement_lead_name || currentEngagement?.technical_lead_name || currentEngagement?.customer_contact_name
          ? (<Grid hasGutter>
                <GridItem sm={12} md={4}>
                  <TitledDataPoint title="Engagement Lead">
                    {currentEngagement?.engagement_lead_name}
                  </TitledDataPoint>
                </GridItem>
                <GridItem sm={12} md={4}>
                  <TitledDataPoint title="Technical Lead">
                    {currentEngagement?.technical_lead_name}
                  </TitledDataPoint>
                </GridItem>
                <GridItem sm={12} md={4}>
                  <TitledDataPoint title="Customer Contact">
                    {currentEngagement?.customer_contact_name}
                  </TitledDataPoint>
                </GridItem>
              </Grid>)
            : (
              <EmptyState>
                <EmptyStateIcon icon={UsersIcon} style={{fontSize: '34px', margin: '0'}}/>
                <Title headingLevel="h5" size="md" style={{marginTop: '0'}}>
                  No Points of Contact Added
                </Title>
                <EmptyStateBody>
                  <p>Click the 'Edit' button, to begin adding point of contacts</p>
                </EmptyStateBody>
              </EmptyState>
            )
        }

      </DataCard>
    </>
  );

}
