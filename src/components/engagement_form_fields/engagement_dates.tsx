import React from 'react';
import {
  FormGroup,
  InputGroup,
  InputGroupText,
  TextInput,
} from '@patternfly/react-core';
import { CalendarAltIcon, InfoCircleIcon } from '@patternfly/react-icons';
import { useFeatures } from '../../context/feature_context/feature_hook';
import { APP_FEATURES } from '../../common/app_features';
import {
  formatUtcDateForPF,
  parseDatePickerDate,
} from '../../common/patternfly_date_adapter';
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
            data-testid={'start_date_input'}
            name="start_date"
            id="start_date"
            type="date"
            aria-label="The start date."
            value={formatUtcDateForPF(startDate) ?? ''}
            onChange={e => setStartDate(parseDatePickerDate(e))}
            data-cy={'start_date_input'}
          />
          <TextInput
            isDisabled={!hasFeature(APP_FEATURES.writer)}
            name="end_date"
            id="end_date"
            type="date"
            aria-label="The end date"
            data-testid="end_date_input"
            value={formatUtcDateForPF(endDate) ?? ''}
            min={formatUtcDateForPF(
              max([startOfToday(), startDate ?? startOfToday()])
            )}
            onChange={e => {
              if (e === '') {
                setEndDate(null);
              }
              const parsedDate = parseDatePickerDate(e);
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
            data-testid="archive_date_input"
            isDisabled={!hasFeature(APP_FEATURES.writer)}
            data-cy={'retirement_date_input'}
            type="date"
            name="archive_date"
            aria-label="Environment Retirement Date"
            value={formatUtcDateForPF(archiveDate)}
            onChange={e => {
              const parsedDate = parseDatePickerDate(e);
              validate('archive_date')(parsedDate);
              setArchiveDate(parsedDate);
            }}
            min={formatUtcDateForPF(endDate)}
            max={formatUtcDateForPF(getMaxRetirementDate())}
          />
        </InputGroup>
      </FormGroup>
    </>
  );
}
