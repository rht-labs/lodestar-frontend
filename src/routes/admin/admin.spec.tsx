import React from 'react';
import { Admin } from '.';
import { TestStateWrapper } from '../../common/test_state_wrapper';

describe('Admin UI', () => {
  test('should match snapshot', () => {
    expect(
      <TestStateWrapper>
        <Admin></Admin>
      </TestStateWrapper>
    ).toMatchSnapshot();
  });
});
