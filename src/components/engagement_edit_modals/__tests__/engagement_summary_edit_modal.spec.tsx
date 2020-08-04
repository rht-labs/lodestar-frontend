import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { EngagementSummaryEditModal } from '../engagement_summary_edit_modal';
import { Engagement } from '../../../schemas/engagement';

describe('Point of Contact edit modal', () => {
  test('matches snapshot', () => {
    expect(
      render(
        <EngagementSummaryEditModal
          onSave={() => {}}
          formOptions={{}}
          isOpen={true}
          engagement={Engagement.fromFake(true)}
          onChange={() => {}}
        />
      )
    ).toMatchSnapshot();
  });

  test('When clicking the save button, the onSave method is called', async () => {
    const onSave = jest.fn();
    const { getByTestId } = render(
      <EngagementSummaryEditModal
        onSave={onSave}
        engagement={Engagement.fromFake(true)}
        formOptions={{}}
        isOpen={true}
        onChange={() => {}}
      />
    );
    await fireEvent.click(getByTestId('engagement-summary-save'));
    expect(onSave).toHaveBeenCalled();
  });
});
