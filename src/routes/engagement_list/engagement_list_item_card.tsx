import React from 'react';
import {Button, Card, CardBody, CardTitle, Flex, FlexItem, Nav, NavItem, NavList} from '@patternfly/react-core';
import { useHistory } from "react-router";

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
      <Card
        isHoverable
        isCompact
        style={{margin: '0 1rem', padding: '1rem'}}>
        <CardTitle>
          <Nav onSelect={() => { history.push(url)}} variant="tertiary">
            <NavList>
              <NavItem style={{fontWeight: 'bold'}}>
                {props.title}
              </NavItem>
            </NavList>
          </Nav>
        </CardTitle>
        <CardBody style={{padding: '0 2rem'}}>
          <Flex>
            <FlexItem grow={{ default: 'grow' }}>
              {props.children}
            </FlexItem>
            <FlexItem>
              <Button onClick={() => { history.push(url)} } variant="secondary">
                  View Engagement
              </Button>
            </FlexItem>
          </Flex>
        </CardBody>
      </Card>
    </>
  );
}
