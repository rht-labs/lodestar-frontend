import React from 'react';
import { render } from '@testing-library/react';
import { Engagement } from '../../../schemas/engagement_schema';
import { EngagementSummaryCard } from '../engagement_summary_card';
import { OpenshiftClusterSummaryCard } from '../openshift_cluster_summary';
import { PointOfContactCard } from '../point_of_contact_card';
import { TestStateWrapper } from '../../../common/test_state_wrapper';
describe('Engagement summary card', () => {
  test('matches snapshot', () => {
    expect(
      render(<EngagementSummaryCard engagement={Engagement.staticFaked()} />)
    ).toMatchSnapshot();
  });
});

describe('Openshift Cluster Summary', () => {
  test('matches snapshot', () => {
    expect(
      render(
        <TestStateWrapper>
          <OpenshiftClusterSummaryCard engagement={Engagement.staticFaked()} />
        </TestStateWrapper>
      )
    ).toMatchSnapshot();
  });
});

describe('Point of Contact Card', () => {
  test('matches snapshot', () => {
    expect(
      render(<PointOfContactCard engagement={Engagement.staticFaked()} />)
    ).toMatchSnapshot();
  });
});
