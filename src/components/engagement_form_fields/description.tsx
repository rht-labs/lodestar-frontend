import React from 'react';
import { useFeatures } from '../../context/feature_context/feature_hook';
import { FormGroup, TextArea } from '@patternfly/react-core';
import { APP_FEATURES } from '../../common/app_features';
import {
  EngagementGroupings,
  useEngagementFormField,
} from '../../context/engagement_context/engagement_context';

export function DescriptionFormField() {
  const { hasFeature } = useFeatures();
  const [description, setDescription] = useEngagementFormField(
    'description',
    EngagementGroupings.engagementSummary
  );
  return (
    <FormGroup label="Description" fieldId="description">
      <TextArea
        disabled={!hasFeature(APP_FEATURES.writer)}
        name="description"
        id="description"
        resizeOrientation="vertical"
        aria-label="engagement description"
        placeholder="Description and notes for the Engagement"
        value={description}
        onChange={setDescription}
        data-cy={'description_field'}
      />
    </FormGroup>
  );
}
