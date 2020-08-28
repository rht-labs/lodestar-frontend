import React from 'react';
import { render } from '@testing-library/react';
import { LaunchAlertBanner } from '../launch_alert_banner';
import { Engagement } from '../../../schemas/engagement';
import { MemoryRouter } from 'react-router';
describe('Engagement Navigation ', () => {
  test('matches the snapshot', () => {
    expect(
      render(
        <MemoryRouter>
          <LaunchAlertBanner
            isLaunchable
            engagement={Engagement.fromFake(true)}
            missingRequiredFields={[]}
            onLaunch={() => {}}
            requiredFields={[]}
          />
        </MemoryRouter>
      )
    ).toMatchSnapshot();
  });
});
