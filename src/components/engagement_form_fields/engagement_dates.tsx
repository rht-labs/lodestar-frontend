import React from 'react';
import { DatePicker, FormGroup, InputGroup } from '@patternfly/react-core';
import { InfoCircleIcon } from '@patternfly/react-icons';
import { useFeatures } from '../../context/feature_context/feature_hook';
import { APP_FEATURES } from '../../common/app_features';
import { getFormattedDate } from '../../common/patternfly_date_adapter';
import addDays from 'date-fns/addDays';
import { useValidation } from '../../context/validation_context/validation_hook';
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
          <DatePicker
            isDisabled={
              !hasFeature(APP_FEATURES.writer) || !!currentEngagement?.launch
            }
            name="start_date"
            id="start_date"
            aria-label="The start date."
            value={getFormattedDate(startDate)}
            onChange={(_, d) => {
              setStartDate(d);
            }}
            data-cy={'start_date_input'}
          />
          <DatePicker
            isDisabled={!hasFeature(APP_FEATURES.writer)}
            name="end_date"
            id="end_date"
            aria-label="Engagement End Date"
            value={getFormattedDate(endDate)}
            // min={getFormattedDate(
            //   max([startOfToday(), startDate ?? startOfToday()])
            // )}
            onChange={(_, d) => {
              validate('end_date')(d);
              setEndDate(d);
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
          <DatePicker
            id="archive_date"
            isDisabled={!hasFeature(APP_FEATURES.writer)}
            data-cy={'retirement_date_input'}
            type="date"
            name="archive_date"
            aria-label="Environment Retirement Date"
            value={getFormattedDate(archiveDate)}
            onChange={(_, d) => {
              validate('archive_date')(d);
              setArchiveDate(d);
            }}
            min={getFormattedDate(endDate)}
            max={getFormattedDate(getMaxRetirementDate())}
          />
        </InputGroup>
      </FormGroup>
    </>
  );
}
