import React from 'react';
import { Engagement, EngagementUseCase } from '../../schemas/engagement';
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
  onChange: (fieldName: keyof Engagement, value: any) => void;
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
          <CustomerNameFormField
            onChange={props.onChange}
            engagement={props.engagement}
          />
          <EngagementNameFormField
            onChange={props.onChange}
            engagement={props.engagement}
          />
          <EngagementUseCaseField
            onChange={(useCases: EngagementUseCase[]) =>
              props.onChange('use_cases', useCases)
            }
            engagement={props.engagement}
          />
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
