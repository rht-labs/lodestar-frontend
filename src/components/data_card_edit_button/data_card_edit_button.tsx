import React from 'react';
import { Button, ButtonVariant } from '@patternfly/react-core';
export function EditButton({ text, onClick }: { text: string, onClick: () => void }) {
  return (
    <Button variant={ButtonVariant.secondary}
            onClick={onClick} style={{ minWidth: '7rem' }}>
      {text}
    </Button>
  );
}
