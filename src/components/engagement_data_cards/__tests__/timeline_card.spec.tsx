import React from 'react';
import {
  render,
  act,
  fireEvent,
  waitForDomChange,
} from '@testing-library/react';

import { EngagementTimelineCard } from '../engagement_timeline_card/engagement_timeline_card';
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
        <EngagementTimelineCard />
      </EngagementContext.Provider>
    );
    expect(timelineCard).toMatchSnapshot();
  });
  test('clicking add an artifact opens the edit artifact modal', async () => {
    const requestOpen = jest.fn();
    const card = render(
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
          <EngagementTimelineCard></EngagementTimelineCard>
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
    const e = Engagement.fromFake();
    const card = render(
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
            <EngagementTimelineCard></EngagementTimelineCard>
          </EngagementContext.Provider>
        </ModalVisibilityContext.Provider>
      </FeatureToggleContext.Provider>
    );
    await act(async () => {
      fireEvent.click(card.getByTestId('artifact-action-kebab'));
      await waitForDomChange({ container: card.container });
      fireEvent.click(card.getByTestId('artifact-edit-button'));
      expect(requestOpen).toHaveBeenCalled();
    });
  });
});
