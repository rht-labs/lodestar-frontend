import React from 'react';
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Flex,
  FlexItem,
  Nav,
  NavItem,
  NavList,
  Title,
} from '@patternfly/react-core';
import { useHistory } from 'react-router';

export interface DataCardProps {
  title: string;
  customer: string;
  project: string;
  children: any;
}

export function EngagementListItemCard(props: DataCardProps) {
  const url = `/app/engagements/${props.customer}/${props.project}`;
  const history = useHistory();

  return (
    <>
      <Card isHoverable isCompact style={{ margin: '0 1rem', padding: '1rem' }}>
        <CardTitle>
          <Nav
            onSelect={() => {
              history.push(url);
            }}
            variant="tertiary"
          >
            <NavList>
              <NavItem style={{ fontWeight: 'bold', cursor: 'pointer' }}>
                <Title headingLevel="h2" style={{ cursor: 'pointer' }}>
                  {props.title}
                </Title>
              </NavItem>
            </NavList>
          </Nav>
          <Title style={{ margin: '0 1rem' }} headingLevel="h6">
            {props.customer}
          </Title>
        </CardTitle>
        <CardBody style={{ padding: '0 2rem' }}>
          <Flex>
            <FlexItem grow={{ default: 'grow' }}>{props.children}</FlexItem>
            <FlexItem>
              <Button
                onClick={() => {
                  history.push(url);
                }}
                variant="secondary"
              >
                View Engagement
              </Button>
            </FlexItem>
          </Flex>
        </CardBody>
      </Card>
    </>
  );
}
