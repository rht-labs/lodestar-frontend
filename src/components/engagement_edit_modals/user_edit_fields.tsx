import React, { useEffect } from 'react';
import {
  Form,
  Grid,
  GridItem,
  Card,
  CardBody,
  Flex,
  FlexItem,
  Button,
} from '@patternfly/react-core';
import { PlusIcon } from '@patternfly/react-icons';
import { APP_FEATURES } from '../../common/app_features';
import { Feature } from '../feature/feature';
import { UserRolesTooltip } from '../engagement_data_cards/user_card/user_roles_tooltip';
import {
  Table,
  TableBody,
  TableHeader,
  TableVariant,
} from '@patternfly/react-table';
import { FormManager } from '../../context/form_manager/form_manager';
import { EngagementUser } from '../../schemas/engagement';
import { UserRow } from './user_row';
import { useEngagementUser } from '../../context/engagement_context/engagement_context';
import { uuid } from 'uuidv4';

export interface UserEditFieldsProps {
  users: any;
  deletedUsers: string[];
  toggleDeleted: (user: EngagementUser) => void;
  validateEmail: (email: string) => boolean;
  validateString: (name: string) => boolean;
  validateRole: (role: string) => boolean;
}

export const UserEditFields = ({
  deletedUsers,
  toggleDeleted,
  validateEmail,
  validateString,
  validateRole,
}: UserEditFieldsProps) => {
  const { addUser, users } = useEngagementUser();
  const { registerField } = FormManager.useFormGroupManager();
  useEffect(() => registerField('engagement_users'), [registerField]);
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

  return (
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
                      const isDeleted = deletedUsers.indexOf(user.uuid) > -1;
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
  );
};
