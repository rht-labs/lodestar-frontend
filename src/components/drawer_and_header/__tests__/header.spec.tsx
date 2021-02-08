import React from 'react';
import { MemoryRouter } from 'react-router';
import { act, render, waitForDomChange } from '@testing-library/react';
import { Header } from '../header';
import { TestStateWrapper } from '../../../common/test_state_wrapper';

describe('Notification UI ', () => {
  test('should match snapshot', async () => {
    await act(async () => {
      const rendered = render(
        <MemoryRouter>
          <TestStateWrapper>
            <Header
              onNotificationClick={() => {}}
              isDrawerOpen={true}
              onNavToggle={() => null}
            />
          </TestStateWrapper>
        </MemoryRouter>
      );
      await waitForDomChange();
      expect(rendered).toMatchSnapshot();
    });
  });
});
