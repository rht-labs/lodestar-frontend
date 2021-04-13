import {
  Chart,
  ChartAxis,
  ChartBar,
  ChartGroup,
  ChartThemeColor,
} from '@patternfly/react-charts';
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
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
            Top 5 Tags
          </Text>
        </TextContent>
      </CardHeader>
      <CardBody>
        <TagBarChart categories={categories} />
      </CardBody>
      <CardFooter></CardFooter>
    </Card>
  );
};

const TagBarChart = ({ categories }: { categories: CategoryWithCount[] }) => {
  return (
    <div style={{ height: '100px', width: '200px' }}>
      <Chart
        themeColor={ChartThemeColor.multiOrdered}
        width={200}
        height={100}
        padding={{
          bottom: 10,
          left: 100,
          top: 10,
          right: 20,
        }}
      >
        <ChartAxis />
        <ChartGroup horizontal>
          {categories
            .sort((a, b) => a.count - b.count)
            .map(c => (
              <ChartBar
                key={c.name}
                labels={[c.count]}
                data={[{ x: c.name, y: c.count }]}
              />
            ))}
        </ChartGroup>
      </Chart>
    </div>
  );
};
