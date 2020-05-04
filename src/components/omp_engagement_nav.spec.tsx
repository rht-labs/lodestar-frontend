import React from 'react';
import { EngagementNav } from './omp_engagement_nav';
import { render } from 'enzyme';
import { TestStateWrapper } from '../common/test_state_wrapper';

describe('OMP Engagement Nav UI', () => {
  test('should match snapshot', () => {
    expect(
      render(
        <TestStateWrapper>
          <EngagementNav />
        </TestStateWrapper>
      )
    ).toMatchSnapshot();
  });
});
