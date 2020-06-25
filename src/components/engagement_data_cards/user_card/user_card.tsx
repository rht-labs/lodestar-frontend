import React from 'react';
import { Engagement } from '../../../schemas/engagement_schema';
import { DataCard } from '../data_card';
import { Grid, GridItem } from '@patternfly/react-core';
import { UserEditModal } from '../../engagement_edit_modals/user_edit_modal';
import { EngagementFormConfig } from '../../../schemas/engagement_config';
import { useModalVisibility } from '../../../context/edit_modal_visibility_context/edit_modal_visibility_hook';
import { TitledDataPoint } from '../../titled_data_point/titled_data_point';
import { EditButton } from '../../data_card_edit_button/data_card_edit_button';

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
          <EditButton onClick={() => requestOpen(USER_EDIT_MODAL_KEY)} />
        )}
        title="Engagement Users"
      >
        <Grid hasGutter>
          <UserGrid engagement={engagement} />
        </Grid>
      </DataCard>
    </>
  );
}

const UserGrid = ({ engagement }: { engagement: Engagement }) => {
  return (
    <>
      {engagement?.engagement_users?.map(user => (
        <UserTile user={user} />
      ))}
    </>
  );
};

const UserTile = ({
  user,
}: {
  user: {
    first_name: string;
    last_name: string;
    email: string;
  };
}) => {
  return (
    <GridItem span={3}>
      <TitledDataPoint title={`${user.first_name} ${user.last_name}`}>
        {user.email}
      </TitledDataPoint>
    </GridItem>
  );
};
