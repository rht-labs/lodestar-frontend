import React from 'react';
import { useFeatures } from '../../context/feature_context/feature_hook';
import { APP_FEATURES } from '../../common/app_features';
import { FormGroup, TextInput } from '@patternfly/react-core';
import { useEngagementFormField } from '../../context/engagement_context/engagement_context';

export function LocationFormField() {
  const { hasFeature } = useFeatures();
  const [location, setLocation] = useEngagementFormField('location');
  return (
    <FormGroup
      label="Location"
      fieldId="engagement-location"
      helperText="Where will this be held?"
    >
      <TextInput
        data-testid="location-field"
        isDisabled={!hasFeature(APP_FEATURES.writer)}
        type="text"
        id="location"
        name="location"
        placeholder="e.g. Pasadena, CA"
        value={location}
        onChange={setLocation}
        data-cy={'location_field'}
      />
    </FormGroup>
  );
}
