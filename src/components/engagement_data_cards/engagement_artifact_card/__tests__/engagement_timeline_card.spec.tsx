import React from 'react';
import { act, fireEvent, render, RenderResult } from '@testing-library/react';
import { TestStateWrapper } from '../../../../common/test_state_wrapper';
import { MemoryRouter } from 'react-router';
import { EngagementArtifactCard } from '../engagement_artifact_card';
import { APP_FEATURES } from '../../../../common/app_features';
import { FeatureToggles } from '../../../../context/feature_context/feature_toggles';
import { IAuthContext } from '../../../../context/auth_context/auth_context';
import { IVersionContext } from '../../../../context/version_context/version_context';
import { EngagementContext } from '../../../../context/engagement_context/engagement_context';
import { EngagementFormConfig } from '../../../../schemas/engagement_config';
import { Artifact } from '../../../../schemas/engagement';

describe('Engagement timeline card', () => {
  test('should not be rendered for reader role', async () => {
    const Component = () => (
      <MemoryRouter>
        <FeatureToggles
          authContext={{} as IAuthContext}
          versionContext={{} as IVersionContext}
          features={[APP_FEATURES.reader]}
        >
          <EngagementArtifactCard />
        </FeatureToggles>
      </MemoryRouter>
    );

    const wrapper = render(<Component />);
    expect(wrapper.findByTestId('artifact-action-kebab')).toMatchObject({});
  });

  test('by default, when creating a new artifact, the first artifact type in the array of artifact types is selected', async () => {
    let view: RenderResult;
    const onUpdateField = jest.fn();
    await act(async () => {
      view = render(
        <TestStateWrapper>
          <EngagementContext.Provider
            value={{
              updateEngagementFormField: onUpdateField,
              engagementFormConfig: {
                ...EngagementFormConfig.fromFake(),
              },
            }}
          >
            <FeatureToggles features={['reader', 'writer']}>
              <EngagementArtifactCard />
            </FeatureToggles>
          </EngagementContext.Provider>
        </TestStateWrapper>
      );
    });
    const addButton = await view.findByTestId('add-artifact-button');
    expect(addButton).toBeDefined();
    await fireEvent.click(addButton);
    expect(onUpdateField).toHaveBeenCalledWith(
      'artifacts',
      [
        {
          id: expect.anything(),
          type: 'demo',
        } as Artifact,
      ],
      'Engagement Artifacts'
    );
  });
});
