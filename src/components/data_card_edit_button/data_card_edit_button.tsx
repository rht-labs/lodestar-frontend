import React from 'react';
import { Button, ButtonVariant } from '@patternfly/react-core';
export function EditButton({
  text,
  onClick,
  dataCy,
  ...props
}: {
  text: string;
  onClick: () => void;
  dataCy?: string;
}) {
  return (
    <Button
      {...props}
      variant={ButtonVariant.secondary}
      onClick={onClick}
      style={{ minWidth: '7rem' }}
      data-cy={dataCy}
    >
      {text}
    </Button>
  );
}
