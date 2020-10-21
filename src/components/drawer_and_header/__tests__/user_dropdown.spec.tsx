import React from 'react';
import { UserDropdown } from '../user_dropdown';
import { render } from '@testing-library/react';
import { TestStateWrapper } from '../../../common/test_state_wrapper';

describe('User Dropdown UI', () => {
  test('should match snapshot', () => {
    expect(
      render(
        <TestStateWrapper>
          <UserDropdown />
        </TestStateWrapper>
      )
    ).toMatchSnapshot();
  });
});
