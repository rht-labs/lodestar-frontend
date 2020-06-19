import React from 'react';
import { render } from '@testing-library/react';
import { EngagementTabView } from '../engagement_tab_view';
import { TestStateWrapper } from '../../../../common/test_state_wrapper';
import { MemoryRouter } from 'react-router';
describe('Engagement Tab View', () => {
  test('should match snapshot', () => {
    expect(
      render(
        <MemoryRouter>
          <TestStateWrapper>
            <EngagementTabView />
          </TestStateWrapper>
        </MemoryRouter>
      )
    ).toMatchSnapshot();
  });
});
