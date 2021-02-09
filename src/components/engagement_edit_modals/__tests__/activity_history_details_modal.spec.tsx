import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { TestStateWrapper } from '../../../common/test_state_wrapper';
import { ActivityHistoryDetailsModal } from '../activity_history_details_modal';
import { Engagement } from '../../../schemas/engagement';
import { act } from 'react-dom/test-utils';

describe('Activity History Details Modal', () => {
  test('matches snapshot', async () => {
    await act(async () => {
      const el = (
        <TestStateWrapper>
          <ActivityHistoryDetailsModal
            engagement={Engagement.fromFake(true)}
            isOpen={true}
          />
        </TestStateWrapper>
      );
      const rendered = render(el);
      await waitFor(() =>
        expect(screen.getByTestId('activity_history_modal')).toBeDefined()
      );
      expect(rendered).toMatchSnapshot();
    });
  });
});
