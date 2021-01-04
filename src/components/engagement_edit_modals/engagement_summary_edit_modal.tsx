import React from 'react';
import { Engagement } from '../../schemas/engagement';
import { Modal, ModalVariant, Button, Form } from '@patternfly/react-core';
import { EditModalTemplate } from '../../layout/edit_modal_template';
import { DescriptionFormField } from '../engagement_form_fields/description';
import { LocationFormField } from '../engagement_form_fields/location';
import { EngagementStartEndDateFormField } from '../engagement_form_fields/engagement_start_end_date';
import { PublicReferenceField } from '../engagement_form_fields/public_reference';
import { EngagementUseCaseField } from '../engagement_form_fields/use_case';
import { CustomerNameFormField } from '../engagement_form_fields/customer_name';
import { EngagementNameFormField } from '../engagement_form_fields/engagement_name';
import { useHistory } from 'react-router';

export interface EngagementSummaryEditModalProps {
  engagement: Engagement;
  isOpen: boolean;
  onSave: (engagement: Engagement) => void;
  onClose: () => void;
}
export function EngagementSummaryEditModal(
  props: EngagementSummaryEditModalProps
) {
  const history = useHistory();
  const onSave = () => {
    reRoute();
    props.onSave(props.engagement);
    props.onClose?.();
  };
  const reRoute = () => {
    if (props.engagement.customer_name && props.engagement.project_name) {
      history.push(
        `/app/engagements/${props.engagement.customer_name}/${props.engagement.project_name}`
      );
    }
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
          <CustomerNameFormField />
          <EngagementNameFormField />
          <EngagementUseCaseField />
          <DescriptionFormField />
          <LocationFormField />
          <EngagementStartEndDateFormField />
          <PublicReferenceField />
        </Form>
      </EditModalTemplate>
    </Modal>
  );
}
