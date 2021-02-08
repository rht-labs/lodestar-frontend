import React from 'react';
import {
  render,
  act,
  fireEvent,
  waitForDomChange,
} from '@testing-library/react';

import { EngagementArtifactCard } from '../engagement_artifact_card/engagement_artifact_card';
import { Artifact } from '../../../schemas/engagement';
import { ModalVisibilityContext } from '../../../context/edit_modal_visibility_context/edit_modal_visibility_context';
import { FeatureToggleContext } from '../../../context/feature_context/feature_toggles';
import { APP_FEATURES } from '../../../common/app_features';
import { EngagementContext } from '../../../context/engagement_context/engagement_context';

describe('Engagement Artifact Card', () => {
  test('matches snapshot', () => {
    const timelineCard = render(
      <EngagementContext.Provider
        value={{
          currentEngagement: {
            artifacts: new Array(20)
              .fill(null)
              .map(() => Artifact.fromFake(true)),
          },
        }}
      >
        <EngagementArtifactCard />
      </EngagementContext.Provider>
    );
    expect(timelineCard).toMatchSnapshot();
  });
  test('clicking add an artifact opens the edit artifact modal', async () => {
    const requestOpen = jest.fn();
    const card = render(
      <FeatureToggleContext.Provider
        value={{
          hasFeature: () => true,
          features: [APP_FEATURES.writer, APP_FEATURES.reader],
        }}
      >
        <ModalVisibilityContext.Provider
          value={{ requestOpen, activeModalKey: '', requestClose: () => {} }}
        >
          <EngagementArtifactCard></EngagementArtifactCard>
        </ModalVisibilityContext.Provider>
      </FeatureToggleContext.Provider>
    );
    act(() => {
      fireEvent.click(card.getByTestId('add-artifact-button'));
      expect(requestOpen).toHaveBeenCalled();
    });
  });
  test('clicking the edit artifact dropdown item opens the edit artifact modal', async () => {
    const requestOpen = jest.fn();
    const card = render(
      <FeatureToggleContext.Provider
        value={{
          hasFeature: () => true,
          features: [APP_FEATURES.writer, APP_FEATURES.reader],
        }}
      >
        <ModalVisibilityContext.Provider
          value={{ requestOpen, activeModalKey: '', requestClose: () => {} }}
        >
          <EngagementContext.Provider
            value={{
              currentEngagement: { artifacts: [Artifact.fromFake(true)] },
            }}
          >
            <EngagementArtifactCard></EngagementArtifactCard>
          </EngagementContext.Provider>
        </ModalVisibilityContext.Provider>
      </FeatureToggleContext.Provider>
    );
    act(async () => {
      fireEvent.click(card.getByTestId('artifact-action-kebab'));
      await waitForDomChange({ container: card.container });
      fireEvent.click(card.getByTestId('artifact-edit-button'));
      expect(requestOpen).toHaveBeenCalled();
    });
  });
});
