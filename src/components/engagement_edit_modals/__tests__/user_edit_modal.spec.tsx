import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { UserEditModal } from '../user_edit_modal';
import { Engagement } from '../../../schemas/engagement';
import { EngagementFormConfig } from '../../../schemas/engagement_config';
import {
  EngagementContext,
  IEngagementContext,
} from '../../../context/engagement_context/engagement_context';
import { mockEngagementFormConfig } from '../../../mocks/engagement_form_config_mocks';

describe('Point of Contact edit modal', () => {
  test('matches snapshot', () => {
    const addUser = jest.fn();
    expect(
      render(
        <EngagementContext.Provider
          value={
            {
              engagementFormConfig: mockEngagementFormConfig(),
            } as IEngagementContext
          }
        >
          <UserEditModal
            onSave={() => {}}
            onClose={() => {}}
            isOpen={true}
            engagement={Engagement.fromFake(true)}
            onChange={() => {}}
            addUser={addUser}
          />
        </EngagementContext.Provider>
      )
    ).toMatchSnapshot();
  });

  test('When clicking the save button, the onSave method is called', async () => {
    const onSave = jest.fn();
    const addUser = jest.fn();
    const { getByTestId } = render(
      <EngagementContext.Provider
        value={
          ({
            engagementFormConfig: mockEngagementFormConfig(),
          } as unknown) as IEngagementContext
        }
      >
        <UserEditModal
          onSave={onSave}
          engagement={Engagement.fromFake(true)}
          onClose={() => {}}
          isOpen={true}
          onChange={() => {}}
          addUser={addUser}
        />
      </EngagementContext.Provider>
    );
    await fireEvent.click(getByTestId('user-edit-save'));
    expect(onSave).toHaveBeenCalled();
  });
});
