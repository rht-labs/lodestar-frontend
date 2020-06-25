import React from 'react';
import { Dashboard } from '.';
import { render } from '@testing-library/react';
import {TestStateWrapper} from "../../common/test_state_wrapper";
import {MemoryRouter} from 'react-router';

describe('Dashboard Component', () => {
  test('matches snapshot', () => {
    expect(render(
      <MemoryRouter>
      <TestStateWrapper>
        <Dashboard/>
      </TestStateWrapper>
      </MemoryRouter>)
    ).toMatchSnapshot();
  });
});
