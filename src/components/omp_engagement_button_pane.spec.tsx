import React from 'react';
import { OMPEngagementButtonPane } from './omp_engagement_button_pane';
import { render } from '@testing-library/react';
import { TestStateWrapper } from '../common/test_state_wrapper';

describe('Engagement Button Pane UI', () => {
  test('should match snapshot', () => {
    expect(
      render(
        <TestStateWrapper>
          <OMPEngagementButtonPane />
        </TestStateWrapper>
      )
    ).toMatchSnapshot();
  });
});
