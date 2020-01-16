import React from 'react';
import { CalendarAltIcon } from '@patternfly/react-icons';
import {
  Form,
  FormGroup,
  InputGroup,
  InputGroupText,
  TextInput
} from '@patternfly/react-core';

const BasicInformation = () => {
  return(
    <Form isHorizontal>
      <FormGroup
         label="Customer Name"
         isRequired
         fieldId="customer-name"
         helperText="The client this residency is for"
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
         helperText="The solution being worked on during the residency"
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
         helperText="Where this residency will be held"
       >
        <TextInput
          isRequired
          type="text"
          id="residency-location"
          name="residency-location"
        />
      </FormGroup>
      <FormGroup
         label="Residency Dates"
         isRequired
         fieldId="residency-dates"
         helperText="The the start and end dates of this residency"
      >
        <InputGroup
           label="Residency Duration"
           isRequired
           fieldId="residency-duration"
        >
          <InputGroupText
            component="label"
            htmlFor="residency-duration"
          >
            <CalendarAltIcon />
          </InputGroupText>
           <TextInput
            name="residency-start-date"
            id="residency-start-date"
            type="date"
            aria-label="Residency start date"
          />
           <TextInput
            name="residency-end-date"
            id="residency-end-date"
            type="date"
            aria-label="Residency end date"
          />
        </InputGroup>
      </FormGroup>
    </Form>
  )
}

export default BasicInformation;
