import React from 'react';
import { Engagement } from '../../../schemas/engagement';
import { DataCard } from '../data_card';
import { Grid, GridItem } from '@patternfly/react-core';
import { UserEditModal } from '../../engagement_edit_modals/user_edit_modal';
import { EngagementFormConfig } from '../../../schemas/engagement_config';
import { useModalVisibility } from '../../../context/edit_modal_visibility_context/edit_modal_visibility_hook';
import { EditButton } from '../../data_card_edit_button/data_card_edit_button';
import { UserList } from "./user_list";
import { RedhatIcon, UserIcon } from "@patternfly/react-icons";
import { UserTableTitleIcon } from "./user_table_title_icon";

const USER_EDIT_MODAL_KEY = 'user_modal';

export interface UserCardProps {
  engagement: Engagement;
  onChange: (fieldName: string, value: any) => void;
  formOptions: EngagementFormConfig;
  onSave: (engagement: Engagement) => void;
}

export function UserCard({
  engagement,
  onSave,
  onChange,
  formOptions,
}: UserCardProps) {
  const { requestOpen, activeModalKey } = useModalVisibility();
  return (
    <>
      <UserEditModal
        onChange={onChange}
        onSave={onSave}
        formOptions={formOptions}
        isOpen={activeModalKey === USER_EDIT_MODAL_KEY}
        engagement={engagement}
      />
      <DataCard
        actionButton={() => (
          <EditButton
            onClick={() => requestOpen(USER_EDIT_MODAL_KEY)}
            text={'Edit'}
            dataCy={'edit_user_button'}
          />
        )}
        title="Engagement Users"
      >
        <UserTable users={engagement?.engagement_users}
                   formOptions={formOptions}
        />
      </DataCard>
    </>
  );
}

const redHatUsers =
  <UserTableTitleIcon text={ 'Red Hat users' }
                      icon={ <RedhatIcon style={{ fontSize: '1.3rem', marginLeft: '1rem' }}/> }/>;

const externalUsers =
  <UserTableTitleIcon text={ 'External users' }
                      icon={ <UserIcon style={{ height: '50px', marginLeft: '1rem' }}/> }/>;

const UserTable = ({
  users,
  formOptions
}: {
  users: {
    first_name: string;
    last_name: string;
    email: string;
    role: string;
  }[];
  formOptions: EngagementFormConfig;
}) => {

  const allRows: string[][] = [];
  users.map((user: any) => (
    allRows.push([user.first_name + " " + user.last_name, user.email, user.role])
  ));

  return (
    <Grid hasGutter>
      <GridItem span={10}>
          <UserList title={redHatUsers}
                    formOptions={formOptions}
                    defaultRows=
                      { allRows.filter( row => ( row[1].toLowerCase().indexOf("redhat.com")) !== -1 ) }
          />
          <UserList title={externalUsers}
                    formOptions={formOptions}
                    defaultRows=
                      { allRows.filter( row => ( row[1].toLowerCase().indexOf("redhat.com")) === -1 ) }
          />
      </GridItem>
    </Grid>
  );
};
