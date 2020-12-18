import React from 'react';
import { render } from '@testing-library/react';
import { EngagementSummaryCard } from '../engagement_summary_card/engagement_summary_card';
import { HostingEnvironmentCard } from '../hosting_environment_card/hosting_environment_card';
import { PointOfContactCard } from '../point_of_contact_card/point_of_contact_card';
import { TestStateWrapper } from '../../../common/test_state_wrapper';
import { APP_FEATURES } from '../../../common/app_features';
import { FeatureToggles } from '../../../context/feature_context/feature_toggles';
import { DataCard } from '../data_card';
import { MemoryRouter } from 'react-router';

describe('Engagement summary card', () => {
  test('matches snapshot', () => {
    expect(
      render(
        <MemoryRouter>
          <TestStateWrapper>
            <EngagementSummaryCard />
          </TestStateWrapper>
        </MemoryRouter>
      )
    ).toMatchSnapshot();
  });
});

describe('OpenShift Cluster Summary', () => {
  test('matches snapshot', () => {
    expect(
      render(
        <TestStateWrapper>
          <HostingEnvironmentCard />
        </TestStateWrapper>
      )
    ).toMatchSnapshot();
  });
});

describe('Point of Contact Card', () => {
  test('matches snapshot', () => {
    expect(
      render(
        <TestStateWrapper>
          <PointOfContactCard />
        </TestStateWrapper>
      )
    ).toMatchSnapshot();
  });
});

describe('Edit button', () => {
  test('should not be rendered for reader role', async () => {
    const Component = () => (
      <MemoryRouter>
        <FeatureToggles features={[APP_FEATURES.reader]}>
          <DataCard
            title={'test'}
            children={<></>}
            actionButton={() => <div />}
            trailingIcon={() => <div />}
          />
        </FeatureToggles>
      </MemoryRouter>
    );

    const wrapper = render(<Component />);
    expect(wrapper.findByTestId('data-card-button')).toMatchObject({});
  });
});
