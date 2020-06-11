import React from 'react';
import { render } from '@testing-library/react';
import { EngagementTabView } from '../engagement_tab_view';
import { TestStateWrapper } from '../../../../common/test_state_wrapper';
describe('Engagement Tab View', () => {
  test('should match snapshot', () => {
    expect(
      render(
        <TestStateWrapper>
          <EngagementTabView />
        </TestStateWrapper>
      )
    ).toMatchSnapshot();
  });
});
