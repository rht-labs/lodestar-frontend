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
import { Engagement, EngagementUser } from '../../schemas/engagement';
import { EditModalTemplate } from '../../layout/edit_modal_template';
import { UserEditFields } from './user_edit_fields';

export interface UserEditModalProps {
  onChange: (users: EngagementUser[]) => void;
  engagement: Engagement;
  isOpen: boolean;
  onSave: (engagement: Engagement) => void;
  onClose: () => void;
}
export function UserEditModal({
  engagement,
  onChange,
  onClose = () => {},
  isOpen,
  onSave: propsOnSave,
}: UserEditModalProps) {
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
    deletedUsers?.forEach(userEmail => {
      engagement.engagement_users.splice(
        engagement.engagement_users.findIndex(user => {
          return user.email === userEmail;
        }),
        1
      );
    });
    onChange(engagement.engagement_users);
    setDeletedUsers([]);
  }

  const onSave = () => {
    removeUser();
    propsOnSave(engagement);
    onClose();
  };

  function addUser() {
    const newUser = { first_name: '', last_name: '', email: '', role: '' };
    engagement.engagement_users.push(newUser);
    onChange(engagement.engagement_users);
  }

  const areFieldsValid = engagement?.engagement_users?.reduce?.((acc, user) => {
    if(!acc) return acc;
    return validateEmail(user.email) && validateString(user.first_name) && validateString(user.last_name) && validateRole(user.role)
  }, true);

  return (
    <Modal
      variant={ModalVariant.large}
      isOpen={isOpen}
      onClose={onClose}
      title="Engagement Users"
    >
      <EditModalTemplate
        actions={
          <div>
            <Button
              data-testid="user-edit-cancel"
              onClick={onClose}
              data-cy={'cancel_edit_users'}
              style={{ margin: '1rem' }}
              variant="link"
            >
              Cancel
            </Button>
            <Button
              data-testid="user-edit-save"
              onClick={onSave}
              data-cy={'save_users'}
              style={{ margin: '1rem' }}
              isDisabled={!areFieldsValid}
            >
              Save
            </Button>
          </div>
        }
      >
        <div>
          {!engagement?.engagement_users?.length ? (
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
              validateEmail={validateEmail}
              validateString={validateString}
              validateRole={validateRole}
            />
          )}
        </div>
      </EditModalTemplate>
    </Modal>
  );
}

function validateEmail ( email: string ) {
  let regexEmail = /^.*@.*\..*$/;
  return regexEmail.test(email);
}

function validateString ( name: string ) {
  let regexString = /^[\w'\-,.]*[^0-9_!¡?÷?¿\\+=@#$%ˆ&*(){}|~<>;:[\]]+$/;
  return regexString.test(name);
}

function validateRole (role: string){
  return !(role === undefined || role === '');
}