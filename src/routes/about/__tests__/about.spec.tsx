import React from 'react';
import { About } from '../index';
import { TestStateWrapper } from '../../../common/test_state_wrapper';
import { render, act } from '@testing-library/react';

describe('About UI', () => {
  test('should match snapshot', async () => {
    await act(async () => {
      const rendered = render(
        <TestStateWrapper>
          <About />
        </TestStateWrapper>
      );
      expect(rendered).toMatchSnapshot();
    });
  });
});
