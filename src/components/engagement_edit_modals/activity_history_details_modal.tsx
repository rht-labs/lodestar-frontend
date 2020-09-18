import React, { useState } from 'react';
import { Modal, ModalVariant, Button, Accordion } from '@patternfly/react-core';
import { useModalVisibility } from '../../context/edit_modal_visibility_context/edit_modal_visibility_hook';
import { EditModalTemplate } from '../../layout/edit_modal_template';
import { GitCommit } from '../../schemas/git_commit';
import { ActivityHistoryLineItem } from '../activity_history_line_item/activity_history_line_item';
import { Engagement } from '../../schemas/engagement';
export interface ActivityHistoryDetailsModalProps {
  isOpen: boolean;
  engagement: Engagement;
}
export function ActivityHistoryDetailsModal(
  props: ActivityHistoryDetailsModalProps
) {
  const { requestClose } = useModalVisibility();
  const anyActivities = props.engagement?.commits?.length > 0;
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
        {anyActivities ? (
          <DetailedActivityHistoryList commits={props.engagement?.commits} />
        ) : (
          <p style={{ fontStyle: 'italic' }}> No activity to display</p>
        )}
      </EditModalTemplate>
    </Modal>
  );
}

function DetailedActivityHistoryList({ commits }: { commits: GitCommit[] }) {
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  return (
    <Accordion>
      {commits?.map(commit => (
        <ActivityHistoryLineItem
          commit={commit}
          isAccordionItem
          onToggle={commitId =>
            setExpanded({ ...expanded, [commitId]: !expanded[commitId] })
          }
          isExpanded={!!expanded[commit.id]}
        />
      ))}
    </Accordion>
  );
}
