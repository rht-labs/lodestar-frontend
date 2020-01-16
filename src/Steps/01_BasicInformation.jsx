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
         fieldId="customer-name"
         helperText="The client this residency is for"
       >
        <TextInput
          type="text"
          id="customer-name"
          name="customer-name"
        />
      </FormGroup>
      <FormGroup
         label="Project Name"
         fieldId="project-name"
         helperText="The solution being worked on during the residency"
       >
        <TextInput
          type="text"
          id="project-name"
          name="project-name"
        />
      </FormGroup>
      <FormGroup
         label="Location"
         fieldId="residency-location"
         helperText="Where this residency will be held"
       >
        <TextInput

          type="text"
          id="residency-location"
          name="residency-location"
        />
      </FormGroup>
      <FormGroup
         label="Residency Dates"
         fieldId="residency-dates"
         helperText="The the start and end dates of this residency"
      >
        <InputGroup
           label="Residency Duration"
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
