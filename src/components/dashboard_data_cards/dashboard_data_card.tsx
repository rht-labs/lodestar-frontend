import React from 'react';
import {
  Button,
  Card,
  CardBody,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStatePrimary,
  Text,
  TextContent,
  TextVariants
} from '@patternfly/react-core';
import {useHistory} from "react-router";

export interface DashboardDataCardProps {
  icon: any;
  title: string;
  subtitle: string;
  numberOfEngagements: number;
  url: string;
}

export function DashboardDataCard({
  icon,
  title,
  numberOfEngagements,
  url,
  subtitle
}: DashboardDataCardProps) {

  const history = useHistory();


  return (
    <Card isHoverable isCompact>
      <CardBody>
        <EmptyState>
          <EmptyStateIcon icon={icon}/>
          <TextContent>
            <Text component={TextVariants.h1}>
              {numberOfEngagements}
            </Text>
            <Text component={TextVariants.h2}>
              {title}
            </Text>
          </TextContent>
          <EmptyStateBody>
            {subtitle}
          </EmptyStateBody>
          <EmptyStatePrimary>
            <Button variant="link"
                    onClick={() => { history.push(url)} }>
              View all
            </Button>
          </EmptyStatePrimary>
        </EmptyState>
      </CardBody>
    </Card>
  )
};
