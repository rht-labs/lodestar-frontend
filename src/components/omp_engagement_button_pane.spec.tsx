import React from 'react';
import { OMPEngagementButtonPane } from './omp_engagement_button_pane';

describe('Engagement Button Pane UI', () => {
  test('should match snapshot', () => {
    expect(<OMPEngagementButtonPane />).toMatchSnapshot();
  });
});
