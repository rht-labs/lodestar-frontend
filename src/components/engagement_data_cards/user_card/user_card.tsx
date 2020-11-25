import React from 'react';
import { Engagement, EngagementUser } from '../../../schemas/engagement';
import { DataCard } from '../data_card';
import {Button, EmptyState, EmptyStateBody, EmptyStateIcon, Grid, GridItem, Title} from '@patternfly/react-core';
import { UserEditModal } from '../../engagement_edit_modals/user_edit_modal';
import { useModalVisibility } from '../../../context/edit_modal_visibility_context/edit_modal_visibility_hook';
import { EditButton } from '../../data_card_edit_button/data_card_edit_button';
import { UserList } from './user_list';
import {PlusIcon, RedhatIcon, UserIcon, UsersIcon} from '@patternfly/react-icons';
import { UserTableTitleIcon } from './user_table_title_icon';
import { useEngagements } from '../../../context/engagement_context/engagement_hook';

const USER_EDIT_MODAL_KEY = 'user_modal';

export interface UserCardProps {
  engagement: Partial<Engagement>;
  onChange: (fieldName: string, value: any) => void;
  onSave: (engagement: Engagement) => void;
  onClear: () => void;
}

export function UserCard({
  engagement,
  onSave,
  onClear,
  onChange,
}: UserCardProps) {
  const { requestOpen, activeModalKey, requestClose } = useModalVisibility();
  const onClose = () => {
    requestClose();
    onClear();
  };

  function onCancel() {
    requestClose();
    window.location.reload();
  }

  function addUser() {
    const newUser = { first_name: '', last_name: '', email: '', role: '' };
    engagement?.engagement_users?.push(newUser);
    onChange('engagement_users', engagement?.engagement_users);
  }

  function handleAddNewUserOrEdit() {
    if (engagement?.engagement_users?.length === 0) {
      addUser();
    }
    requestOpen(USER_EDIT_MODAL_KEY);
  }

  return (
    <>
      <UserEditModal
        onChange={users => onChange('engagement_users', users)}
        onSave={onSave}
        isOpen={activeModalKey === USER_EDIT_MODAL_KEY}
        onClose={onClose}
        engagement={engagement}
        onCancel={onCancel}
        addUser={addUser}
      />
      <DataCard
        actionButton={() => (
          <EditButton
            onClick={handleAddNewUserOrEdit}
            text={'Edit'}
            dataCy={'edit_user_button'}
          />
        )}
        title="Engagement Users"
      >
        <UserTable users={engagement?.engagement_users ?? []}
                   handleAddNewUserOrEdit={handleAddNewUserOrEdit}/>
      </DataCard>
    </>
  );
}

const redHatUsers = (
  <UserTableTitleIcon
    text={'Red Hat users'}
    icon={<RedhatIcon style={{ fontSize: '1.3rem', marginLeft: '1rem' }} />}
  />
);

const externalUsers = (
  <UserTableTitleIcon
    text={'External users'}
    icon={<UserIcon style={{ height: '50px', marginLeft: '1rem' }} />}
  />
);

const UserTable = ({
  users,
  handleAddNewUserOrEdit
}: {
  users: {
    first_name: string;
    last_name: string;
    email: string;
    role: string;
  }[];
  handleAddNewUserOrEdit: ()=> void;
}) => {
  const { engagementFormConfig } = useEngagements();
  const getRoleName = (userRole: string) =>
    engagementFormConfig?.user_options?.user_roles?.options?.find?.(
      role => role.value === userRole
    )?.label ?? userRole;
  const allRows: string[][] = [];
  users.map((user: EngagementUser) =>
    allRows.push([
      user.first_name + ' ' + user.last_name,
      user.email,
      getRoleName(user.role),
    ])
  );

  return (
    <>
      <div>
        {(users?.length > 0)
          ? (
              <Grid hasGutter>
                <GridItem span={10}>
                  <UserList
                    title={redHatUsers}
                    defaultRows={allRows.filter(
                      row => row[1]?.toLowerCase().indexOf('redhat.com') !== -1
                    )}
                  />
                  <UserList
                    title={externalUsers}
                    defaultRows={allRows.filter(
                      row => row[1]?.toLowerCase().indexOf('redhat.com') === -1
                    )}
                  />
                </GridItem>
              </Grid>
            )
          : ( <EmptyState>
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
                  data-testid={'add-first-user'}
                  data-cy={'add_new_user'}
                  style={{ margin: '1rem' }}
                  onClick={handleAddNewUserOrEdit}
                >
                  <PlusIcon style={{ fontSize: 'small' }} /> Add User
                </Button>
          </EmptyState>)
        }
      </div>
    </>
  );
};
