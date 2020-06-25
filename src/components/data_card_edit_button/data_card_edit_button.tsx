import React from 'react';
import { Button, ButtonVariant } from '@patternfly/react-core';
export function EditButton({ onClick }: { onClick: () => void }) {
  return (
    <Button variant={ButtonVariant.link} onClick={onClick}>
      Edit
    </Button>
  );
}
