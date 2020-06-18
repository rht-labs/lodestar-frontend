import React from 'react';
import {Button, Card, CardBody, CardTitle, Flex, FlexItem} from '@patternfly/react-core';

export interface DataCardProps {
  title: string;
  customer: string;
  project: string;
  children: any;
}

export function EngagementListItemCard(props: DataCardProps) {

  const url = `/app/engagements/${props.customer}/${props.project}`;

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
              <Button onClick={() => {window.location.href =  url }} variant="secondary">
                  View Engagement
              </Button>
            </FlexItem>
          </Flex>
        </CardBody>
      </Card>
    </>
  );
}
