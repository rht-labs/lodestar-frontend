import React, { useState } from 'react';
import { CalendarAltIcon, InfoCircleIcon } from '@patternfly/react-icons';
import {
  Form,
  FormGroup,
  InputGroup,
  InputGroupText,
  TextArea,
  TextInput,
} from '@patternfly/react-core';
import { parse as parseDate, format as formatDate } from 'date-fns';
import { Engagement } from '../../../schemas/engagement_schema';
import { APP_FEATURES } from '../../../common/app_features';
import { useFeatures } from '../../../context/feature_toggles/feature_hook';
import { Logger } from '../../../utilities/logger';

export interface BasicInformationProps {
  engagement: Engagement;
  onChange: (fieldName: string, value: any) => void;
  formOptions: object;
}

export const BasicInformation = ({
  engagement,
  onChange,
  formOptions,
}: BasicInformationProps) => {
  const getFormattedDate = (inputDate: Date | string = '') => {
    // Dates must be formatted YYYY-MM-DD for patternfly date picker.
    // They are coming back inconsistently from the backend,
    // so this function checks to see if the date needs to be formatted,
    // then formats the date appropriately
    if (!inputDate) {
      return;
    }
    if (inputDate instanceof Date) {
      return formatDate(inputDate, 'yyyy-MM-dd');
    } else if (inputDate.indexOf('-') > -1) {
      return inputDate;
    } else {
      return parseDate(inputDate, 'yyyyMMdd', new Date());
    }
  };

  const tabContent: React.CSSProperties = {
    margin: 45,
  };

  const input: React.CSSProperties = {
    backgroundColor: '#EDEDED',
  };
  const { hasFeature } = useFeatures();

  const [editedByUser, setEditedByUser] = useState<{ [key: string]: boolean }>(
    {}
  );
  const gracePeriod =
    formOptions?.['basic-information']?.['env_grace_period'] ?? 0;
  const maxGracePeriod =
    formOptions?.['basic-information']?.['env_grace_period_max'];

  const getRetirementDate = (): string => {
    Logger.info('engageement end', engagement.end_date);
    if (editedByUser['archive_date']) {
      return formatDate(engagement.archive_date, 'yyyy-MM-dd');
    } else if (engagement.end_date instanceof Date) {
      const newDate = engagement.end_date ?? new Date();
      newDate.setDate(newDate.getUTCDate() + (gracePeriod ?? 0));
      return formatDate(newDate, 'yyyy-MM-dd');
    }
    return '';
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
          isDisabled={
            !hasFeature(APP_FEATURES.writer) ||
            !!(engagement as Engagement).mongo_id
          }
          type="text"
          id="customer_name"
          name="customer_name"
          placeholder="e.g. NASA"
          style={input}
          value={engagement.customer_name || ''}
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
            !!(engagement as Engagement).mongo_id
          }
          type="text"
          id="project_name"
          name="project_name"
          placeholder="e.g. Mars Probe"
          style={input}
          value={engagement.project_name || ''}
          onChange={e => onChange('project_name', e)}
        />
      </FormGroup>
      <FormGroup
        label="Location"
        fieldId="engagement-location"
        helperText="Where will this be held?"
      >
        <TextInput
          isDisabled={!hasFeature(APP_FEATURES.writer)}
          type="text"
          id="location"
          name="location"
          placeholder="e.g. Pasadena, CA"
          style={input}
          value={engagement.location || ''}
          onChange={e => onChange('location', e)}
        />
      </FormGroup>
      <FormGroup
        label="Start and End Dates"
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
              !!(engagement as Engagement).launch
            }
            name="start_date"
            id="start_date"
            type="date"
            aria-label="The start date."
            style={input}
            value={getFormattedDate(engagement.start_date) || ''}
            onChange={e =>
              onChange('start_date', parseDate(e, 'yyyy-MM-dd', 0))
            }
          />
          <TextInput
            isDisabled={!hasFeature(APP_FEATURES.writer)}
            name="end_date"
            id="end_date"
            type="date"
            style={input}
            aria-label="The end date"
            value={getFormattedDate(engagement.end_date) || ''}
            onChange={e => onChange('end_date', parseDate(e, 'yyyy-MM-dd', 0))}
          />
        </InputGroup>
      </FormGroup>
      <FormGroup
        label={
          <span
            title={`Modifying the retirement date will impact the total cost of the residency.\nAny changes to this field should be coordinated with Labs leadership.`}
          >
            Environment Retirement Date <InfoCircleIcon />
          </span>
        }
        fieldId="retirement"
      >
        <InputGroup label="Retirement Date">
          <TextInput
            type="date"
            name="archive_date"
            aria-label="Environment Retirement Date"
            value={getRetirementDate()}
            onChange={e => {
              if (!editedByUser['archive_date']) {
                setEditedByUser({ ...editedByUser, archive_date: true });
              }
              onChange('archive_date', e);
            }}
            style={input}
            min={engagement.end_date?.valueOf()}
            max={
              maxGracePeriod ? engagement.end_date + maxGracePeriod : undefined
            }
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
          value={engagement.description || ''}
          onChange={e => onChange('description', e)}
        />
      </FormGroup>
    </Form>
  );
};
