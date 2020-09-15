import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { EngagementSummaryEditModal } from '../engagement_summary_edit_modal';
import { Engagement } from '../../../schemas/engagement';
import MockDate from 'mockdate';

describe('Engagement Summary edit modal', () => {
  test('matches snapshot', () => {
    MockDate.set(new Date(2020, 8, 3));
    expect(
      render(
        <EngagementSummaryEditModal
          onSave={() => {}}
          engagementFormConfig={{}}
          isOpen={true}
          engagement={Engagement.fromFake(true)}
          onChange={() => {}}
        />
      )
    ).toMatchSnapshot();
    MockDate.reset();
  });

  test('When clicking the save button, the onSave method is called', async () => {
    const onSave = jest.fn();
    const { getByTestId } = render(
      <EngagementSummaryEditModal
        onSave={onSave}
        engagement={Engagement.fromFake(true)}
        engagementFormConfig={{}}
        isOpen={true}
        onChange={() => {}}
      />
    );
    await fireEvent.click(getByTestId('engagement-summary-save'));
    expect(onSave).toHaveBeenCalled();
  });
});
