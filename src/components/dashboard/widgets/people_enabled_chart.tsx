import React from 'react';
import '@patternfly/react-core/dist/styles/base.css';
import { ChartDonut, ChartThemeColor } from '@patternfly/react-charts';

export interface PeopleEnabledChartProps {
  redHatterCount: number;
  otherCount: number;
}
export function PeopleEnabledChart(props: PeopleEnabledChartProps) {
  return (
    <div style={{ height: '180px', width: '150px' }}>
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
        padding={{ bottom: 30, top: 30 }}
        legendPosition="right"
        subTitle="Total Enabled"
        subTitlePosition="bottom"
        title={(props.redHatterCount + props.otherCount).toString()}
        themeColor={ChartThemeColor.green}
        width={200}
        height={200}
      />
    </div>
  );
}
