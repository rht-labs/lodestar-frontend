import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { UserEditModal } from '../user_edit_modal';
import { Engagement } from '../../../schemas/engagement';
import { EngagementFormConfig } from '../../../schemas/engagement_config';
import { TestStateWrapper } from '../../../common/test_state_wrapper';

describe('Point of Contact edit modal', () => {
  test('matches snapshot', () => {
    expect(
      render(
        <UserEditModal
          onSave={() => {}}
          formOptions={EngagementFormConfig.fromFake()}
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
      <UserEditModal
        onSave={onSave}
        engagement={Engagement.fromFake(true)}
        formOptions={EngagementFormConfig.fromFake()}
        isOpen={true}
        onChange={() => {}}
      />
    );
    await fireEvent.click(getByTestId('user-edit-save'));
    expect(onSave).toHaveBeenCalled();
  });
  // test('Clicking the addUser button calls onChange', async () => {
  //   const onChange = jest.fn();
  //   const { getByTestId } = render(
  //     <TestStateWrapper>
  //       <UserEditModal
  //         onSave={() => {}}
  //         engagement={Engagement.fromFake(true)}
  //         formOptions={EngagementFormConfig.fromFake()}
  //         isOpen={true}
  //         onChange={onChange}
  //       />
  //     </TestStateWrapper>
  //   );
  //   await fireEvent.click(getByTestId('add-first-user'));
  //   expect(onChange).toHaveBeenCalled();
  // });
});
