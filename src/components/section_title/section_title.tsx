import React from 'react';
import { Title, TitleProps } from '@patternfly/react-core';

export interface SectionTitleProps {
  children: React.ReactNode;
  headingLevel?: Pick<TitleProps, 'headingLevel'>;
}

export function SectionTitle(props) {
  return (
    <div style={{ display: 'inline-block' }}>
      <Title headingLevel={props.headingLevel ?? 'h2'}>{props.children}</Title>
    </div>
  );
}
