import React from 'react';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import {
  upcomingEngagement,
  activeEngagement,
  pastEngagement,
} from '../mock_engagements';
import {
  EngagementStatus,
  getEngagementStatus,
} from '../../../schemas/engagement_schema';

afterEach(cleanup);

describe('Engagement status', () => {
  test('renders the upcoming status', () => {
    expect(getEngagementStatus(upcomingEngagement())).toEqual(
      EngagementStatus.upcoming
    );
  });
  test('renders the active status', () => {
    expect(getEngagementStatus(activeEngagement())).toEqual(
      EngagementStatus.active
    );
  });
  test('renders the past status', () => {
    expect(getEngagementStatus(pastEngagement())).toEqual(
      EngagementStatus.past
    );
  });
});
