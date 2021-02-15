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
import MockDate from 'mockdate';
import { parseISO } from 'date-fns';

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
    MockDate.set(new Date(2020, 8, 3));
    expect(
      render(
        <MemoryRouter>
          <EngagementListItem engagement={Engagement.fromFake(true)} />
        </MemoryRouter>
      )
    ).toMatchSnapshot();
    MockDate.reset();
  });
  test('shows the correct start date', async () => {
    const view = render(
      <MemoryRouter>
        <EngagementListItem
          engagement={{
            ...Engagement.fromFake(true),
            start_date: parseISO('2021-03-01T00:00:00.000Z'),
          }}
        />
      </MemoryRouter>
    );
    expect(
      await view.findByText('Target start date: Mar 01, 2021')
    ).toBeDefined();
  });
});
