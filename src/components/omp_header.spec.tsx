import React from 'react';
import { OMPHeader } from './omp_header';
import { TestStateWrapper } from '../common/test_state_wrapper';
import { render } from 'enzyme';
import { MemoryRouter } from 'react-router';
import { act } from '@testing-library/react';
describe('OMP Header UI', () => {
  test('should match snapshot', async () => {
    await act(async () => {
      expect(
        render(
          <TestStateWrapper>
            <MemoryRouter>
              <OMPHeader />
            </MemoryRouter>
          </TestStateWrapper>
        )
      ).toMatchSnapshot();
    });
  });
});
