import React, { useContext } from 'react';
import { CalendarAltIcon } from '@patternfly/react-icons';
import {
  Form,
  FormGroup,
  InputGroup,
  InputGroupText,
  TextArea,
  TextInput,
} from '@patternfly/react-core';

import { FeatureToggleContext } from '../../../context/feature_toggles/feature_toggles';
import { Engagement } from '../../../schemas/engagement_schema';
import { APP_FEATURES } from '../../../common/app_features';

export const BasicInformation = ({ values, onChange }: any) => {
  const getFormattedDate = (dateString: string = '') => {
    // Dates must be formatted YYYY-MM-DD for patternfly date picker.
    // They are coming back inconsistently from the backend,
    // so this function checks to see if the date needs to be formatted,
    // then formats the date appropriately
    if (!dateString) {
      return;
    }
    if (dateString.indexOf('-') > -1) {
      return dateString;
    } else {
      return [
        dateString.slice(0, 4),
        '-',
        dateString.slice(4, 6),
        '-',
        dateString.slice(6, 8),
      ].join('');
    }
  };

  const tabContent: React.CSSProperties = {
    margin: 45,
  };

  const input: React.CSSProperties = {
    backgroundColor: '#EDEDED',
  };
  const { hasFeature } = useContext(FeatureToggleContext);
  // console.log(values);
  return (
    <Form style={tabContent} isHorizontal>
      <FormGroup
        label="Customer Name"
        fieldId="customer-name"
        helperText="What client is this for?"
        isRequired
      >
        <TextInput
          isDisabled={
            !hasFeature(APP_FEATURES.writer) ||
            !!(values as Engagement).mongo_id
          }
          type="text"
          id="customer_name"
          name="customer_name"
          placeholder="e.g. NASA"
          style={input}
          value={values.customer_name || ''}
          onChange={e => onChange('customer_name', e)}
        />
      </FormGroup>
      <FormGroup
        label="Project Name"
        fieldId="project-name"
        helperText="The name of the solution being worked on."
        isRequired
      >
        <TextInput
          isDisabled={
            !hasFeature(APP_FEATURES.writer) ||
            !!(values as Engagement).mongo_id
          }
          type="text"
          id="project_name"
          name="project_name"
          placeholder="e.g. Mars Probe"
          style={input}
          value={values.project_name || ''}
          onChange={e => onChange('project_name', e)}
        />
      </FormGroup>
      <FormGroup
        label="Location"
        fieldId="engagement-location"
        helperText="Where will this be held?"
        isRequired
      >
        <TextInput
          isDisabled={!hasFeature(APP_FEATURES.writer)}
          type="text"
          id="location"
          name="location"
          placeholder="e.g. Pasadena, CA"
          style={input}
          value={values.location || ''}
          onChange={e => onChange('location', e)}
        />
      </FormGroup>
      <FormGroup
        label="Engagement Dates"
        fieldId="engagement-dates"
        helperText="What is the duration?"
        isRequired
      >
        <InputGroup label="Engagement Duration">
          <InputGroupText
            style={input}
            component="label"
            htmlFor="engagement-duration"
          >
            <CalendarAltIcon />
          </InputGroupText>
          <TextInput
            isDisabled={
              !hasFeature(APP_FEATURES.writer) ||
              !!(values as Engagement).launch
            }
            name="start_date"
            id="start_date"
            type="date"
            aria-label="The start date."
            style={input}
            value={getFormattedDate(values.start_date) || ''}
            onChange={e => onChange('start_date', e)}
          />
          <TextInput
            isDisabled={!hasFeature(APP_FEATURES.writer)}
            name="end_date"
            id="end_date"
            type="date"
            style={input}
            aria-label="The end date"
            value={getFormattedDate(values.end_date) || ''}
            onChange={e => onChange('end_date', e)}
          />
        </InputGroup>
      </FormGroup>
      <FormGroup label="Description" fieldId="description">
        <TextArea
          disabled={!hasFeature(APP_FEATURES.writer)}
          name="description"
          id="description"
          style={input}
          aria-label="engagement description"
          placeholder="Description and notes for the Engagement"
          value={values.description || ''}
          onChange={e => onChange('description', e)}
        />
      </FormGroup>
    </Form>
  );
};
