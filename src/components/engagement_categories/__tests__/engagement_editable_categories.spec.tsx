import React from 'react';
import { TestStateWrapper } from '../../../common/test_state_wrapper';
import {
  act,
  fireEvent,
  render,
  RenderResult,
  screen,
  waitFor,
} from '@testing-library/react';
import { EngagementContext } from '../../../context/engagement_context/engagement_context';
import { EngagementEditableCategories } from '../engagement_editable_categories';
import { Engagement } from '../../../schemas/engagement';
import { FeatureToggles } from '../../../context/feature_context/feature_toggles';
import { CategoryContext } from '../../../context/category_context/category_context';

describe('Engagement Editable Categories', () => {
  test('changing a category updates the engagement context', async () => {
    const onUpdateField = jest.fn();
    const onSave = jest.fn();
    let view: RenderResult;
    act(async () => {
      view = render(
        <TestStateWrapper>
          <FeatureToggles features={['writer', 'reader']}>
            <EngagementContext.Provider
              value={{
                updateEngagementFormField: onUpdateField,
                saveEngagement: onSave,
                currentEngagement: {
                  ...Engagement.fromFake(true),
                  engagement_categories: [{ name: 'existing category' }],
                },
              }}
            >
              <CategoryContext.Provider
                value={{ fetchCategories: async () => [], categories: [] }}
              >
                <EngagementEditableCategories></EngagementEditableCategories>
              </CategoryContext.Provider>
            </EngagementContext.Provider>
          </FeatureToggles>
        </TestStateWrapper>
      );
    });
    expect((await view.findAllByTestId('category-chip')).length).toBe(1);
    const editButton = await view.findByTestId('edit-icon');
    fireEvent.click(editButton);
    const inputWrapper = await view.findByTestId('category-select-wrapper');
    const inputs = inputWrapper.getElementsByTagName('input');
    const input = inputs[0];
    fireEvent.click(input);
    await waitFor(() => view.getByText('No results found'));
    fireEvent.change(input, { target: { value: 'a category' } });
    await waitFor(() => view.getByText('Create "a category"'));
    fireEvent.click(await view.findByText('Create "a category"'));

    expect(onUpdateField).toHaveBeenCalled();
    screen.debug();

    fireEvent.click(await view.findByTestId('save_categories'));

    expect(onSave).toHaveBeenCalled();
  });
});
