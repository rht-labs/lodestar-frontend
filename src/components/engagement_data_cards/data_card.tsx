import React from 'react';
import { Card, CardBody, CardTitle, Title } from '@patternfly/react-core';

export interface DataCardProps {
  title: string;
  children: any;
}

export function DataCard(props: DataCardProps) {
  return (
    <Card>
      <CardTitle>
        <Title headingLevel="h2">{props.title}</Title>
      </CardTitle>
      <CardBody>{props.children}</CardBody>
    </Card>
  );
}
