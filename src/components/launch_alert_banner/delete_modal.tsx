import React from 'react';
import { Modal, ModalVariant, Button } from '@patternfly/react-core';
import { useModalVisibility } from '../../context/edit_modal_visibility_context/edit_modal_visibility_hook';

export interface DeleteModalProps {
  isOpen: boolean;
  customerName: string;
  projectName: string;
}
export function DeleteModal(
  props: DeleteModalProps
) {
  const { requestClose } = useModalVisibility();
  return (
    <Modal
      variant={ModalVariant.small}
      title={`Delete ${props.projectName}?`}
      isOpen={props.isOpen}
      onClose={requestClose}
      actions={[
        <Button key="delete" variant="danger" onClick={requestClose}>
          Delete
        </Button>,
        <Button key="cancel" variant="secondary" onClick={requestClose}>
          Cancel
        </Button>
      ]}
    >
     Are you sure you want to delete {props.customerName} - {props.projectName}? By deleting this engagement, all related data will be lost and can not be retrieved.
    </Modal>
  );
}
