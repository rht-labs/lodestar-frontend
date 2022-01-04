import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';
import {
  Chart,
  ChartAxis,
  ChartBar,
  ChartGroup,
  ChartThemeColor,
} from '@patternfly/react-charts';

import { CategoryWithCount } from '../../../schemas/engagement_category';
import React from 'react';
import {ReactComponent as TagsIcon} from '../../../assets/images/tags.svg';

export interface DwTopTagsProps {
  categories?: CategoryWithCount[];
  isLoading?: boolean;
}

export function DwTopTags ({
  categories,
  isLoading = true,
}: DwTopTagsProps ) {
  if(categories !== undefined){
    return (
      <Card style={{ height: '100%' }}>
        <CardHeader>
          <TextContent>
            <Text
              component={TextVariants.h2}
              data-testid="engagement-count-card-title"
            >
              <TagsIcon
                width="23"
                fill="#F3C044"
                stroke="#F3C044"
                style={{marginRight:"5px"}}
              ></TagsIcon>
              Top 10 Tags
            </Text>
          </TextContent>
        </CardHeader>
        <CardBody>
          <Flex
            style={{ height: '100%', width: '100%' }}
            alignItems={{ default: 'alignItemsCenter' }}
            justifyContent={{ default: 'justifyContentFlexStart' }}
          >
            <TagBarChart categories={categories} />
          </Flex>
        </CardBody>
        <CardFooter></CardFooter>
      </Card>
    );
  }else{
    return (
      <Card style={{ height: '100%' }}>
        <CardHeader>
          <TextContent>
            <Text
              component={TextVariants.h2}
              data-testid="engagement-count-card-title"
            >
              <TagsIcon
                width="23"
                fill="#F3C044"
                stroke="#F3C044"
                style={{marginRight:"5px"}}
              ></TagsIcon>
              Top 5 Tags
            </Text>
          </TextContent>
        </CardHeader>
      </Card>
    )
  }
}

const TagBarChart = ({ categories }: { categories: CategoryWithCount[] }) => {
  return (
    <div style={{ height: '180px', width: '100%' }}>
      <Chart
        themeColor={ChartThemeColor.multiOrdered}
        width={400}
        height={180}
        padding={{
          bottom: 10,
          left: 100,
          top: 10,
          right: 30,
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
