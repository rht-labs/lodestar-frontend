import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { EngagementSummaryEditModal } from '../engagement_summary_edit_modal';
import { Engagement } from '../../../schemas/engagement';
import MockDate from 'mockdate';
import { MemoryRouter } from 'react-router';
import { TestStateWrapper } from '../../../common/test_state_wrapper';
import { act } from 'react-dom/test-utils';

describe('Engagement Summary edit modal', () => {
  test('matches snapshot', async () => {
    await act(async () => {
      MockDate.set(new Date(2020, 8, 3));
      const rendered = render(
        <TestStateWrapper>
          <EngagementSummaryEditModal
            onClose={() => {}}
            onSave={() => {}}
            isOpen={true}
            engagement={Engagement.fromFake(true)}
          />
        </TestStateWrapper>
      );
      await waitFor(() =>
        expect(
          screen.getByTestId('engagement_summary_edit_modal')
        ).toBeDefined()
      );
      expect(rendered).toMatchSnapshot();
      MockDate.reset();
    });
  });

  test('When clicking the save button, the onSave method is called', async () => {
    await act(async () => {
      const onSave = jest.fn();
      const { findByTestId } = render(
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
      await fireEvent.click(await findByTestId('engagement-summary-save'));
      expect(onSave).toHaveBeenCalled();
    });
  });
});
