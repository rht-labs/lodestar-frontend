import React from 'react';
import { act, render, RenderResult } from '@testing-library/react';
import { LaunchAlertBanner } from '../launch_alert_banner';
import { Engagement } from '../../../schemas/engagement';
import { MemoryRouter } from 'react-router';
import {FeatureToggles} from "../../../context/feature_context/feature_toggles";

describe('Engagement launch alert banner ', () => {
  const getLaunchBar = () =>
    render(
      <MemoryRouter>
        <FeatureToggles features={['reader', 'writer']}>
          <LaunchAlertBanner
            isLaunchable={true}
            engagement={Engagement.fromFake(true)}
            missingRequiredFields={[]}
            onLaunch={() => {}}
            requiredFields={[]}
          />
        </FeatureToggles>
      </MemoryRouter>
    );

  test('matches the snapshot',  () => {
    expect(
      getLaunchBar()
    ).toMatchSnapshot();
  });

  test('shows the delete button for launchable engagements', async () => {
    let view: RenderResult;
    await act(async () => {
      view = getLaunchBar();
    });
    expect(await view.findByTestId('delete-button')).toBeDefined();
  });

  test('do not show the delete button for non-launchable engagements', async () => {
    const getLaunchBarForNonLaunchableEngagement = () =>
      render(
      <MemoryRouter>
          <LaunchAlertBanner
            isLaunchable={false}
            engagement={Engagement.fromFake(true)}
            missingRequiredFields={[]}
            onLaunch={() => {}}
            requiredFields={[]}
          />
        </MemoryRouter>
      );

    let view: RenderResult;
    await act(async () => {
      view = getLaunchBarForNonLaunchableEngagement();
    });
    expect(await view.queryByTestId('delete-button')).toBeNull();
  });
});
