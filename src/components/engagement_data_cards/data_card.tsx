import React from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  Title,
  Level,
  LevelItem,
  Button,
  ButtonVariant,
} from '@patternfly/react-core';

export interface DataCardProps {
  title: string;
  children: any;
  isEditable?: boolean;
  onEdit?: () => void;
}

export function DataCard({
  children,
  title,
  isEditable = false,
  onEdit = () => {},
}: DataCardProps) {
  return (
    <Card>
      <CardTitle>
        <Level>
          <LevelItem>
            <Title headingLevel="h2">{title}</Title>
          </LevelItem>
          <LevelItem>
            <EditButton onClick={onEdit} isEditable={isEditable} />
          </LevelItem>
        </Level>
      </CardTitle>
      <CardBody>{children}</CardBody>
    </Card>
  );
}

function EditButton({
  isEditable,
  onClick,
}: {
  isEditable: boolean;
  onClick: () => void;
}) {
  if (isEditable) {
    return (
      <Button onClick={onClick} variant={ButtonVariant.plain}>
        Edit
      </Button>
    );
  }
  return <div />;
}
