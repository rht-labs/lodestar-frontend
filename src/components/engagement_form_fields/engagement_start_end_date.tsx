import React, { useState, useEffect, useCallback } from 'react';
import { Engagement } from '../../schemas/engagement_schema';
import {
  FormGroup,
  InputGroup,
  InputGroupText,
  TextInput,
} from '@patternfly/react-core';
import { CalendarAltIcon, InfoCircleIcon } from '@patternfly/react-icons';
import { useFeatures } from '../../context/feature_toggles/feature_hook';
import { APP_FEATURES } from '../../common/app_features';
import { getFormattedDate } from '../../common/patternfly_date_adapter';
import { parse as parseDate, startOfToday } from 'date-fns';
import { EngagementFormConfig } from '../../schemas/engagement_config';
import { addDays } from 'date-fns';
import { useValidation } from '../../context/validation_context/validation_hook';
import { max } from 'date-fns';
interface EngagementStartEndDateProps {
  engagement: Engagement;
  formOptions: EngagementFormConfig;
  onChange: (fieldName: string, value: any) => void;
}

export function EngagementStartEndDateFormField({
  onChange,
  engagement,
  ...props
}: EngagementStartEndDateProps) {
  const { validate, getValidationResult } = useValidation();
  const [retirementDateChanged, setRetirementDateChanged] = useState(false);
  const gracePeriodInDays: number =
    (props.formOptions?.['logistics_options']?.[
      'env_default_grace_period'
    ] as number) ?? 0;
  const maxGracePeriodInDays: number =
    (props.formOptions?.['logistics_options']?.[
      'env_grace_period_max'
    ] as number) ?? 0;
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

  const normalizeRetirementDate = useCallback(
    (retirementDate: Date) => {
      if (!end_date || !(end_date instanceof Date)) {
        return undefined;
      } else if (end_date && retirementDate && retirementDate <= end_date) {
        return addDays(end_date, gracePeriodInDays);
      } else if (
        retirementDate &&
        end_date &&
        retirementDate >= addDays(end_date, maxGracePeriodInDays)
      ) {
        return addDays(end_date, maxGracePeriodInDays);
      } else if (retirementDate || retirementDateChanged) {
        return retirementDate;
      } else if (end_date) {
        return addDays(end_date, gracePeriodInDays);
      }
      return startOfToday();
    },
    [end_date, gracePeriodInDays, maxGracePeriodInDays, retirementDateChanged]
  );

  // if the end date is less than the start date, set the end date to the start date
  useEffect(() => {
    if (end_date < start_date) {
      onChange('end_date', start_date);
    }
  }, [start_date, end_date, onChange]);

  // when the archive date or end date changes, check that it is within bounds. If not, update it
  useEffect(() => {
    const normalizedRetirementDate = normalizeRetirementDate(archive_date);

    if (archive_date?.valueOf() !== normalizedRetirementDate?.valueOf()) {
      onChange('archive_date', normalizedRetirementDate);
    }
  }, [archive_date, normalizeRetirementDate, onChange, end_date]);

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
              const retirementDate = normalizeRetirementDate(parsedDate);
              validate('archive_date')(retirementDate);
              onChange('archive_date', retirementDate);
            }}
            onChange={e => {
              setRetirementDateChanged(true);
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
