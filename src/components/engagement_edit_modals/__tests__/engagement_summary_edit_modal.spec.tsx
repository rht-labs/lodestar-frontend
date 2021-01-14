import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { EngagementSummaryEditModal } from '../engagement_summary_edit_modal';
import { Engagement } from '../../../schemas/engagement';
import MockDate from 'mockdate';
import { MemoryRouter } from 'react-router';
import { TestStateWrapper } from '../../../common/test_state_wrapper';

describe('Engagement Summary edit modal', () => {
  test('matches snapshot', () => {
    MockDate.set(new Date(2020, 8, 3));
    expect(
      render(
        <MemoryRouter>
          <TestStateWrapper>
            <EngagementSummaryEditModal
              onClose={() => {}}
              onSave={() => {}}
              isOpen={true}
              engagement={Engagement.fromFake(true)}
            />
          </TestStateWrapper>
        </MemoryRouter>
      )
    ).toMatchSnapshot();
    MockDate.reset();
  });

  test('When clicking the save button, the onSave method is called', async () => {
    const onSave = jest.fn();
    const { getByTestId } = render(
      <MemoryRouter>
        <TestStateWrapper>
          <EngagementSummaryEditModal
            onClose={() => {}}
            onSave={onSave}
            engagement={Engagement.fromFake(true)}
            isOpen={true}
          />
        </TestStateWrapper>
      </MemoryRouter>
    );
    await fireEvent.click(getByTestId('engagement-summary-save'));
    expect(onSave).toHaveBeenCalled();
  });
});
