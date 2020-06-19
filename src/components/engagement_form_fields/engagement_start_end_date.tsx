import React from 'react';
import { Engagement } from '../../schemas/engagement_schema';
import {
  FormGroup,
  InputGroup,
  InputGroupText,
  TextInput,
} from '@patternfly/react-core';
import { CalendarAltIcon } from '@patternfly/react-icons';
import { useFeatures } from '../../context/feature_toggles/feature_hook';
import { APP_FEATURES } from '../../common/app_features';
import { getFormattedDate } from '../../common/patternfly_date_adapter';
import { parse as parseDate } from 'date-fns';
interface EngagementStartEndDateProps {
  engagement: Engagement;
  onChange: (fieldName: string, value: any) => void;
}

export function EngagementStartEndDateFormField(
  props: EngagementStartEndDateProps
) {
  const { hasFeature } = useFeatures();
  return (
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
  );
}
