import React from 'react';
import { render } from '@testing-library/react';
import { LaunchAlertBanner } from '../launch_alert_banner';
import { Engagement } from '../../../schemas/engagement';
describe('Engagement Navigation ', () => {
  test('matches the snapshot', () => {
    expect(
      render(
        <LaunchAlertBanner
          isLaunchable
          engagement={Engagement.fromFake(true)}
          missingRequiredFields={[]}
          onLaunch={() => {}}
          requiredFields={[]}
        />
      )
    ).toMatchSnapshot();
  });
});
