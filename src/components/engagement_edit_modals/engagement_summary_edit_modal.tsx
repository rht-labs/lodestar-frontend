import React from 'react';
import { Engagement } from '../../schemas/engagement';
import { Modal, ModalVariant, Button, Form } from '@patternfly/react-core';
import { EditModalTemplate } from '../../layout/edit_modal_template';
import { DescriptionFormField } from '../engagement_form_fields/description';
import { LocationFormField } from '../engagement_form_fields/location';
import { EngagementStartEndDateFormField } from '../engagement_form_fields/engagement_start_end_date';
import { EngagementFormConfig } from '../../schemas/engagement_config';
import { PublicReferenceField } from '../engagement_form_fields/public_reference';

export interface EngagementSummaryEditModalProps {
  onChange: (fieldName: string, value: any) => void;
  engagementFormConfig: EngagementFormConfig;
  engagement: Engagement;
  isOpen: boolean;
  onSave: (engagement: Engagement) => void;
  onClose: () => void;
}
export function EngagementSummaryEditModal(
  props: EngagementSummaryEditModalProps
) {
  const onSave = () => {
    props.onSave(props.engagement);
    props.onClose?.();
  };
  return (
    <Modal
      variant={ModalVariant.small}
      isOpen={props.isOpen}
      onClose={() => {
        props.onClose?.();
      }}
      title="Engagement Summary"
    >
      <EditModalTemplate
        actions={
          <div>
            <Button
              data-testid="engagement-summary-save"
              onClick={onSave}
              data-cy={'save_summary_card'}
            >
              Save
            </Button>
          </div>
        }
      >
        <Form>
          <DescriptionFormField
            onChange={props.onChange}
            engagement={props.engagement}
          />
          <LocationFormField
            onChange={props.onChange}
            engagement={props.engagement}
          />
          <EngagementStartEndDateFormField
            onChange={props.onChange}
            engagementFormConfig={props.engagementFormConfig}
            engagement={props.engagement}
          />
          <PublicReferenceField
            engagement={props.engagement}
            onChange={props.onChange}
          />
        </Form>
      </EditModalTemplate>
    </Modal>
  );
}
