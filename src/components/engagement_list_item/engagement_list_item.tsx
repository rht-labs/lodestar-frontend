import React from 'react';
import {
  Button,
  Card,
  CardBody,
  Title,
  Grid,
  GridItem, Label,
} from '@patternfly/react-core';
import { useHistory } from 'react-router';
import { EngagementAtAGlance } from './engagement_at_a_glance';
import { getEngagementStatus, Engagement } from '../../schemas/engagement';

export interface DataCardProps {
  engagement: Engagement;
}

export function EngagementListItem(props: DataCardProps) {
  const { engagement } = props;
  const url = `/app/engagements/${engagement.customer_name}/${engagement.project_name}`;
  const history = useHistory();
  const status = getEngagementStatus(engagement);

  return (
    <>
      <Card isCompact style={{ margin: '1rem', padding: '2rem 0.5rem' }}>
        <CardBody style={{ padding: '0 2rem' }}>
          <Grid hasGutter style={{ alignItems: 'center' }}>
            <GridItem md={12} lg={3}>
              <Button
                variant="link"
                isInline
                style={{
                  whiteSpace: 'normal',
                  wordWrap: 'break-word',
                  textAlign: 'left',
                }}
                onClick={() => {
                  history.push(url);
                }}
              >
                <Title headingLevel="h3" style={{ fontWeight: 'bolder' }}>
                  {engagement.project_name}
                </Title>
              </Button>
              <Title style={{ fontWeight: 'normal' }} headingLevel="h4">
                {engagement.customer_name}
              </Title>
              {
                engagement.engagement_categories?.length > 0
                  ? engagement?.engagement_categories.map(currentChip => (
                    <>
                      <Label key={currentChip.name}
                             style={{marginTop: '1rem', marginRight:'0.5rem'}}
                             color="blue">
                        {currentChip.name}
                      </Label>
                  </>
                  ))
                  : <></>
              }
            </GridItem>
            <GridItem md={12} lg={7}>
              <EngagementAtAGlance engagement={engagement} status={status} />
            </GridItem>
            <GridItem sm={12} md={4} lg={2}>
              <Button
                onClick={() => {
                  history.push(url);
                }}
                variant="secondary"
                data-cy={'view_engagement_button'}
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
