import React from 'react';
import { PageSection, Flex, FlexItem } from '@patternfly/react-core';

export interface EditModalTemplateProps {
  children?: any;
  actions?: React.ReactNode;
}
export function EditModalTemplate(props: EditModalTemplateProps) {
  return (
    <>
      <PageSection>{props.children}</PageSection>
      <PageSection>
        <div style={{ marginTop: '1rem' }}>
          <Flex justifyContent={{ default: 'justifyContentFlexEnd' }}>
            <FlexItem>{props.actions}</FlexItem>
          </Flex>
        </div>
      </PageSection>
    </>
  );
}
