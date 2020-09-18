import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { EngagementSummaryEditModal } from '../engagement_summary_edit_modal';
import { Engagement } from '../../../schemas/engagement';
import MockDate from 'mockdate';
import { FormManager } from '../../../context/form_manager/form_manager';

describe('Engagement Summary edit modal', () => {
  test('matches snapshot', () => {
    MockDate.set(new Date(2020, 8, 3));
    expect(
      render(
        <FormManager.Manager>
          <FormManager.Group groupName="test">
            <EngagementSummaryEditModal
              onSave={() => {}}
              engagementFormConfig={{}}
              isOpen={true}
              engagement={Engagement.fromFake(true)}
              onChange={() => {}}
            />
          </FormManager.Group>
        </FormManager.Manager>
      )
    ).toMatchSnapshot();
    MockDate.reset();
  });

  test('When clicking the save button, the onSave method is called', async () => {
    const onSave = jest.fn();
    const { getByTestId } = render(
      <FormManager.Manager>
        <FormManager.Group groupName="test">
          <EngagementSummaryEditModal
            onSave={onSave}
            engagement={Engagement.fromFake(true)}
            engagementFormConfig={{}}
            isOpen={true}
            onChange={() => {}}
          />
        </FormManager.Group>
      </FormManager.Manager>
    );
    await fireEvent.click(getByTestId('engagement-summary-save'));
    expect(onSave).toHaveBeenCalled();
  });
});
