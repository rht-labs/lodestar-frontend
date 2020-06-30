import React, { useState } from 'react';
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
interface EngagementStartEndDateProps {
  engagement: Engagement;
  formOptions: EngagementFormConfig;
  onChange: (fieldName: string, value: any) => void;
}

export function EngagementStartEndDateFormField(
  props: EngagementStartEndDateProps
) {
  const [retirementDateChanged, setRetirementDateChanged] = useState(false);
  const gracePeriodInDays: number =
    (props.formOptions?.['logistics_options']?.[
      'env_default_grace_period'
    ] as number) ?? 0;
  const maxGracePeriodInDays: number =
    (props.formOptions?.['logistics_options']?.[
      'env_grace_period_max'
    ] as number) ?? 0;

  const getRetirementDate = (): string => {
    if (props.engagement?.archive_date || retirementDateChanged) {
      return getFormattedDate(props.engagement?.archive_date);
    } else if (props.engagement?.end_date) {
      const newDate = props.engagement?.end_date;
      newDate.setDate(newDate.getUTCDate() + (gracePeriodInDays ?? 0));
      return getFormattedDate(newDate);
    }
    return '';
  };
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
              !!(props.engagement as Engagement).launch
            }
            name="start_date"
            id="start_date"
            type="date"
            aria-label="The start date."
            value={getFormattedDate(props.engagement?.start_date) || ''}
            onChange={e =>
              props.onChange('start_date', parseDate(e, 'yyyy-MM-dd', 0))
            }
          />
          <TextInput
            isDisabled={!hasFeature(APP_FEATURES.writer)}
            name="end_date"
            id="end_date"
            type="date"
            aria-label="The end date"
            value={getFormattedDate(props.engagement?.end_date) || ''}
            onChange={e =>
              props.onChange('end_date', parseDate(e, 'yyyy-MM-dd', 0))
            }
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
              setRetirementDateChanged(true);
              props.onChange('archive_date', parseDate(e, 'yyyy-MM-dd', 0));
            }}
            min={getFormattedDate(props.engagement?.end_date)}
            max={getFormattedDate(
              maxGracePeriodInDays
                ? addDays(props.engagement?.end_date, maxGracePeriodInDays)
                : undefined
            )}
          />
        </InputGroup>
      </FormGroup>
    </>
  );
}
