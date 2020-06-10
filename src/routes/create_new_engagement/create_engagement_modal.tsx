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

export interface CreateEngagementModalProps {
  isOpen: boolean;
  onRequestClose: (customerName?: string, projectName?: string) => void;
}

export function CreateEngagementModal(props: CreateEngagementModalProps) {
  const { activeEngagement, createEngagement } = useEngagements();

  const [customerName, setCustomerName] = useState(null);
  const [projectName, setProjectName] = useState(null);

  useEffect(() => {
    setCustomerName(null);
    setProjectName(null);
  }, [activeEngagement]);

  const createNewEngagement = () => {
    createEngagement({
      customer_name: customerName,
      project_name: projectName,
    });
    props.onRequestClose(customerName, projectName);
  };
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
        >
          Submit
        </Button>,
        <Button key="cancel" variant="link" onClick={props.onRequestClose}>
          Cancel
        </Button>,
      ]}
      isFooterLeftAligned
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
        >
          <TextInput
            type="text"
            id="customer_name"
            name="customer_name"
            placeholder="e.g. NASA"
            value={customerName || ''}
            onChange={setCustomerName}
            data-cy="new_customer_name"
          />
        </FormGroup>
        <FormGroup
          label="Project Name"
          fieldId="project-name"
          helperText="The name of the solution being worked on."
          isRequired
        >
          <TextInput
            type="text"
            id="project_name"
            name="project_name"
            placeholder="e.g. Mars Probe"
            value={projectName || ''}
            onChange={setProjectName}
            data-cy="new_engagement_name"
          />
        </FormGroup>
      </Form>
    </Modal>
  );
}
