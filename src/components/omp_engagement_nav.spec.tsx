import React from 'react';
import { EngagementNav } from './omp_engagement_nav';

describe('OMP Engagement Nav UI', () => {
  test('should match snapshot', () => {
    expect(<EngagementNav />).toMatchSnapshot();
  });
});
