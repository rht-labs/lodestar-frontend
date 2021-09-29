import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Spinner,
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

import { PracticeCount } from '../../../schemas/engagement';
import {ReactComponent as PracticesIcon} from '../../../assets/images/ball-pile.svg';
import React from 'react';

export interface DwTopPracticesProps {
  practices?: PracticeCount[];
  isLoading?: boolean;
}

export function DwTopPractices ({
  practices =[],
  isLoading = true,
}: DwTopPracticesProps ) {
  return (
    <Card style={{ height: '100%' }}>
      <CardHeader>
        <TextContent>
          <Text
            component={TextVariants.h2}
            data-testid="engagement-count-card-title"
          >
            <PracticesIcon
              width="20"
              fill="#EE0000"
              stroke="#EE0000"
              style={{marginRight:"5px"}}
            ></PracticesIcon>
            Top 5 Practices
          </Text>
        </TextContent>
      </CardHeader>
      <CardBody>
        <Flex
          style={{ height: '100%', width: '100%' }}
          alignItems={{ default: 'alignItemsCenter' }}
          justifyContent={{ default: 'justifyContentCenter' }}
        >
          <TagBarChart practices={practices} />
        </Flex>
      </CardBody>
      <CardFooter></CardFooter>
    </Card>
  );
}

const TagBarChart = ({ practices }: { practices: PracticeCount[] }) => {
  if(practices.length){
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
            {practices.reverse()
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
  }else{
    return (
      <Spinner size="xl"/>
    )
  }
  
};
