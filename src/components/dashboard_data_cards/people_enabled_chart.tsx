import React from 'react';
import '@patternfly/react-core/dist/styles/base.css';
import {ChartDonut, ChartThemeColor} from '@patternfly/react-charts';

export function PeopleEnabledChart () {
  return(
    <>
      <div style={{height: '230px', width: '400px'}}>
        <ChartDonut
          ariaDesc="People Enabled"
          ariaTitle="People Enabled Chart"
          constrainToVisibleArea={true}
          data={[{x: 'Red Hatters', y: 28}, {x: 'Non Red Hatters', y: 10}]}
          labels={({datum}) => `${datum.x}: ${datum.y}%`}
          legendData={[{name: 'Non Red Hatter: 28'}, {name: 'Red Hatters: 10'}]}
          legendOrientation="vertical"
          legendPosition="right"
          padding={{
            bottom: 20,
            left: 20,
            right: 140, // Adjusted to accommodate legend
            top: 20
          }}
          subTitle="Total Enabled"
          subTitlePosition="bottom"
          title={'38'}
          themeColor={ChartThemeColor.green}
          width={300}
        />
      </div>
    </>
  )}