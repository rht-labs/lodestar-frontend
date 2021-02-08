import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { EngagementArtifactCard } from '../engagement_artifact_card';
import { APP_FEATURES } from '../../../../common/app_features';
import { FeatureToggles } from '../../../../context/feature_context/feature_toggles';

describe('Engagement timeline card', () => {
  test('should not be rendered for reader role', async () => {
    const Component = () => (
      <MemoryRouter>
        <FeatureToggles features={[APP_FEATURES.reader]}>
          <EngagementArtifactCard />
        </FeatureToggles>
      </MemoryRouter>
    );

    const wrapper = render(<Component />);
    expect(wrapper.findByTestId('artifact-action-kebab')).toMatchObject({});
  });
});
