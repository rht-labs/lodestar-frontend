import React from 'react';
import { TestStateWrapper } from '../../../common/test_state_wrapper';
import { act, render } from '@testing-library/react';
import { EngagementListRoute } from '../engagement_list_route';
import { MemoryRouter } from 'react-router';
describe('Engagement list route', () => {
  test('matches snapshot', async () => {
    await act(async () => {
      expect(
        render(
          <MemoryRouter>
            <TestStateWrapper>
              <EngagementListRoute />
            </TestStateWrapper>
          </MemoryRouter>
        )
      ).toMatchSnapshot();
    })
  });
});
