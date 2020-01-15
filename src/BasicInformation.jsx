import React from 'react';
import { Form, FormGroup, TextInput } from '@patternfly/react-core';

const BasicInformation = () => {
  return(
    <Form>
      <FormGroup
         label="Customer/Company Name"
         isRequired
         fieldId="customer-name"
         helperText="The customer name to use for this residency"
       >
        <TextInput
          isRequired
          type="text"
          id="customer-name"
          name="customer-name"
        />
      </FormGroup>
      <FormGroup
         label="Project Name"
         isRequired
         fieldId="project-name"
         helperText="The project being worked on during the residency"
       >
        <TextInput
          isRequired
          type="text"
          id="project-name"
          name="project-name"
        />
      </FormGroup>
      <FormGroup
         label="Location"
         isRequired
         fieldId="residency-location"
         helperText="Where the residency will be held"
       >
        <TextInput
          isRequired
          type="text"
          id="residency-location"
          name="residency-location"
        />
      </FormGroup>
    </Form>
  )
}

export default BasicInformation;
