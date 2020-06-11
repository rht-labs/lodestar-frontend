import React from 'react';
import { About } from './index';
import { TestStateWrapper } from '../../common/test_state_wrapper';
import { render } from '@testing-library/react';
import { act } from '@testing-library/react';

describe('About UI', () => {
  test('should match snapshot', async () => {
    await act(async () => {
      expect(
        render(
          <TestStateWrapper>
            <About />
          </TestStateWrapper>
        )
      ).toMatchSnapshot();
    });
  });
});
