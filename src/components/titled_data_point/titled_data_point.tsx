import React from 'react';
import { Text, TextContent, TextVariants } from '@patternfly/react-core';

export interface TitledDataPointProps {
  title: string;
  children: any;
  dataCy?: string;
}

export function TitledDataPoint(props: TitledDataPointProps) {
  return (
    <TextContent data-cy={props.dataCy}>
      <Text component={TextVariants.h6} style={{ marginBottom: '0.1rem' }}>
        {props.title}
      </Text>
      {typeof props.children === 'string' ? (
        <Text>{props.children}</Text>
      ) : (
        props.children
      )}
    </TextContent>
  );
}
