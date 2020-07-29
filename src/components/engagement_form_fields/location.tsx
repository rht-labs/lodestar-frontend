import React from 'react';
import { useFeatures } from '../../context/feature_context/feature_hook';
import { APP_FEATURES } from '../../common/app_features';
import { FormGroup, TextInput } from '@patternfly/react-core';
import { Engagement } from '../../schemas/engagement';

interface LocationFormFieldProps {
  engagement: Engagement;
  onChange: (fieldName: string, value: any) => void;
}

export function LocationFormField(props: LocationFormFieldProps) {
  const { hasFeature } = useFeatures();
  return (
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
        value={props.engagement.location || ''}
        onChange={e => props.onChange('location', e)}
        data-cy={'location_field'}
      />
    </FormGroup>
  );
}
