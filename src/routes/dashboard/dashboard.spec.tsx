import React from 'react';
import {Dashboard} from '.';
import {act, render} from '@testing-library/react';
import {TestStateWrapper} from "../../common/test_state_wrapper";
import {MemoryRouter} from 'react-router';

describe('Dashboard Component', () => {
  test('matches snapshot', async () => {
    await act(async () => {
      expect(render(
        <MemoryRouter>
          <TestStateWrapper>
            <Dashboard/>
          </TestStateWrapper>
        </MemoryRouter>)
      ).toMatchSnapshot();
    });
  });
});
