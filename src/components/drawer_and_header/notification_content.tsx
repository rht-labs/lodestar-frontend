import React from 'react';
import {
  DrawerActions,
  DrawerCloseButton,
  DrawerHead,
  DrawerPanelContent,
  Alert, AlertActionCloseButton, AlertActionLink,
} from '@patternfly/react-core';

export interface NotificationContentProps{
  onClose: any;
}

export function NotificationContent(props: NotificationContentProps) {

  return (
    <DrawerPanelContent>
      <DrawerHead>
        <DrawerActions>
          <DrawerCloseButton onClick={props.onClose}/>
        </DrawerActions>
      </DrawerHead>
      <Alert title="Default alert title">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus pretium est a porttitor vehicula. Quisque vel commodo urna. Morbi mattis rutrum ante
      </Alert>
      <Alert
        variant="success"
        title="Success alert title"
        actionClose={<AlertActionCloseButton />}
        actionLinks={
          <>
            <AlertActionLink >View details</AlertActionLink>
            <AlertActionLink>Ignore</AlertActionLink>
          </>
        }
      >
        <p>Success alert description. </p>
      </Alert>
      <Alert variant="info" title="Info alert title" >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus pretium est a porttitor vehicula. Quisque vel commodo urna. Morbi mattis rutrum ante
      </Alert>
      <Alert variant="warning" title="Warning alert title" >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus pretium est a porttitor vehicula. Quisque vel commodo urna. Morbi mattis rutrum ante
      </Alert>
      <Alert variant="danger" title="Danger alert title" >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus pretium est a porttitor vehicula. Quisque vel commodo urna. Morbi mattis rutrum ante
      </Alert>
    </DrawerPanelContent>
  )}
