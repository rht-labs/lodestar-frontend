import React from 'react';
import { render } from '@testing-library/react';
import { TestStateWrapper } from '../../../common/test_state_wrapper';
import { ActivityHistoryDetailsModal } from '../activity_history_details_modal';
import { Engagement } from '../../../schemas/engagement';

describe('Activity History Details Modal', () => {
  test('matches snapshot', () => {
    expect(
      render(
        <TestStateWrapper>
          <ActivityHistoryDetailsModal
            engagement={Engagement.fromFake(true)}
            isOpen={true}
          />
        </TestStateWrapper>
      )
    );
  });
});
