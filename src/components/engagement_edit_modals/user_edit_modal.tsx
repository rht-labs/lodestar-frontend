import React from 'react';
import {
  Button,
  EmptyStateIcon,
  EmptyState,
  Title,
  EmptyStateBody,
  Modal,
  ModalVariant,
} from '@patternfly/react-core';

import {
  UsersIcon,
} from '@patternfly/react-icons';
import { Engagement } from '../../schemas/engagement';
import { EngagementFormConfig } from '../../schemas/engagement_config';
import { useModalVisibility } from '../../context/edit_modal_visibility_context/edit_modal_visibility_hook';
import { EditModalTemplate } from '../../layout/edit_modal_template';
import { UserEditFields } from "./user_edit_fields";

export interface UserEditModalProps {
  onChange: (fieldName: string, value: any) => void;
  formOptions: EngagementFormConfig;
  engagement: Engagement;
  isOpen: boolean;
  onSave: (engagement: Engagement) => void;
}
export function UserEditModal({
  engagement,
  formOptions,
  onChange,
  isOpen,
  onSave: propsOnSave,
}: UserEditModalProps) {
  const { requestClose } = useModalVisibility();
  const onSave = () => {
    propsOnSave(engagement);
    requestClose();
  };
  function addUser() {
    const newUser = { first_name: '', last_name: '', email: '', role: '' };
    engagement.engagement_users.push(newUser);
    onChange('user', engagement.engagement_users);
  }

  return (
    <Modal
      variant={ModalVariant.large}
      isOpen={isOpen}
      onClose={requestClose}
      title="Engagement Users"
    >
      <EditModalTemplate
        actions={
          <div>
            <Button
              data-testid="user-edit-save"
              onClick={onSave}
              data-cy={'save_users'}
            >
              Save
            </Button>
          </div>
        }
      >
        <div>
          {!engagement.engagement_users.length ? (
            <EmptyState>
              <EmptyStateIcon icon={UsersIcon} />
              <Title headingLevel="h4" size="lg">
                No Users Added
              </Title>
              <EmptyStateBody>
                <p>No users have been added to this engagement</p>
                <p>
                  Select the 'add user' button below, to begin adding users.
                </p>
              </EmptyStateBody>
              <Button
                variant="primary"
                onClick={addUser}
                data-testid={'add-first-user'}
                data-cy={'add_new_user'}
              >
                Add User
              </Button>
            </EmptyState>
          ) :
           <UserEditFields users={engagement.engagement_users}
                           onChange={onChange}
                           formOptions={formOptions}/>
          }
        </div>
      </EditModalTemplate>
    </Modal>
  );
}