import React from 'react';
import { UserDropdown } from '../user_dropdown';
import { render } from '@testing-library/react';
import { TestStateWrapper } from '../../../common/test_state_wrapper';
import { act } from 'react-dom/test-utils';

describe('User Dropdown UI', () => {
  test('should match snapshot', async () => {
    await act(async () => {
      const rendered = render(
        <TestStateWrapper>
          <UserDropdown />
        </TestStateWrapper>
      );
      expect(rendered).toMatchSnapshot();
    });
  });
});
