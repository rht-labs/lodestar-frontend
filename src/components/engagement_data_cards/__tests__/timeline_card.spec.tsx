import React from 'react';
import {
  render,
  act,
  fireEvent,
  waitForDomChange,
} from '@testing-library/react';

import { EngagementTimelineCard } from '../engagement_timeline_card/engagement_timeline_card';
import { Artifact } from '../../../schemas/engagement';
import { ModalVisibilityContext } from '../../../context/edit_modal_visibility_context/edit_modal_visibility_context';
import { FeatureToggleContext } from '../../../context/feature_context/feature_toggles';
import { APP_FEATURES } from '../../../common/app_features';

describe('Engagement Timeline Card', () => {
  test('matches snapshot', () => {
    const timelineCard = render(
      <EngagementTimelineCard
        onChangeArtifacts={() => {}}
        onSave={() => {}}
        artifacts={new Array(20).fill(null).map(() => Artifact.fromFake(true))}
      />
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
          <EngagementTimelineCard
            onSave={() => {}}
            onChangeArtifacts={() => {}}
            artifacts={[]}
          ></EngagementTimelineCard>
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
          <EngagementTimelineCard
            onSave={() => {}}
            onChangeArtifacts={() => {}}
            artifacts={[Artifact.fromFake(true)]}
          ></EngagementTimelineCard>
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
