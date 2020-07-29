import React from 'react';
import { Engagement } from '../../schemas/engagement';
import { Modal, ModalVariant, Button, Form } from '@patternfly/react-core';
import { useModalVisibility } from '../../context/edit_modal_visibility_context/edit_modal_visibility_hook';
import { EditModalTemplate } from '../../layout/edit_modal_template';
import { DescriptionFormField } from '../engagement_form_fields/description';
import { LocationFormField } from '../engagement_form_fields/location';
import { EngagementStartEndDateFormField } from '../engagement_form_fields/engagement_start_end_date';
import { EngagementFormConfig } from '../../schemas/engagement_config';

export interface EngagementSummaryEditModalProps {
  onChange: (fieldName: string, value: any) => void;
  formOptions: EngagementFormConfig;
  engagement: Engagement;
  isOpen: boolean;
  onSave: (engagement: Engagement) => void;
}
export function EngagementSummaryEditModal(
  props: EngagementSummaryEditModalProps
) {
  const { requestClose } = useModalVisibility();

  const onSave = () => {
    props.onSave(props.engagement);
    requestClose();
  };
  return (
    <Modal
      variant={ModalVariant.small}
      isOpen={props.isOpen}
      onClose={requestClose}
      title="Engagement Summary"
    >
      <EditModalTemplate
        actions={
          <div>
            <Button onClick={onSave}
                    data-cy={"save_summary_card"}>
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
            formOptions={props.formOptions}
            engagement={props.engagement}
          />
        </Form>
      </EditModalTemplate>
    </Modal>
  );
}
