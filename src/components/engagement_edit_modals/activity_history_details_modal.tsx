import React from 'react';
import {
  Modal,
  ModalVariant,
  Button,
  Grid,
  GridItem,
} from '@patternfly/react-core';
import { useModalVisibility } from '../../context/edit_modal_visibility_context/edit_modal_visibility_hook';
import { EditModalTemplate } from '../../layout/edit_modal_template';
import { GitCommit } from '../../schemas/git_commit';
import { ActivityHistoryLineItem } from '../activity_history_line_item/activity_history_line_item';
import { Engagement } from '../../schemas/engagement_schema';
export interface ActivityHistoryDetailsModalProps {
  isOpen: boolean;
  engagement: Engagement;
}
export function ActivityHistoryDetailsModal(
  props: ActivityHistoryDetailsModalProps
) {
  const { requestClose } = useModalVisibility();
  const anyActivities = (props.engagement?.commits?.length > 0);
  return (
    <Modal
      variant={ModalVariant.small}
      isOpen={props.isOpen}
      onClose={requestClose}
      title="Activity History"
    >
      <EditModalTemplate
        actions={
          <div>
            <Button onClick={requestClose}>Close</Button>
          </div>
        }
      >
        {
          anyActivities
          ? <DetailedActivityHistoryList commits={props.engagement?.commits} />
          : <p style={{fontStyle: 'italic'}}> There are no activities to display yet</p>
        }
      </EditModalTemplate>
    </Modal>
  );
}

function DetailedActivityHistoryList({ commits }: { commits: GitCommit[] }) {
  return (
    <Grid hasGutter>
      {commits?.map(commit => (
        <GridItem span={12}>
          <ActivityHistoryLineItem commit={commit} />
        </GridItem>
      ))}
    </Grid>
  );
}
