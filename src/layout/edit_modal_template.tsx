import React from 'react';
import {
  TextContent,
  PageSection,
  Title,
  Flex,
  FlexItem,
} from '@patternfly/react-core';

export interface EditModalTemplateProps {
  title?: string;
  children?: any;
  actions?: React.ReactNode;
}
export function EditModalTemplate(props: EditModalTemplateProps) {
  return (
    <PageSection>
      <div style={{ marginBottom: '1rem' }}>
        <TextContent>
          <Title headingLevel="h1">{props.title}</Title>
        </TextContent>
      </div>
      {props.children}
      <Flex justifyContent={{ default: 'justifyContentFlexEnd' }}>
        <FlexItem>{props.actions}</FlexItem>
      </Flex>
    </PageSection>
  );
}
