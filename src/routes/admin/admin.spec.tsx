import React from 'react';
import { Admin } from '.';
import { TestStateWrapper } from '../../common/test_state_wrapper';
import { render } from '@testing-library/react';

describe('Admin UI', () => {
  test('should match snapshot', () => {
    expect(
      render(
        <TestStateWrapper>
          <Admin></Admin>
        </TestStateWrapper>
      )
    ).toMatchSnapshot();
  });
});
