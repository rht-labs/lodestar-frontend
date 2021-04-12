import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Flex,
  FlexItem,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';
import React from 'react';
import { CategoryWithCount } from '../../../schemas/engagement_category';

export interface DwTopTagsProps {
  categories?: CategoryWithCount[];
}
export const DwTopTags = (props: DwTopTagsProps) => {
  const { categories = [] } = props;
  return (
    <Card>
      <CardHeader>
        <TextContent>
          <Text
            component={TextVariants.h2}
            data-testid="engagement-count-card-title"
          >
            Top Tags
          </Text>
        </TextContent>
      </CardHeader>
      <CardBody>
        <Flex>
          {categories.map(c => (
            <FlexItem key={c.name}>
              <Chip isReadOnly={true}>
                {c.name}:&nbsp;&nbsp;{c.count}
              </Chip>
            </FlexItem>
          ))}
        </Flex>
      </CardBody>
      <CardFooter></CardFooter>
    </Card>
  );
};
