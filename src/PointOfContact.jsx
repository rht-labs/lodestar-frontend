import React from 'react';
import { Form, FormGroup, TextInput } from '@patternfly/react-core';

const PointOfContact = () => {
  return(
    <Form>
      <FormGroup
         label="Labs Engagement Lead Name"
         isRequired
         fieldId="engagement-lead-name"
       >
        <TextInput
          isRequired
          type="text"
          id="engagement-lead-name"
          name="engagement-lead-name"
        />
      </FormGroup>
      <FormGroup
        label="Engagement Lead Email"
        isRequired
        fieldId="engagement-lead-email"
       >
        <TextInput
          isRequired
          type="email"
          id="engagement-lead-email"
          name="engagement-lead-email"
        />
      </FormGroup>

      <FormGroup
         label="Labs Technical Resource Name"
         isRequired
         fieldId="technical-resource-name"
       >
        <TextInput
          isRequired
          type="text"
          id="technical-resource-name"
          name="technical-resource-name"
        />
      </FormGroup>
      <FormGroup
         label="Technical Resource Email"
         isRequired
         fieldId="technical-resource-email"
       >
        <TextInput
          isRequired
          type="email"
          id="technical-resource-email"
          name="technical-resource-email"
        />
      </FormGroup>

      <FormGroup
         label="Customer Contact Name"
         isRequired
         fieldId="customer-contact-name"
       >
        <TextInput
          isRequired
          type="text"
          id="customer-contact-name"
          name="customer-contact-name"
        />
      </FormGroup>
      <FormGroup
         label="Customer Contact Email"
         isRequired
         fieldId="customer-contact-email"
       >
        <TextInput
          isRequired
          type="email"
          id="customer-contact-email"
          name="customer-contact-email"
        />
      </FormGroup>
    </Form>
  )
}

export default PointOfContact;
