import React from 'react';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { EngagementStatus } from '../engagement_list_item';
import {
  upcomingEngagement,
  activeEngagement,
  pastEngagement,
} from '../mock_engagements';

afterEach(cleanup);

describe('Engagement status', () => {
  test('renders the upcoming status', () => {
    expect(
      EngagementStatus(
        upcomingEngagement().launch?.launched_date_time,
        upcomingEngagement().start_date,
        upcomingEngagement().end_date
      )
    ).toEqual('upcoming');
  });
  test('renders the active status', () => {
    expect(
      EngagementStatus(
        activeEngagement().launch?.launched_date_time,
        activeEngagement().start_date,
        activeEngagement().end_date
      )
    ).toEqual('active');
  });
  test('renders the past status', () => {
    expect(
      EngagementStatus(
        pastEngagement().launch?.launched_date_time,
        pastEngagement().start_date,
        pastEngagement().end_date
      )
    ).toEqual('past');
  });
});
