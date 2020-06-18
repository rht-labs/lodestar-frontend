import React from 'react';
import {Button, ButtonVariant, Card, CardBody, CardTitle, Flex, FlexItem} from '@patternfly/react-core';

export interface DataCardProps {
  title: string;
  children: any;
}

export function EngagementListItemCard(props: DataCardProps) {
  return (
    <>
      <Card
        isHoverable
        isCompact
        style={{margin: '0 1rem', padding: '1rem'}}>
        <CardTitle>
          {props.title}
        </CardTitle>
        <CardBody>
          <Flex>
            <FlexItem grow={{ default: 'grow' }}>
              {props.children}
            </FlexItem>
            <FlexItem>
              <Button variant={ButtonVariant.secondary}>
                View Engagement
              </Button>
            </FlexItem>
          </Flex>
        </CardBody>
      </Card>
    </>
  );
}
