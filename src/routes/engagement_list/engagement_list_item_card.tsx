import React from 'react';
import {
  Button,
  Card,
  CardBody,
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
          <Grid hasGutter style={{alignItems: 'center'}}>
            <GridItem md={12} lg={3}>
              <Button variant="link"
                      isInline
                      style={ {whiteSpace: 'normal', wordWrap: 'break-word', textAlign:'left'}}
                      onClick={() => { history.push(url)} }>
                <Title headingLevel="h3" style={{ fontWeight: 'bolder'}}>
                  {props.title}
                </Title>
              </Button>
              <Title style={{ fontWeight: 'normal'}} headingLevel="h4">
                {props.customer}
              </Title>
            </GridItem>
            <GridItem md={12} lg={7}>
              {props.children}
            </GridItem>
            <GridItem sm={12} md={4} lg={2}>
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
