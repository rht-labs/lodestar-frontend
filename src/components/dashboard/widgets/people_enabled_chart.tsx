import React from 'react';
import '@patternfly/react-core/dist/styles/base.css';
import { ChartDonut, ChartThemeColor } from '@patternfly/react-charts';

export interface PeopleEnabledChartProps {
  redHatterCount: number;
  otherCount: number;
}
export function PeopleEnabledChart(props: PeopleEnabledChartProps) {
  return (
    <>
      <div style={{ height: '230px', width: '400px' }}>
        <ChartDonut
          ariaDesc="People Enabled"
          ariaTitle="People Enabled Chart"
          constrainToVisibleArea={true}
          data={[
            { x: 'Red Hatters', y: props.redHatterCount },
            { x: 'Others', y: props.otherCount },
          ]}
          labels={({ datum }) => `${datum.x}: ${datum.y}%`}
          legendOrientation="vertical"
          legendPosition="right"
          padding={{
            bottom: 20,
            left: 20,
            right: 140, // Adjusted to accommodate legend
            top: 20,
          }}
          subTitle="Total Enabled"
          subTitlePosition="bottom"
          title={(props.redHatterCount + props.otherCount).toString()}
          themeColor={ChartThemeColor.green}
          width={300}
        />
      </div>
    </>
  );
}
