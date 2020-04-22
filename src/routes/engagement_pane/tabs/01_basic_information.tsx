import React from 'react';
import { CalendarAltIcon } from '@patternfly/react-icons';
import {
  Form,
  FormGroup,
  InputGroup,
  InputGroupText,
  TextArea,
  TextInput,
} from '@patternfly/react-core';
export const BasicInformation = ({ values, onChange }: any) => {
  let formattedStart = '';
  let startFormatted = false;

  if(values.start_date){
    startFormatted = values.start_date.indexOf('-') > -1;
    formattedStart = startFormatted ? values.start_date : [values.start_date.slice(0, 4), "-", values.start_date.slice(4, 6), "-", values.start_date.slice(6, 8)].join('');
  }

  let formattedEnd = '';
  let endFormatted = false;
  if(values.end_date){
    endFormatted = values.end_date.indexOf('-') > -1;
    formattedEnd = endFormatted ? values.end_date : [values.end_date.slice(0, 4), "-", values.end_date.slice(4, 6), "-", values.end_date.slice(6, 8)].join('');
  }

  const tabContent: React.CSSProperties = {
    margin: 45
  };

  const input: React.CSSProperties = {
    backgroundColor: '#EDEDED'
  };

  return (
    <Form style={tabContent} isHorizontal>
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
          style={input}
          value={values.customer_name || ''}
          onChange={e => onChange({ type: 'customer_name', payload: e })}
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
          style={input}
          value={values.project_name || ''}
          onChange={e => onChange({ type: 'project_name', payload: e })}
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
          style={input}
          value={values.location || ''}
          onChange={e => onChange({ type: 'location', payload: e })}
        />
      </FormGroup>
      <FormGroup
        label="Residency Dates"
        fieldId="residency-dates"
        helperText="What is the duration?"
        isRequired
      >
        <InputGroup label="Residency Duration">
          <InputGroupText style={input} component="label" htmlFor="residency-duration">
            <CalendarAltIcon />
          </InputGroupText>
          <TextInput
            name="start_date"
            id="start_date"
            type="date"
            aria-label="The end date."
            style={input}
            value={formattedStart || ''}
            onChange={e => onChange({ type: 'start_date', payload: e })}
          />
          <TextInput
            name="end_date"
            id="end_date"
            type="date"
            style={input}
            aria-label="Residency end date"
            value={formattedEnd || ''}
            onChange={e => onChange({ type: 'end_date', payload: e })}
          />
        </InputGroup>
      </FormGroup>
      <FormGroup label="Description" fieldId="description">
        <TextArea
          name="description"
          id="description"
          style={input}
          aria-label="residency description"
          placeholder="Description and notes for the Engagment"
          value={values.description || ''}
          onChange={e => onChange({ type: 'description', payload: e })}
        />
      </FormGroup>
    </Form>
  );
};
