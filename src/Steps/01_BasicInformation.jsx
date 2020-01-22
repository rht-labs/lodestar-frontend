import React from "react";
import { CalendarAltIcon } from "@patternfly/react-icons";
import {
  Form,
  FormGroup,
  InputGroup,
  InputGroupText,
  TextArea,
  TextInput
} from "@patternfly/react-core";
const BasicInformation = ({ values, onChange }) => {
  return (
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
          value={values.customer_name}
          onChange={e => onChange({ type: "customer_name", payload: e })}
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
          value={values.project_name}
          onChange={e => onChange({ type: "project_name", payload: e })}
        />
      </FormGroup>
      <FormGroup
        label="Location"
        fieldId="residency-location"
        helperText="Where will this be held?"
        isRequired
      >
        <TextInput
          type="text"
          id="location"
          name="location"
          placeholder="e.g. Pasadena, CA"
          value={values.location}
          onChange={e => onChange({ type: "location", payload: e })}
        />
      </FormGroup>
      <FormGroup
        label="Residency Dates"
        fieldId="residency-dates"
        helperText="What is the duration?"
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
            aria-label="The end date."
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
      <FormGroup label="Description" fieldId="description">
        <TextArea
          name="description"
          id="description"
          aria-label="residency description"
          placeholder="Description and notes for the Engagment"
          value={values.description}
          onChange={e => onChange({ type: "description", payload: e })}
        />
      </FormGroup>
    </Form>
  );
};

export default BasicInformation;
