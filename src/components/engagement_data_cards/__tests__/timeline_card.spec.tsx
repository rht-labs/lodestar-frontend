import React from 'react';
import {
  render,
  act,
  fireEvent,
  screen,
  waitFor,
} from '@testing-library/react';

import { EngagementArtifactCard } from '../engagement_artifact_card/engagement_artifact_card';
import { Artifact, Engagement } from '../../../schemas/engagement';
import { ModalVisibilityContext } from '../../../context/edit_modal_visibility_context/edit_modal_visibility_context';
import { FeatureToggleContext } from '../../../context/feature_context/feature_toggles';
import { APP_FEATURES } from '../../../common/app_features';
import {
  EngagementContext,
  IEngagementContext,
} from '../../../context/engagement_context/engagement_context';
import { mockEngagementArtifact } from '../../../mocks/engagement_mocks';

describe('Engagement Artifact Card', () => {
  test('matches snapshot', () => {
    const e = Engagement.fromFake();
    const timelineCard = render(
      <EngagementContext.Provider
        value={
          ({
            currentEngagement: {
              ...e,
              artifacts: new Array(20)
                .fill(null)
                .map(() => mockEngagementArtifact(true)),
            },
          } as unknown) as IEngagementContext
        }
      >
        <EngagementArtifactCard />
      </EngagementContext.Provider>
    );
    expect(timelineCard).toMatchSnapshot();
  });
  test('clicking add an artifact opens the edit artifact modal', async () => {
    const requestOpen = jest.fn();
    render(
      <EngagementContext.Provider
        value={{ updateEngagementFormField: () => {} }}
      >
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
      </EngagementContext.Provider>
    );
    fireEvent.click(screen.getByTestId('add-artifact-button'));
    expect(requestOpen).toHaveBeenCalled();
  });
  test('clicking the edit artifact dropdown item opens the edit artifact modal', async () => {
    await act(async () => {
      const requestOpen = jest.fn();
      render(
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
                currentEngagement: {
                  artifacts: [mockEngagementArtifact(true)],
                },
              }}
            >
              <EngagementArtifactCard />
            </EngagementContext.Provider>
          </ModalVisibilityContext.Provider>
        </FeatureToggleContext.Provider>
      );

      await waitFor(() =>
        expect(screen.getByTestId('artifact-table')).toBeDefined()
      );
      fireEvent.click(screen.getByTestId('artifact-action-kebab'));
      fireEvent.click(screen.getByTestId('artifact-edit-button'));
      expect(requestOpen).toHaveBeenCalled();
    });
  });
});
