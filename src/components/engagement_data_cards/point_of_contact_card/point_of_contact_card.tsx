import React from 'react';
import { DataCard } from '../data_card';
import { Engagement } from '../../../schemas/engagement_schema';
import { Grid, GridItem } from '@patternfly/react-core';
import { TitledDataPoint } from '../../titled_data_point/titled_data_point';
import { useModalVisibility } from '../../../context/edit_modal_visibility_context/edit_modal_visibility_hook';
import { PointOfContactEditModal } from '../../engagement_edit_modals/point_of_contact_edit_modal';
import { EditButton } from '../../data_card_edit_button/data_card_edit_button';
import { RequiredFieldsWarning } from '../../required_fields_warning/required_fields_warning';

const POINT_OF_CONTACT_MODAL_KEY = 'poc_modal';

export interface PointOfContactCardProps {
  engagement: Engagement;
  onChange: (fieldName: string, value: any) => void;
  formOptions: object;
  onSave: (engagement: Engagement) => void;
}

export function PointOfContactCard({
  engagement,
  formOptions,
  onChange,
  onSave,
}: PointOfContactCardProps) {
  const { requestOpen, activeModalKey } = useModalVisibility();

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
        formOptions={formOptions}
        onChange={onChange}
        engagement={engagement}
        onSave={onSave}
        isOpen={activeModalKey === POINT_OF_CONTACT_MODAL_KEY}
      />
      <DataCard
        title="Points of Contact"
        trailingIcon={() =>
          !engagement || engagement?.launch ? (
            <div />
          ) : (
            <RequiredFieldsWarning
              requiredFields={pointOfContactRequiredFields}
            />
          )
        }
        actionButton={() => (
          <EditButton
            onClick={() => requestOpen(POINT_OF_CONTACT_MODAL_KEY)}
            text={'Edit'}/>
        )}
      >
        <Grid hasGutter>
          <GridItem span={4}>
            <TitledDataPoint title="Engagement Lead">
              {engagement?.engagement_lead_name}
            </TitledDataPoint>
          </GridItem>
          <GridItem span={4}>
            <TitledDataPoint title="Technical Lead">
              {engagement?.technical_lead_name}
            </TitledDataPoint>
          </GridItem>
          <GridItem span={4}>
            <TitledDataPoint title="Customer Contact">
              {engagement?.customer_contact_name}
            </TitledDataPoint>
          </GridItem>
        </Grid>
      </DataCard>
    </>
  );
}
