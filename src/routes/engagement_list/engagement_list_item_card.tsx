import React from 'react';
import {
  Button,
  Card,
  CardBody,
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
      <Card isHoverable isCompact style={{ margin: '1rem', padding: '1rem' }}>
        <CardBody style={{ padding: '0 2rem' }}>
          <Flex style={{ alignItems: 'center'}}>
            <FlexItem flex={{ default: 'flex_1' }}>
              <Nav
                onSelect={() => {
                  history.push(url);
                }}
                variant="tertiary"
              >
                <NavList>
                  <NavItem>
                    <Title headingLevel="h3" style={{ fontWeight: 'bolder',cursor: 'pointer' }}>
                      {props.title}
                    </Title>
                  </NavItem>
                </NavList>
              </Nav>
              <Title style={{ margin: '0 1rem' ,  fontWeight: 'normal'}} headingLevel="h4">
                {props.customer}
              </Title>
            </FlexItem>
            <FlexItem flex={{ default: 'flex_3' }}>
              {props.children}
            </FlexItem>
            <FlexItem flex={{ default: 'flexNone' }}>
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
