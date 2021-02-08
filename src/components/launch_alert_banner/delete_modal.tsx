import React from 'react';
import { Modal, ModalVariant, Button } from '@patternfly/react-core';
import { useModalVisibility } from '../../context/edit_modal_visibility_context/edit_modal_visibility_hook';
import {useEngagements} from "../../context/engagement_context/engagement_hook";
import {AnalyticsCategory} from "../../schemas/analytics";
import {useAnalytics} from "../../context/analytics_context/analytics_context";
import {Engagement} from "../../schemas/engagement";
import {useHistory} from "react-router";

export interface DeleteModalProps {
  isOpen: boolean;
  engagement: Engagement
}
export function DeleteModal(
  props: DeleteModalProps
) {
  const {
    deleteEngagement
  } = useEngagements();

  const history = useHistory();
  const { logEvent } = useAnalytics();

  const deleteThisEngagement = async () => {
    history.push({
      pathname: `/app/engagements/`,
    });
    await deleteEngagement(props.engagement);
    logEvent({
      action: 'Delete engagement',
      category: AnalyticsCategory.engagements,
    });
  };

  const { requestClose } = useModalVisibility();
  return (
    <Modal
      variant={ModalVariant.small}
      title={`Delete ${props.engagement?.project_name}?`}
      isOpen={props.isOpen}
      onClose={requestClose}
      actions={[
        <Button key="delete" variant="danger" onClick={deleteThisEngagement}>
          Delete
        </Button>,
        <Button key="cancel" variant="secondary" onClick={requestClose}>
          Cancel
        </Button>
      ]}
    >
     Are you sure you want to delete {props.engagement?.customer_name} ({props.engagement?.project_name})? By deleting this engagement, all related data will be lost and can not be retrieved.
    </Modal>
  );
}
