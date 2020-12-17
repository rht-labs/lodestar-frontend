import React, { useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  Flex,
  FlexItem,
  Form,
  Grid,
  GridItem,
  Modal,
  ModalVariant,
} from '@patternfly/react-core';
import { UserRolesTooltip } from '../engagement_data_cards/user_card/user_roles_tooltip';
import { Engagement, EngagementUser } from '../../schemas/engagement';
import { EditModalTemplate } from '../../layout/edit_modal_template';
import {
  Table,
  TableBody,
  TableHeader,
  TableVariant,
} from '@patternfly/react-table';
import { UserRow } from './user_row';
import { Feature } from '../feature/feature';
import { APP_FEATURES } from '../../common/app_features';
import { uuid } from 'uuidv4';
import { PlusIcon } from '@patternfly/react-icons';
import { useEngagementUserManager } from '../../context/engagement_context/engagement_context';

export interface UserEditModalProps {
  onChange: (users: EngagementUser[]) => void;
  engagement: Engagement;
  isOpen: boolean;
  onSave: (users: EngagementUser[]) => void;
  onClose: () => void;
  addUser: () => void;
}
export function UserEditModal({
  engagement,
  onClose = () => {},
  isOpen,
  onSave: propsOnSave,
}: UserEditModalProps) {
  const [deletedUsers, setDeletedUsers] = useState<string[]>([]);

  function toggleDeleted(user: EngagementUser) {
    if (deletedUsers.indexOf(user.uuid) < 0) {
      setDeletedUsers([...deletedUsers, user.uuid]);
    } else {
      const newDeletedUsers = [...deletedUsers];
      newDeletedUsers.splice(deletedUsers.indexOf(user.uuid), 1);
      setDeletedUsers(newDeletedUsers);
    }
  }

  const onSave = () => {
    const users = engagement.engagement_users.filter(
      u => !deletedUsers.includes(u.uuid)
    );
    propsOnSave(users);
    onClose();
  };

  const { addUser, users } = useEngagementUserManager();
  const columns = [
    { title: 'Email' },
    { title: 'First name' },
    { title: 'Last name' },
    {
      title: (
        <>
          Role
          <UserRolesTooltip />
        </>
      ),
    },
  ];

  const handleUserEdit = (editedUser: EngagementUser) => {
    const editedUserIndex = users.findIndex(
      user => user.uuid === editedUser.uuid
    );
    users.splice(editedUserIndex, 1, editedUser);
  };
  const areFieldsValid = engagement?.engagement_users?.reduce?.((acc, user) => {
    if (!acc) return acc;
    return (
      validateEmail(user.email) &&
      validateString(user.first_name) &&
      validateString(user.last_name) &&
      validateRole(user.role)
    );
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
        <>
          <Flex direction={{ default: 'column' }}>
            <FlexItem>
              <Card isFlat style={{ borderWidth: 0, padding: '1rem' }}>
                <CardBody>
                  <Table
                    aria-label="Engagement users table"
                    variant={TableVariant.compact}
                    borders={true}
                    cells={columns}
                    rows={[]}
                  >
                    <TableHeader />
                    <TableBody />
                  </Table>
                  <Grid hasGutter>
                    <Form>
                      <GridItem>
                        {users.map((user: any) => {
                          const isDeleted =
                            deletedUsers.indexOf(user.uuid) > -1;
                          return (
                            <UserRow
                              key={user.uuid}
                              user={user}
                              toggleDeleted={toggleDeleted}
                              onChange={handleUserEdit}
                              validateEmail={validateEmail}
                              validateRole={validateRole}
                              validateString={validateString}
                              isDeleted={isDeleted}
                            />
                          );
                        })}
                      </GridItem>
                      <Feature name={APP_FEATURES.writer}>
                        <Button
                          variant="secondary"
                          onClick={() =>
                            addUser({ uuid: uuid() } as EngagementUser)
                          }
                          data-testid={'add-first-user'}
                          data-cy={'add_new_user'}
                        >
                          <PlusIcon style={{ fontSize: 'small' }} /> Add User
                        </Button>
                      </Feature>
                    </Form>
                  </Grid>
                </CardBody>
              </Card>
            </FlexItem>
          </Flex>
        </>
      </EditModalTemplate>
    </Modal>
  );
}

function validateEmail(email: string) {
  // eslint-disable-next-line
  let regexEmail = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;
  return regexEmail.test(email);
}

function validateString(name: string) {
  let regexString = /^[\w'\-,.]*[^0-9_!¡?÷?¿\\+=@#$%ˆ&*(){}|~<>;:[\]]+$/;
  return regexString.test(name);
}

function validateRole(role: string) {
  return !(role === undefined || role === '');
}
