import React from 'react';
import { DataCard } from '../data_card';
import { Engagement } from '../../../schemas/engagement_schema';
import { Grid, GridItem } from '@patternfly/react-core';
import { useModalVisibility } from '../../../context/edit_modal_visibility_context/edit_modal_visibility_hook';
import { GitCommit } from '../../../schemas/git_commit';
import { ActivityHistoryLineItem } from '../../activity_history_line_item/activity_history_line_item';
import { ActivityHistoryDetailsModal } from '../../engagement_edit_modals/activity_history_details_modal';
import {EditButton} from "../../data_card_edit_button/data_card_edit_button";
export interface GitHistoryCardProps {
  engagement: Engagement;
}
const ACTIVITY_HISTORY_MODAL_KEY = 'activity_history';

export function ActivityHistoryCard({ engagement }: GitHistoryCardProps) {
  const { requestOpen, activeModalKey } = useModalVisibility();
  const { commits = [] } = engagement;
  return (
    <>
      <ActivityHistoryDetailsModal
        engagement={engagement}
        isOpen={activeModalKey?.includes(ACTIVITY_HISTORY_MODAL_KEY)}
      />
      <DataCard
        actionButton={() => (
          <EditButton
            onClick={() => requestOpen(ACTIVITY_HISTORY_MODAL_KEY)}
            text={'View More'}
          />
        )}
        title="Activity History"
      >
        <Grid hasGutter>
          <GridItem span={12}>
            <ActivityList
              commits={commits?.slice(
                0,
                commits?.length > 3 ? 3 : commits?.length
              )}
            />
          </GridItem>
        </Grid>
      </DataCard>
    </>
  );
}

function ActivityList({ commits }: { commits: GitCommit[] }) {
  if (commits) {
    return (
      <>
        {commits.map(commit => (
          <ActivityListItem commit={commit} />
        ))}
      </>
    );
  }
  return <div />;
}

function ActivityListItem({ commit }: { commit: GitCommit }) {
  if (!commit) {
    return <div />;
  } else {
    return <ActivityHistoryLineItem commit={commit} />;
  }
}
