import React from 'react';
import { Engagement, EngagementUser } from '../../../schemas/engagement';
import { DataCard } from '../data_card';
import {
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Grid,
  GridItem,
  Title,
  Tooltip,
} from '@patternfly/react-core';
import { UserEditModal } from '../../engagement_edit_modals/user_edit_modal';
import { useModalVisibility } from '../../../context/edit_modal_visibility_context/edit_modal_visibility_hook';
import { EditButton } from '../../data_card_edit_button/data_card_edit_button';
import { UserList } from './user_list';
import { RedhatIcon, UserIcon, UsersIcon } from '@patternfly/react-icons';
import { UserTableTitleIcon } from './user_table_title_icon';
import { useEngagement } from '../../../context/engagement_context/engagement_hook';
import { uuid } from 'uuidv4';
import { useEngagementUserManager } from '../../../context/engagement_context/engagement_context';
import { Feature } from '../../feature/feature';

const USER_EDIT_MODAL_KEY = 'user_modal';

export interface UserCardProps {
  engagement: Partial<Engagement>;
  onChange: (fieldName: string, value: any) => void;
  onSave: (engagement: Engagement) => void;
  onClear: () => void;
}

export function UserCard() {
  const { requestOpen, activeModalKey, requestClose } = useModalVisibility();
  const {
    clearCurrentChanges,
    currentChanges,
    currentEngagement: engagement,
    saveEngagement,
  } = useEngagement();
  const onClose = () => {
    requestClose();
    clearCurrentChanges();
  };
  const { addUser } = useEngagementUserManager();

  function handleAddNewUserOrEdit() {
    if (engagement?.engagement_users?.length === 0) {
      addUser({
        uuid: uuid(),
        first_name: '',
        last_name: '',
        role: '',
        reset: false,
        email: '',
      });
    }
    requestOpen(USER_EDIT_MODAL_KEY);
  }
  const onSave = (users: EngagementUser[]) => {
    saveEngagement({ ...currentChanges, engagement_users: users });
  };

  return (
    <>
      <UserEditModal
        onSave={onSave}
        isOpen={activeModalKey === USER_EDIT_MODAL_KEY}
        onClose={onClose}
        engagement={currentChanges as Engagement}
      />
      <DataCard
        actionButton={() => (
          <Tooltip
            content={
              'Update Engagement Users for both Red Hat and External users'
            }
          >
            <Feature name="writer">
              <EditButton
                onClick={handleAddNewUserOrEdit}
                text={'Edit'}
                dataCy={'edit_user_button'}
              />
            </Feature>
          </Tooltip>
        )}
        title="Engagement Users"
      >
        <UserTable users={engagement?.engagement_users ?? []} />
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

const UserTable = ({ users }: { users: EngagementUser[] }) => {
  const { engagementFormConfig } = useEngagement();
  const getRoleName = (userRole: string) =>
    engagementFormConfig?.user_options?.user_roles?.options?.find?.(
      role => role.value === userRole
    )?.label ?? userRole;

  const allRows = users.map((user: EngagementUser) => {
    return [
      user.first_name + ' ' + user.last_name,
      user.email,
      getRoleName(user.role),
    ];
  });

  return (
    <>
      <div>
        {users?.length > 0 ? (
          <Grid hasGutter>
            <GridItem>
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
        ) : (
          <EmptyState>
            <EmptyStateIcon
              icon={UsersIcon}
              style={{ fontSize: '34px', margin: '0' }}
            />
            <Title headingLevel="h5" size="md" style={{ marginTop: '0' }}>
              No Users Added
            </Title>
            <EmptyStateBody>
              <p>Click the 'Edit' button, to begin adding users</p>
            </EmptyStateBody>
          </EmptyState>
        )}
      </div>
    </>
  );
};
