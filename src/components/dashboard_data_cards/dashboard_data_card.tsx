import React from 'react';
import {
  Button,
  Card,
  CardBody,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
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

  const cardShape: React.CSSProperties = {
    minHeight: '40vh',
  };

  return (
    <Card isHoverable isCompact style={cardShape}>
      <CardBody>
        <EmptyState>
          <EmptyStateIcon icon={icon}/>
          <TextContent>
            <Text component={TextVariants.h1}>
              {numberOfEngagements}
            </Text>
            <Button variant="link"
                    isInline
                    onClick={() => { history.push(url)} }>
              <Text component={TextVariants.h2}>
                {title}
              </Text>
            </Button>
          </TextContent>
          <EmptyStateBody>
            {subtitle}
          </EmptyStateBody>
        </EmptyState>
      </CardBody>
    </Card>
  )
};
