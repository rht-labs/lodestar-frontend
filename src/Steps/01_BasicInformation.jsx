import React from "react";
import { CalendarAltIcon } from "@patternfly/react-icons";
import {
  Form,
  FormGroup,
  InputGroup,
  InputGroupText,
  TextInput
} from "@patternfly/react-core";
const BasicInformation = ({ values, onChange }) => {
  return (
    <Form isHorizontal>
      <FormGroup
        label="Customer Name"
        fieldId="customer-name"
        helperText="The client this residency is for"
        isRequired
      >
        <TextInput
          type="text"
          id="customer_name"
          name="customer_name"
          value={values.customer_name}
          onChange={e => onChange({ type: "customer_name", payload: e })}
        />
      </FormGroup>
      <FormGroup
        label="Project Name"
        fieldId="project-name"
        helperText="The solution being worked on during the residency"
        isRequired
      >
        <TextInput
          type="text"
          id="project_name"
          name="project_name"
          value={values.project_name}
          onChange={e => onChange({ type: "project_name", payload: e })}
        />
      </FormGroup>
      <FormGroup
        label="Location"
        fieldId="residency-location"
        helperText="Where this residency will be held"
        isRequired
      >
        <TextInput
          type="text"
          id="location"
          name="location"
          value={values.location}
          onChange={e => onChange({ type: "location", payload: e })}
        />
      </FormGroup>
      <FormGroup
        label="Residency Dates"
        fieldId="residency-dates"
        helperText="The the start and end dates of this residency"
        isRequired
      >
        <InputGroup label="Residency Duration">
          <InputGroupText component="label" htmlFor="residency-duration">
            <CalendarAltIcon />
          </InputGroupText>
          <TextInput
            name="start_date"
            id="start_date"
            type="date"
            aria-label="Residency start date"
            value={values.start_date}
            onChange={e => onChange({ type: "start_date", payload: e })}
          />
          <TextInput
            name="end_date"
            id="end_date"
            type="date"
            aria-label="Residency end date"
            value={values.end_date}
            onChange={e => onChange({ type: "end_date", payload: e })}
          />
        </InputGroup>
      </FormGroup>
    </Form>
  );
};

export default BasicInformation;
