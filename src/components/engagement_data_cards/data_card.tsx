import React from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  Title,
  Level,
  LevelItem,
  Button,
  ButtonVariant,
  Grid,
  GridItem,
  Flex,
  FlexItem,
} from '@patternfly/react-core';
import { Feature } from '../../components/feature';
import { APP_FEATURES } from '../../common/app_features';

export interface DataCardProps {
  title: string;
  children: any;
  isEditable?: boolean;
  onEdit?: () => void;
}

export function DataCard({
  children,
  title,
  isEditable = false,
  onEdit = () => {},
}: DataCardProps) {
  return (
    <Card>
      <Grid>
        <GridItem span={11}>
          <CardTitle>
            <Level>
              <LevelItem>
                <Title headingLevel="h3" style={{ fontWeight: 'normal' }}>
                  {title}
                </Title>
              </LevelItem>
              <LevelItem></LevelItem>
            </Level>
          </CardTitle>
          <CardBody>{children}</CardBody>
        </GridItem>
        <GridItem span={1}>
          <Flex style={{ height: '100%' }}>
            <FlexItem alignSelf={{ default: 'alignSelfCenter' }}>
              <Feature name={APP_FEATURES.writer}>
                <div style={{ marginRight: '1rem' }}>
                  <EditButton onClick={onEdit} isEditable={isEditable} />
                </div>
              </Feature>
            </FlexItem>
          </Flex>
        </GridItem>
      </Grid>
    </Card>
  );
}

function EditButton({
  isEditable,
  onClick,
}: {
  isEditable: boolean;
  onClick: () => void;
}) {
  if (isEditable) {
    return (
      <Button variant={ButtonVariant.link} onClick={onClick}>
        Edit
      </Button>
    );
  }
  return <div />;
}
