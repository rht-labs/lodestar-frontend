import React, { useState } from 'react';
import {
  Button,
  EmptyStateIcon,
  EmptyState,
  Title,
  EmptyStateBody,
  Modal,
  ModalVariant,
} from '@patternfly/react-core';

import { PlusIcon, UsersIcon } from '@patternfly/react-icons';
import { Engagement } from '../../schemas/engagement';
import { EngagementFormConfig } from '../../schemas/engagement_config';
import { useModalVisibility } from '../../context/edit_modal_visibility_context/edit_modal_visibility_hook';
import { EditModalTemplate } from '../../layout/edit_modal_template';
import { UserEditFields } from './user_edit_fields';

export interface UserEditModalProps {
  onChange: (fieldName: string, value: any) => void;
  engagementFormConfig: EngagementFormConfig;
  engagement: Engagement;
  isOpen: boolean;
  onSave: (engagement: Engagement) => void;
}
export function UserEditModal({
  engagement,
  engagementFormConfig,
  onChange,
  isOpen,
  onSave: propsOnSave,
}: UserEditModalProps) {
  const { requestClose } = useModalVisibility();
  const [deletedUsers, setDeletedUsers] = useState<string[]>([]);

  function toggleDeleted(email: string) {
    if (deletedUsers.indexOf(email) < 0) {
      setDeletedUsers([...deletedUsers, email]);
    } else {
      const newDeletedUsers = [...deletedUsers];
      newDeletedUsers.splice(deletedUsers.indexOf(email), 1);
      setDeletedUsers(newDeletedUsers);
    }
  }

  function removeUser() {
    deletedUsers?.map(userEmail => {
      engagement.engagement_users.splice(
        engagement.engagement_users.findIndex(user => {
          return user.email === userEmail;
        }),
        1
      );
    });
    onChange('user', engagement.engagement_users);
    setDeletedUsers([]);
  }

  const onSave = () => {
    removeUser();
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
              style={{ margin: '1rem' }}
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
                variant="secondary"
                onClick={addUser}
                data-testid={'add-first-user'}
                data-cy={'add_new_user'}
                style={{ margin: '1rem' }}
              >
                <PlusIcon style={{ fontSize: 'small' }} /> Add User
              </Button>
            </EmptyState>
          ) : (
            <UserEditFields
              users={engagement.engagement_users}
              onChange={onChange}
              toggleDeleted={toggleDeleted}
              deletedUsers={deletedUsers}
              addUser={addUser}
              engagementFormConfig={engagementFormConfig}
            />
          )}
        </div>
      </EditModalTemplate>
    </Modal>
  );
}

