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
import { useEngagements } from '../../context/engagement_context/engagement_hook';
import { GitCommit } from '../../schemas/git_commit';
import { ActivityHistoryLineItem } from '../activity_history_line_item/activity_history_line_item';
export interface ActivityHistoryDetailsModalProps {
  isOpen: boolean;
}
export function ActivityHistoryDetailsModal(
  props: ActivityHistoryDetailsModalProps
) {
  const { requestClose } = useModalVisibility();
  const { activeEngagement } = useEngagements();

  return (
    <Modal
      variant={ModalVariant.large}
      isOpen={props.isOpen}
      onClose={requestClose}
    >
      <EditModalTemplate
        actions={
          <div>
            <Button onClick={requestClose}>Close</Button>
          </div>
        }
        title="Activity History"
      >
        <DetailedActivityHistoryList commits={activeEngagement?.commits} />
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
