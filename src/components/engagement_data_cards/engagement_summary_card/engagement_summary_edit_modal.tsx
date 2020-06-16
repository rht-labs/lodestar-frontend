import React from 'react';
import { Engagement } from '../../../schemas/engagement_schema';
import {
  Modal,
  ModalVariant,
  Button,
  TextInput,
  InputGroupText,
  InputGroup,
  FormGroup,
  Form,
  TextArea,
} from '@patternfly/react-core';
import { useModalVisibility } from '../../../context/edit_modal_visibility_context/edit_modal_visibility_hook';
import { EditModalTemplate } from '../../../layout/edit_modal_template';
import { CalendarAltIcon } from '@patternfly/react-icons';
import { useFeatures } from '../../../context/feature_toggles/feature_hook';
import { parse as parseDate, format as formatDate } from 'date-fns';
import { APP_FEATURES } from '../../../common/app_features';
import { useEngagements } from '../../../context/engagement_context/engagement_hook';
export interface EngagementSummaryEditModalProps {
  onChange: (fieldName: string, value: any) => void;
  formOptions: object;
  engagement: Engagement;
  isOpen: boolean;
}
export function EngagementSummaryEditModal(
  props: EngagementSummaryEditModalProps
) {
  const { requestClose } = useModalVisibility();
  const { hasFeature } = useFeatures();
  const getFormattedDate = (inputDate: Date | string = '') => {
    // Dates must be formatted YYYY-MM-DD for patternfly date picker.
    // They are coming back inconsistently from the backend,
    // so this function checks to see if the date needs to be formatted,
    // then formats the date appropriately
    if (!inputDate) {
      return;
    }
    if (inputDate instanceof Date) {
      return formatDate(inputDate, 'yyyy-MM-dd');
    } else if (inputDate.indexOf('-') > -1) {
      return inputDate;
    } else {
      return parseDate(inputDate, 'yyyyMMdd', new Date());
    }
  };
  const { saveEngagement, engagementFormState } = useEngagements();

  const onSave = () => {
    saveEngagement(engagementFormState);
    requestClose();
  };
  return (
    <Modal
      variant={ModalVariant.small}
      isOpen={props.isOpen}
      onClose={requestClose}
    >
      <EditModalTemplate
        actions={
          <div>
            <Button onClick={onSave}>Save</Button>
          </div>
        }
        title="Edit Engagement"
      >
        <Form>
          <FormGroup label="Description" fieldId="description">
            <TextArea
              disabled={!hasFeature(APP_FEATURES.writer)}
              name="description"
              id="description"
              aria-label="engagement description"
              placeholder="Description and notes for the Engagement"
              value={props.engagement.description || ''}
              onChange={e => props.onChange('description', e)}
            />
          </FormGroup>
          <FormGroup
            label="Location"
            fieldId="engagement-location"
            helperText="Where will this be held?"
          >
            <TextInput
              isDisabled={!hasFeature(APP_FEATURES.writer)}
              type="text"
              id="location"
              name="location"
              placeholder="e.g. Pasadena, CA"
              value={props.engagement.location || ''}
              onChange={e => props.onChange('location', e)}
            />
          </FormGroup>
          <FormGroup
            label="Start and End Dates"
            fieldId="engagement-dates"
            helperText="What is the duration?"
            isRequired
          >
            <InputGroup label="Engagement Duration">
              <InputGroupText component="label" htmlFor="engagement-duration">
                <CalendarAltIcon />
              </InputGroupText>
              <TextInput
                isDisabled={
                  !hasFeature(APP_FEATURES.writer) ||
                  !!(props.engagement as Engagement).launch
                }
                name="start_date"
                id="start_date"
                type="date"
                aria-label="The start date."
                value={getFormattedDate(props.engagement?.start_date) || ''}
                onChange={e =>
                  props.onChange('start_date', parseDate(e, 'yyyy-MM-dd', 0))
                }
              />
              <TextInput
                isDisabled={!hasFeature(APP_FEATURES.writer)}
                name="end_date"
                id="end_date"
                type="date"
                aria-label="The end date"
                value={getFormattedDate(props.engagement?.end_date) || ''}
                onChange={e =>
                  props.onChange('end_date', parseDate(e, 'yyyy-MM-dd', 0))
                }
              />
            </InputGroup>
          </FormGroup>
        </Form>
      </EditModalTemplate>
    </Modal>
  );
}
