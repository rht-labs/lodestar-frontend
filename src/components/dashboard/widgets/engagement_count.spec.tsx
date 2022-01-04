import { DwEngagementCount } from './dw_engagement_count';
import { MemoryRouter } from 'react-router';
import React from 'react';
import { render } from '@testing-library/react';

describe('Dashboard Engagement Count Card', () => {
  test('Shows the title "Engagements"', () => {
    const view = render(
      <MemoryRouter>
        <DwEngagementCount summaryCount={{}} />
      </MemoryRouter>
    );
    const titleElement = view.getByTestId('engagement-count-card-title');
    expect(titleElement).toBeDefined();
    expect(titleElement.textContent).toEqual('Engagement Summary');
  });
  test('Shows the total account of engagements', () => {
    const view = render(
      <MemoryRouter>
        <DwEngagementCount summaryCount={{}} />
      </MemoryRouter>
    );
    expect(view.getByText('All Engagements')).toBeDefined();
  });
});
