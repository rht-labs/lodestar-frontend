import React from 'react';
import { TestStateWrapper } from '../../../common/test_state_wrapper';
import { act, fireEvent, render, RenderResult } from '@testing-library/react';
import { EngagementContext } from '../../../context/engagement_context/engagement_context';
import { EngagementEditableCategories } from '../engagement_editable_categories';
import { Engagement } from '../../../schemas/engagement';
import { FeatureToggles } from '../../../context/feature_context/feature_toggles';

describe('Engagement Editable Categories', () => {
  test('changing a category updates the engagement context', async () => {
    const onUpdateField = jest.fn();
    const onSave = jest.fn();
    let view: RenderResult;
    await act(async () => {
      view = render(
        <TestStateWrapper>
          <FeatureToggles features={['writer', 'reader']}>
            <EngagementContext.Provider
              value={{
                updateEngagementFormField: onUpdateField,
                fetchAvailableCategories: async () => [],
                saveEngagement: onSave,
                currentEngagement: {
                  ...Engagement.fromFake(true),
                  engagement_categories: [{ name: 'existing category' }],
                },
              }}
            >
              <EngagementEditableCategories></EngagementEditableCategories>
            </EngagementContext.Provider>
          </FeatureToggles>
        </TestStateWrapper>
      );
    });
    expect((await view.findAllByTestId('category-chip')).length).toBe(1);
    const editButton = await view.findByTestId('edit-icon');
    await fireEvent.click(editButton);
    const inputWrapper = await view.findByTestId('category-select-wrapper');
    const inputs = inputWrapper.getElementsByTagName('input');
    const input = inputs[0];
    await fireEvent.change(input, { target: { value: 'a category' } });
    const buttons = inputWrapper.getElementsByTagName('button');
    await fireEvent.click(buttons[1]);
    await fireEvent.click(await view.findByText('Create "a category"'));

    expect(onUpdateField).toHaveBeenCalled();

    await fireEvent.click(await view.findByTestId('save_categories'));

    expect(onSave).toHaveBeenCalled();
  });
});
