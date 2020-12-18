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
import {
  validateEmail,
  validateRole,
  validateString,
} from '../../common/user_validation';
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
  const { users, addUser, updateUser } = useEngagementUserManager();
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
  const deletedUsersFilter = (u: EngagementUser) =>
    !deletedUsers.includes(u.uuid);

  const onSave = () => {
    const newUsers = users.filter(deletedUsersFilter);
    propsOnSave(newUsers);
    onClose();
  };

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

  const areFieldsValid = engagement?.engagement_users
    ?.filter(deletedUsersFilter)
    ?.reduce?.((acc, user) => {
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
                        {users.map(user => {
                          const isDeleted =
                            deletedUsers.indexOf(user.uuid) > -1;
                          console.log(user.email);
                          return (
                            <UserRow
                              key={user.uuid}
                              user={user}
                              toggleDeleted={toggleDeleted}
                              onChange={updateUser}
                              isDeleted={isDeleted}
                            />
                          );
                        })}
                      </GridItem>
                      <Feature name={APP_FEATURES.writer}>
                        <Button
                          variant="secondary"
                          onClick={() =>
                            addUser({
                              uuid: uuid(),
                              first_name: '',
                              last_name: '',
                              role: '',
                            } as EngagementUser)
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
