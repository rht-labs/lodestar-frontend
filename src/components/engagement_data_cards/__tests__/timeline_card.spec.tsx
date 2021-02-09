import React from 'react';
import { render, act, fireEvent, screen } from '@testing-library/react';

import { EngagementArtifactCard } from '../engagement_artifact_card/engagement_artifact_card';
import { Artifact, Engagement } from '../../../schemas/engagement';
import { ModalVisibilityContext } from '../../../context/edit_modal_visibility_context/edit_modal_visibility_context';
import {
  FeatureToggleContext,
  IFeatureToggleContext,
} from '../../../context/feature_context/feature_toggles';
import { APP_FEATURES } from '../../../common/app_features';
import {
  EngagementContext,
  IEngagementContext,
} from '../../../context/engagement_context/engagement_context';

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
                .map(() => Artifact.fromFake(true)),
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
    act(() => {
      fireEvent.click(screen.getByTestId('add-artifact-button'));
      expect(requestOpen).toHaveBeenCalled();
    });
  });
  test('clicking the edit artifact dropdown item opens the edit artifact modal', async () => {
    const requestOpen = jest.fn();
    const e = Engagement.fromFake();
    render(
      <FeatureToggleContext.Provider
        value={
          ({
            hasFeature: () => true,
            features: [APP_FEATURES.writer, APP_FEATURES.reader],
          } as unknown) as IFeatureToggleContext
        }
      >
        <ModalVisibilityContext.Provider
          value={{ requestOpen, activeModalKey: '', requestClose: () => {} }}
        >
          <EngagementContext.Provider
            value={
              ({
                currentEngagement: {
                  ...e,
                  artifacts: [Artifact.fromFake(true)],
                },
              } as unknown) as IEngagementContext
            }
          >
            <EngagementArtifactCard></EngagementArtifactCard>
          </EngagementContext.Provider>
        </ModalVisibilityContext.Provider>
      </FeatureToggleContext.Provider>
    );
    await fireEvent.click(screen.getByTestId('artifact-action-kebab'));
    await fireEvent.click(screen.getByTestId('artifact-edit-button'));
    expect(requestOpen).toHaveBeenCalled();
  });
});
