import React from 'react';
import {
  Card,
  CardBody,
  CardTitle,
  Title,
  Level,
  LevelItem,
} from '@patternfly/react-core';
import { Feature } from '../feature/feature';
import { APP_FEATURES } from '../../common/app_features';

export interface DataCardProps {
  title: string;
  children: any;
  actionButton?: React.FunctionComponent;
  trailingIcon?: React.FunctionComponent;
}

export function DataCard({
  children,
  title,
  trailingIcon: TrailingIcon = () => <div />,
  actionButton: ActionButton = () => <div />,
}: DataCardProps) {
  return (
    <Card isCompact style={{ padding: '1rem' }}>
      <CardTitle>
        <Level>
          <LevelItem>
            <Title headingLevel="h3" style={{ fontWeight: 'normal' }}>
              {title}&nbsp;&nbsp;
              <TrailingIcon />
            </Title>
          </LevelItem>
          <LevelItem>
            <Feature name={APP_FEATURES.writer}>
              <div style={{ marginRight: '1rem' }} data-testId={'data-card-button'}>
                <ActionButton />
              </div>
            </Feature>
          </LevelItem>
        </Level>
      </CardTitle>
      <CardBody>{children}</CardBody>
    </Card>
  );
}
