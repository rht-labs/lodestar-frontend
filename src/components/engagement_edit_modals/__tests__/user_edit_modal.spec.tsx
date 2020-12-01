import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { UserEditModal } from '../user_edit_modal';
import { Engagement } from '../../../schemas/engagement';
import { EngagementFormConfig } from '../../../schemas/engagement_config';
import { TestStateWrapper } from '../../../common/test_state_wrapper';
import { FeatureToggleContext } from '../../../context/feature_context/feature_toggles';
import {
  EngagementContext,
  IEngagementContext,
} from '../../../context/engagement_context/engagement_context';

describe('Point of Contact edit modal', () => {
  test('matches snapshot', () => {
    expect(
      render(
        <EngagementContext.Provider
          value={
            {
              engagementFormConfig: EngagementFormConfig.fromFake(),
            } as IEngagementContext
          }
        >
          <UserEditModal
            onSave={() => {}}
            onClose={() => {}}
            isOpen={true}
            engagement={Engagement.fromFake(true)}
            onChange={() => {}}
          />
        </EngagementContext.Provider>
      )
    ).toMatchSnapshot();
  });

  test('When clicking the save button, the onSave method is called', async () => {
    const onSave = jest.fn();
    const { getByTestId } = render(
      <EngagementContext.Provider
        value={{ engagementFormConfig: EngagementFormConfig.fromFake() }}
      >
        <UserEditModal
          onSave={onSave}
          engagement={Engagement.fromFake(true)}
          onClose={() => {}}
          isOpen={true}
          onChange={() => {}}
        />
      </EngagementContext.Provider>
    );
    await fireEvent.click(getByTestId('user-edit-save'));
    expect(onSave).toHaveBeenCalled();
  });
  test('Clicking the addUser button calls onChange', async () => {
    const onChange = jest.fn();
    const { getByTestId } = render(
      <FeatureToggleContext.Provider
        value={{ features: ['reader', 'writer'], hasFeature: () => true }}
      >
        <UserEditModal
          onSave={() => {}}
          engagement={({ engagement_users: [] } as unknown) as Engagement}
          onClose={() => {}}
          isOpen={true}
          onChange={onChange}
        />
      </FeatureToggleContext.Provider>
    );
    await fireEvent.click(getByTestId('add-first-user'));
    expect(onChange).toHaveBeenCalledWith([
      {
        email: '',
        first_name: '',
        last_name: '',
        role: '',
      },
    ]);
  });
  test('Clicking the Save button calls onChange for removing users (if any)', async () => {
    const onChange = jest.fn();
    const { getByTestId } = render(
      <EngagementContext.Provider
        value={{ engagementFormConfig: EngagementFormConfig.fromFake() }}
      >
        <FeatureToggleContext.Provider
          value={{ features: ['reader', 'writer'], hasFeature: () => true }}
        >
          <UserEditModal
            onSave={() => {}}
            engagement={Engagement.fromFake(true)}
            isOpen={true}
            onClose={() => {}}
            onChange={onChange}
          />
        </FeatureToggleContext.Provider>
      </EngagementContext.Provider>
    );
    await fireEvent.click(getByTestId('user-edit-save'));
    expect(onChange).toHaveBeenCalled();
  });
});
