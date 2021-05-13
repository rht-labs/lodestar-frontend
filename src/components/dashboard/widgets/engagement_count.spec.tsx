import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router';
import { EngagementCountWidget } from './dw_engagement_count';

describe('Dashboard Engagement Count Card', () => {
  test('Shows the title "Engagements"', () => {
    const view = render(
      <MemoryRouter>
        <EngagementCountWidget engagements={[]} />
      </MemoryRouter>
    );
    const titleElement = view.getByTestId('engagement-count-card-title');
    expect(titleElement).toBeDefined();
    expect(titleElement.textContent).toEqual('Engagement Summary');
  });
  test('Shows the total account of engagements', () => {
    const view = render(
      <MemoryRouter>
        <EngagementCountWidget engagements={[]} />
      </MemoryRouter>
    );
    expect(view.getByText('All Engagements')).toBeDefined();
  });
});
