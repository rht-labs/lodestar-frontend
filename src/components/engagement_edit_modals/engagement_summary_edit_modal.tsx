import React, { useState } from 'react';
import { Engagement } from '../../schemas/engagement';
import { TIMEZONES } from '../../common/timezones';
import {
  Modal,
  ModalVariant,
  Button,
  Form,
  Select,
  SelectVariant,
  SelectOption,
  FormGroup,
} from '@patternfly/react-core';
import { EditModalTemplate } from '../../layout/edit_modal_template';
import { EngagementStartEndDateFormField } from '../engagement_form_fields/engagement_dates';
import { PublicReferenceField } from '../engagement_form_fields/public_reference';
import { EngagementUseCaseField } from '../engagement_form_fields/use_case';
import { useHistory } from 'react-router';
import { TextFormField } from '../form_fields/text_form_field';
import {
  EngagementGroupings,
  useEngagementFormField,
} from '../../context/engagement_context/engagement_context';

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
  const [customerName, setCustomerName] = useEngagementFormField(
    'customer_name',
    EngagementGroupings.engagementSummary
  );
  const [engagementName, setEngagementName] = useEngagementFormField(
    'project_name',
    EngagementGroupings.engagementSummary
  );
  const [useCases, setUseCases] = useEngagementFormField(
    'use_cases',
    EngagementGroupings.engagementSummary
  );
  const [description, setDescription] = useEngagementFormField(
    'description',
    EngagementGroupings.engagementSummary
  );
  const [location, setLocation] = useEngagementFormField(
    'location',
    EngagementGroupings.engagementSummary
  );
  const [timezone, setTimezone] = useEngagementFormField(
    'timezone',
    EngagementGroupings.engagementSummary
  );

  const [isTZSelectOpen, setIsTZSelectOpen] = useState<boolean>(false);

  const getSelectComponents = (timezones: typeof TIMEZONES) => {
    return timezones.map(t => (
      <SelectOption
        data-testid={t.tzCode}
        key={t.name}
        value={t.name}
        description={t.tzCode}
      />
    ));
  };

  return (
    <div data-testid="engagement_summary_edit_modal">
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
            <TextFormField
              value={customerName}
              onChange={setCustomerName}
              fieldId="customer_name"
              testId="customer_name_field"
              label="Client Name"
              isRequired={true}
            />
            <TextFormField
              value={engagementName}
              onChange={setEngagementName}
              fieldId="engagement_name"
              testId="engagement_name_field"
              label="Engagement Name"
              isRequired={true}
            />
            <EngagementUseCaseField
              useCases={useCases}
              setUseCases={setUseCases}
            />
            <TextFormField
              value={description}
              onChange={setDescription}
              fieldId="description"
              label="Description"
              placeholder="Description and notes for the Engagement"
              testId="description_field"
            />
            <TextFormField
              value={location}
              onChange={setLocation}
              placeholder="e.g. Pasadena, CA"
              fieldId="location"
              testId="location_field"
              helperText="Where will this be held?"
              label="Location"
            />
            <div data-testid="timezone-select">
              <FormGroup fieldId="timezone" label="Timezone">
                <Select
                  aria-label="Timezone"
                  menuAppendTo={document.body}
                  maxHeight={'20rem'}
                  toggleId="timezone-dropdown"
                  variant={SelectVariant.typeahead}
                  selections={TIMEZONES.find(t => t.tzCode === timezone)?.name}
                  label={'Timezone'}
                  isOpen={isTZSelectOpen}
                  onToggle={setIsTZSelectOpen}
                  isCreatable={false}
                  onFilter={e => {
                    const lower = e.target.value.toLowerCase();
                    return getSelectComponents(
                      TIMEZONES.filter(
                        t =>
                          t.name.toLowerCase().includes(lower) ||
                          t.label.toLowerCase().includes(lower)
                      )
                    );
                  }}
                  onSelect={(_, selection) => {
                    const timezoneValue = TIMEZONES.find(
                      t => t.name === selection
                    )?.tzCode;
                    setTimezone(timezoneValue);
                    setIsTZSelectOpen(false);
                  }}
                >
                  {getSelectComponents(TIMEZONES)}
                </Select>
              </FormGroup>
            </div>
            <EngagementStartEndDateFormField />
            <PublicReferenceField />
          </Form>
        </EditModalTemplate>
      </Modal>
    </div>
  );
}
