import React from 'react';
import { TestStateWrapper } from '../../../common/test_state_wrapper';
import { render } from '@testing-library/react';
import { EngagementListRoute } from '../engagement_list_route';
describe('Engagement list route', () => {
  test('matches snapshot', () => {
    expect(
      render(
        <TestStateWrapper>
          <EngagementListRoute />
        </TestStateWrapper>
      )
    ).toMatchSnapshot();
  });
});
