import React from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  Title,
  Level,
  LevelItem,
} from '@patternfly/react-core';
import { Feature } from '../../components/feature';
import { APP_FEATURES } from '../../common/app_features';

export interface DataCardProps {
  title: string;
  children: any;
  actionButton?: React.FunctionComponent;
}

export function DataCard({
  children,
  title,
  actionButton: ActionButton,
}: DataCardProps) {
  return (
    <Card>
      <CardTitle>
        <Level>
          <LevelItem>
            <Title headingLevel="h3" style={{ fontWeight: 'normal' }}>
              {title}
            </Title>
          </LevelItem>
          <LevelItem>
            <Feature name={APP_FEATURES.writer}>
              <div style={{ marginRight: '1rem' }}>
                {ActionButton ? <ActionButton /> : <div />}
              </div>
            </Feature>
          </LevelItem>
        </Level>
      </CardTitle>
      <CardBody>{children}</CardBody>
    </Card>
  );
}
