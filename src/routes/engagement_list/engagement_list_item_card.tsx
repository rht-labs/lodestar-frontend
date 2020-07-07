import React from 'react';
import {
  Button,
  Card,
  CardBody,
  Nav,
  NavItem,
  NavList,
  Title,
  Grid, GridItem,
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
      <Card isCompact style={{ margin: '1rem', padding: '2rem 0.5rem' }}>
        <CardBody style={{ padding: '0 2rem' }}>
          <Grid hasGutter style={{alignItems: 'center', alignContent: 'center'}}>
            <GridItem span={3} >
              <Nav
                onSelect={() => {
                  history.push(url);
                }}
                variant="tertiary"
              >
                <NavList>
                  <NavItem>
                    <Title headingLevel="h3" style={{ fontWeight: 'bolder',cursor: 'pointer', wordWrap: "break-word"}}>
                      {props.title}
                    </Title>
                  </NavItem>
                </NavList>
              </Nav>
              <Title style={{ margin: '0 1rem' ,  fontWeight: 'normal'}} headingLevel="h4">
                {props.customer}
              </Title>
            </GridItem>
            <GridItem span={7}>
              {props.children}
            </GridItem>
            <GridItem span={2}>
              <Button
                onClick={() => {
                  history.push(url);
                }}
                variant="secondary"
              >
                View Engagement
              </Button>
            </GridItem>
          </Grid>
        </CardBody>
      </Card>
    </>
  );
}
