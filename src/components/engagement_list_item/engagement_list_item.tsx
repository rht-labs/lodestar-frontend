import React from 'react';
import {
  Button,
  Card,
  CardBody,
  Title,
  Grid,
  GridItem,
  Label,
} from '@patternfly/react-core';
import { useHistory } from 'react-router';
import { EngagementAtAGlance } from './engagement_at_a_glance';
import { getEngagementStatus, Engagement } from '../../schemas/engagement';

export interface DataCardProps {
  engagement: Partial<Engagement>;
  onCategorySelect:(value:string, category:string) => void;
}

export function EngagementListItem(props: DataCardProps) {
  const { engagement } = props;
  const url = `/app/engagements/${engagement.uuid}`;
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
              {engagement.categories?.length > 0 ? (
                engagement?.categories.map(currentChip => (
                  <Label
                    key={currentChip}
                    style={{ marginTop: '1rem', marginRight: '0.5rem'}}
                    color="blue"
                    href="#"
                    onClick={() => props.onCategorySelect(`category='${currentChip}'`, currentChip)}
                  >
                    {currentChip}
                  </Label>
                ))
              ) : (
                <></>
              )}
            </GridItem>
            <GridItem md={12} lg={7}>
              <EngagementAtAGlance
                engagement={engagement as Engagement}
                status={status}
              />
            </GridItem>
            <GridItem sm={12} md={4} lg={2}>
              <Button
                href = { url }
                variant="secondary"
                data-cy="view_engagement_button"
                component="a"
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
