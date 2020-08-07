import React, { useEffect, useState } from 'react';
import {
  Button,
  Form,
  FormGroup,
  TextInput,
  Text,
} from '@patternfly/react-core';
import { useEngagements } from '../../context/engagement_context/engagement_hook';
import { CustomerSelectDropdown } from '../../components/customer_select_dropdown/customer_select_dropdown';
import { useValidation } from '../../context/validation_context/validation_hook';

export interface CreateEngagementPageProps {
  onSubmit: (customerName?: string, projectName?: string) => void;
}

export function CreateEngagementPage(props: CreateEngagementPageProps) {
  const { currentEngagement, getEngagements, engagements } = useEngagements();
  const [hasFetchedEngagements, setHasFetchedEngagements] = useState<boolean>(
    false
  );
  const [customerName, setCustomerName] = useState(null);
  const [projectName, setProjectName] = useState(null);
  const { getValidationResult, validate } = useValidation();
  useEffect(() => {
    if (engagements.length === 0 && !hasFetchedEngagements) {
      setHasFetchedEngagements(true);
      getEngagements();
    }
  });
  useEffect(() => {
    setCustomerName(null);
    setProjectName(null);
  }, [currentEngagement]);

  const createNewEngagement = () => {
    props.onSubmit(customerName, projectName);
  };
  const hasValidInput =
    !!customerName &&
    !!projectName &&
    getValidationResult('project_name')?.length === 0 &&
    getValidationResult('customer_name')?.length === 0;
  return (
    <>
      <Text component="h6">
        To create a new Engagement, please enter a client and product name then
        click submit.
      </Text>
      <Form isHorizontal>
        <FormGroup
          label="Customer Name"
          fieldId="customer-name"
          helperText="What client is this for?"
          isRequired
          helperTextInvalid={getValidationResult('customer_name').join(' ')}
          validated={
            getValidationResult('customer_name').length > 0
              ? 'error'
              : 'default'
          }
        >
          <CustomerSelectDropdown
            placeholder="e.g. NASA"
            selectedValue={customerName}
            onSelect={value =>
              validate('customer_name')(value) && setCustomerName(value)
            }
          />
        </FormGroup>
        <FormGroup
          label="Project Name"
          fieldId="project-name"
          helperText="The name of the solution being worked on."
          isRequired
          helperTextInvalid={getValidationResult('project_name').join(' ')}
          validated={
            getValidationResult('project_name').length > 0 ? 'error' : 'default'
          }
        >
          <TextInput
            type="text"
            id="project_name"
            name="project_name"
            placeholder="e.g. Mars Probe"
            value={projectName || ''}
            onChange={value =>
              validate('project_name')(value) && setProjectName(value)
            }
            data-cy="new_engagement_name"
          />
        </FormGroup>
      </Form>
      <Button isDisabled={!hasValidInput} onClick={createNewEngagement}>
        Submit
      </Button>
    </>
  );
}
