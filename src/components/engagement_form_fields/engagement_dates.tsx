import React, { useState, useEffect } from 'react';
import {
  FormGroup,
  InputGroup,
  InputGroupText,
  TextInput,
} from '@patternfly/react-core';
import { CalendarAltIcon, InfoCircleIcon } from '@patternfly/react-icons';
import { useFeatures } from '../../context/feature_context/feature_hook';
import { APP_FEATURES } from '../../common/app_features';
import { getFormattedDate, parseDatePickerDate } from '../../common/patternfly_date_adapter';
import startOfToday from 'date-fns/startOfToday';
import addDays from 'date-fns/addDays';
import { useValidation } from '../../context/validation_context/validation_hook';
import max from 'date-fns/max';
import { useEngagements } from '../../context/engagement_context/engagement_hook';
import {
  EngagementGroupings,
  useEngagementFormField,
} from '../../context/engagement_context/engagement_context';

export function EngagementStartEndDateFormField() {
  const { engagementFormConfig, currentEngagement } = useEngagements();
  const { validate, getValidationResult } = useValidation();
  const maxGracePeriodInDays: number =
    engagementFormConfig?.logistics_options?.env_grace_period_max ?? 0;
  const [startDate, setStartDate] = useEngagementFormField(
    'start_date',
    EngagementGroupings.engagementSummary
  );
  const [endDate, setEndDate] = useEngagementFormField(
    'end_date',
    EngagementGroupings.engagementSummary
  );
  const [archiveDate, setArchiveDate] = useEngagementFormField(
    'archive_date',
    EngagementGroupings.engagementSummary
  );

  const [startDateText, setStartDateText] = useState(
    getFormattedDate(startDate) || ''
  );
  const [endDateText, setEndDateText] = useState(
    getFormattedDate(endDate) || ''
  );
  const [archiveDateText, setArchiveDateText] = useState(
    getFormattedDate(archiveDate) || ''
  );

  useEffect(() => {
    setEndDateText(getFormattedDate(endDate));
  }, [endDate]);
  useEffect(() => {
    setStartDateText(getFormattedDate(startDate));
  }, [startDate]);
  useEffect(() => {
    setArchiveDateText(getFormattedDate(archiveDate));
  }, [archiveDate]);

  const getMaxRetirementDate = () => {
    return maxGracePeriodInDays
      ? addDays(endDate, maxGracePeriodInDays)
      : undefined;
  };

  const { hasFeature } = useFeatures();
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
              !hasFeature(APP_FEATURES.writer) || !!currentEngagement?.launch
            }
            name="start_date"
            id="start_date"
            type="date"
            aria-label="The start date."
            value={startDateText}
            onChange={setStartDateText}
            onBlur={e =>
              setStartDate(parseDatePickerDate(e.target.value))
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
              max([startOfToday(), startDate ?? startOfToday()])
            )}
            onChange={setEndDateText}
            onBlur={e => {
              const parsedDate = parseDatePickerDate(e.target.value)
              validate('end_date')(parsedDate);
              setEndDate(parsedDate);
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
              const parsedDate = parseDatePickerDate(e.target.value);
              validate('archive_date')(parsedDate);
              setArchiveDate(parsedDate);
            }}
            onChange={e => {
              setArchiveDateText(e);
            }}
            min={getFormattedDate(endDate)}
            max={getFormattedDate(getMaxRetirementDate())}
          />
        </InputGroup>
      </FormGroup>
    </>
  );
}
