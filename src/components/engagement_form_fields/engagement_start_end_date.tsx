import React, { useState, useEffect } from 'react';
import { Engagement } from '../../schemas/engagement';
import {
  FormGroup,
  InputGroup,
  InputGroupText,
  TextInput,
} from '@patternfly/react-core';
import { CalendarAltIcon, InfoCircleIcon } from '@patternfly/react-icons';
import { useFeatures } from '../../context/feature_context/feature_hook';
import { APP_FEATURES } from '../../common/app_features';
import { getFormattedDate } from '../../common/patternfly_date_adapter';
import { parse as parseDate, startOfToday } from 'date-fns';
import { addDays } from 'date-fns';
import { useValidation } from '../../context/validation_context/validation_hook';
import { max } from 'date-fns';
import { FormManager } from '../../context/form_manager/form_manager';
import { useEngagements } from '../../context/engagement_context/engagement_hook';
interface EngagementStartEndDateProps {
  engagement: Engagement;
  onChange: (fieldName: string, value: any) => void;
}

export function EngagementStartEndDateFormField({
  onChange,
  engagement,
}: EngagementStartEndDateProps) {
  const { engagementFormConfig } = useEngagements();
  const { validate, getValidationResult } = useValidation();
  const maxGracePeriodInDays: number =
    engagementFormConfig?.logistics_options?.env_grace_period_max ?? 0;
  const { start_date, end_date, archive_date } = engagement ?? {};

  const [startDateText, setStartDateText] = useState(
    getFormattedDate(start_date) || ''
  );
  const [endDateText, setEndDateText] = useState(
    getFormattedDate(end_date) || ''
  );
  const [archiveDateText, setArchiveDateText] = useState(
    getFormattedDate(archive_date) || ''
  );

  useEffect(() => {
    setEndDateText(getFormattedDate(end_date));
  }, [end_date]);
  useEffect(() => {
    setStartDateText(getFormattedDate(start_date));
  }, [start_date]);
  useEffect(() => {
    setArchiveDateText(getFormattedDate(archive_date));
  }, [archive_date]);

  const getMaxRetirementDate = () => {
    return maxGracePeriodInDays
      ? addDays(engagement?.end_date, maxGracePeriodInDays)
      : undefined;
  };

  const { hasFeature } = useFeatures();
  const { registerField } = FormManager.useFormGroupManager();
  useEffect(() => {
    registerField('start_date');
    registerField('end_date');
    registerField('archive_date');
  }, [registerField]);
  return (
    <>
      <FormGroup
        label="Start and End Dates"
        fieldId="engagement-dates"
        helperText="What is the duration?"
        helperTextInvalid={getValidationResult('end_date')}
        validated={
          getValidationResult('end_date').length > 0 ? 'error' : 'default'
        }
        isRequired
      >
        <InputGroup label="Engagement Duration">
          <InputGroupText component="label" htmlFor="engagement-duration">
            <CalendarAltIcon />
          </InputGroupText>
          <TextInput
            isDisabled={
              !hasFeature(APP_FEATURES.writer) || !!engagement?.launch
            }
            name="start_date"
            id="start_date"
            type="date"
            aria-label="The start date."
            value={startDateText}
            onChange={setStartDateText}
            onBlur={e =>
              onChange('start_date', parseDate(e.target.value, 'yyyy-MM-dd', 0))
            }
            data-cy={'start_date_input'}
          />
          <TextInput
            isDisabled={!hasFeature(APP_FEATURES.writer)}
            name="end_date"
            id="end_date"
            type="date"
            aria-label="The end date"
            value={endDateText}
            min={getFormattedDate(
              max([startOfToday(), engagement?.start_date ?? startOfToday()])
            )}
            onChange={setEndDateText}
            onBlur={e => {
              const parsedDate = parseDate(e.target.value, 'yyyy-MM-dd', 0);
              validate('end_date')(parsedDate);
              onChange('end_date', parsedDate);
            }}
            data-cy={'end_date_input'}
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
            id="archive_date"
            isDisabled={!hasFeature(APP_FEATURES.writer)}
            data-cy={'retirement_date_input'}
            type="date"
            name="archive_date"
            aria-label="Environment Retirement Date"
            value={archiveDateText}
            onBlur={e => {
              const parsedDate = parseDate(e.target.value, 'yyyy-MM-dd', 0);
              validate('archive_date')(parsedDate);
              onChange('archive_date', parsedDate);
            }}
            onChange={e => {
              setArchiveDateText(e);
            }}
            min={getFormattedDate(engagement?.end_date)}
            max={getFormattedDate(getMaxRetirementDate())}
          />
        </InputGroup>
      </FormGroup>
    </>
  );
}
