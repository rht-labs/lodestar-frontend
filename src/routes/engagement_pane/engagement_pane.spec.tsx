import React from 'react';
import { render } from 'enzyme';
import { EngagementPane } from './index';
import { ServiceProvider } from '../../context/service_provider/service_provider_context';
import { EngagementProvider } from '../../context/engagement_context/engagement_context';

test('Engagement Pane renders correctly', () => {
  const component = render(
    <ServiceProvider shouldUseFaked={true}>
      <EngagementProvider>
        <EngagementPane />
      </EngagementProvider>
    </ServiceProvider>
  );
  expect(component).toMatchSnapshot();
});
