import React from 'react';
import { cleanup, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import {
  upcomingEngagement,
  currentEngagement,
  pastEngagement,
} from '../mock_engagements';
import {
  EngagementStatus,
  getEngagementStatus,
  Engagement,
} from '../../../schemas/engagement';
import { EngagementListItem } from '../engagement_list_item';
import { MemoryRouter } from 'react-router';

afterEach(cleanup);

describe('Engagement status', () => {
  test('renders the upcoming status', () => {
    expect(getEngagementStatus(upcomingEngagement())).toEqual(
      EngagementStatus.upcoming
    );
  });
  test('renders the active status', () => {
    expect(getEngagementStatus(currentEngagement())).toEqual(
      EngagementStatus.active
    );
  });
  test('renders the past status', () => {
    expect(getEngagementStatus(pastEngagement())).toEqual(
      EngagementStatus.past
    );
  });

  test('matches snapshot', () => {
    expect(
      render(
        <MemoryRouter>
          <EngagementListItem engagement={Engagement.fromFake(true)} />
        </MemoryRouter>
      )
    ).toMatchSnapshot();
  });
});
