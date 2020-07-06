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
import { parse as parseDate } from 'date-fns';
import { EngagementFormConfig } from '../../schemas/engagement_config';
import { addDays } from 'date-fns';
import { useValidation } from '../../context/validation_context/validation_hook';
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
  const { validate } = useValidation();
  const [retirementDateChanged, setRetirementDateChanged] = useState(false);
  const gracePeriodInDays: number =
    (props.formOptions?.['logistics_options']?.[
      'env_default_grace_period'
    ] as number) ?? 0;
  const maxGracePeriodInDays: number =
    (props.formOptions?.['logistics_options']?.[
      'env_grace_period_max'
    ] as number) ?? 0;

  const { end_date, archive_date } = engagement ?? {};

  const getRetirementDate = useCallback((): Date => {
    if (!end_date || !(end_date instanceof Date)) {
      return undefined;
    }
    if (end_date && archive_date < end_date) {
      const newDate = end_date;
      newDate.setDate(newDate.getUTCDate() + (gracePeriodInDays ?? 0));
      return newDate;
    }
    if (archive_date || retirementDateChanged) {
      return archive_date;
    } else if (end_date) {
      const newDate = end_date;
      newDate.setDate(newDate.getUTCDate() + (gracePeriodInDays ?? 0));
      return newDate;
    }
    return undefined;
  }, [end_date, archive_date, gracePeriodInDays, retirementDateChanged]);

  useEffect(() => {
    if (end_date) {
      onChange('archive_date', getRetirementDate());
    }
  }, [getRetirementDate, onChange, end_date]);

  const { hasFeature } = useFeatures();
  return (
    <>
      <FormGroup
        label="Start and End Dates"
        fieldId="engagement-dates"
        helperText="What is the duration?"
        isRequired
      >
        <InputGroup label="Engagement Duration">
          <InputGroupText component="label" htmlFor="engagement-duration">
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
            value={getFormattedDate(engagement?.start_date) || ''}
            onChange={e =>
              onChange('start_date', parseDate(e, 'yyyy-MM-dd', 0))
            }
          />
          <TextInput
            isDisabled={!hasFeature(APP_FEATURES.writer)}
            name="end_date"
            id="end_date"
            type="date"
            aria-label="The end date"
            value={getFormattedDate(engagement?.end_date) || ''}
            onChange={e => {
              const parsedDate = parseDate(e, 'yyyy-MM-dd', 0);
              validate('end_date')(parsedDate);
              onChange('end_date', parsedDate);
            }}
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
            value={getFormattedDate(getRetirementDate())}
            onChange={e => {
              setRetirementDateChanged(true);
              onChange('archive_date', parseDate(e, 'yyyy-MM-dd', 0));
            }}
            min={getFormattedDate(engagement?.end_date)}
            max={getFormattedDate(
              maxGracePeriodInDays
                ? addDays(engagement?.end_date, maxGracePeriodInDays)
                : undefined
            )}
          />
        </InputGroup>
      </FormGroup>
    </>
  );
}
