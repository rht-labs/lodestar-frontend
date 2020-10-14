import React from 'react';
import { MemoryRouter } from 'react-router';
import { render } from '@testing-library/react';
import { Header } from '../header';
import { TestStateWrapper } from '../../../common/test_state_wrapper';

describe('Notification UI ', () => {
  test('should match snapshot', () => {
    expect(
      render(
        <MemoryRouter>
          <TestStateWrapper>
            <Header isDrawerOpen={true} onNavToggle={() => null} />
          </TestStateWrapper>
        </MemoryRouter>
      )
    ).toMatchSnapshot();
  });
});
