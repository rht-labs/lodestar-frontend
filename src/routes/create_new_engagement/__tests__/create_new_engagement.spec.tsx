import React from 'react';
import { CreateNewEngagement } from '../create_new_engagement';
import { TestStateWrapper } from '../../../common/test_state_wrapper';
import { render, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

describe('Create New Engagement Route', () => {
  test('should match snapshot', async () => {
    await act(async () => {
      const rendered = render(
        <MemoryRouter>
          <TestStateWrapper>
            <CreateNewEngagement />
          </TestStateWrapper>
        </MemoryRouter>
      );
      expect(rendered).toMatchSnapshot();
    });
  });
});
