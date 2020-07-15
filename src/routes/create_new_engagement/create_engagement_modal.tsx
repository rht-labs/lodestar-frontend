import React, { useEffect, useState } from 'react';
import {
  Modal,
  Button,
  Form,
  FormGroup,
  TextInput,
  Text,
} from '@patternfly/react-core';
import { useEngagements } from '../../context/engagement_context/engagement_hook';
import { CustomerSelectDropdown } from '../../components/customer_select_dropdown/customer_select_dropdown';
import { useValidation } from '../../context/validation_context/validation_hook';

export interface CreateEngagementModalProps {
  isOpen: boolean;
  onRequestClose: (customerName?: string, projectName?: string) => void;
}

export function CreateEngagementModal(props: CreateEngagementModalProps) {
  const { currentEngagement, createEngagement } = useEngagements();

  const [customerName, setCustomerName] = useState(null);
  const [projectName, setProjectName] = useState(null);
  const { getValidationResult, validate } = useValidation();
  useEffect(() => {
    setCustomerName(null);
    setProjectName(null);
  }, [currentEngagement]);

  const createNewEngagement = () => {
    createEngagement({
      customer_name: customerName,
      project_name: projectName,
    });
    props.onRequestClose(customerName, projectName);
  };
  const hasValidInput =
    !!customerName &&
    !!projectName &&
    getValidationResult('project_name')?.length === 0 &&
    getValidationResult('customer_name')?.length === 0;
  return (
    <Modal
      width={'50%'}
      title="Create New Engagement"
      isOpen={props.isOpen}
      onClose={props.onRequestClose}
      actions={[
        <Button
          key="confirm"
          variant="primary"
          onClick={createNewEngagement}
          data-cy="createNewEngagement"
          isDisabled={!hasValidInput}
        >
          Submit
        </Button>,
        <Button
          key="cancel"
          variant="link"
          onClick={() => props.onRequestClose()}
        >
          Cancel
        </Button>,
      ]}
    >
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
    </Modal>
  );
}
