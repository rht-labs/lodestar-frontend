import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router';
import { mockEngagementArtifact } from '../../../mocks/engagement_mocks';
import { DwLastWeeklyReport } from './dw_last_weekly_report';

describe('Dashboard last weekly reports', () => {
  test('has the correct title', () => {
    const component = render(
      <MemoryRouter>
        <DwLastWeeklyReport artifacts={[]} engagements={[]} />
      </MemoryRouter>
    );
    expect(component.getByText('Weekly Reports')).toBeDefined();
  });
  test('shows the reports', () => {
    const artifacts = new Array(10).fill(null).map(mockEngagementArtifact);
    const weeklyReports = artifacts.map(d => ({ ...d, type: 'weeklyReport' }));
    const component = render(
      <MemoryRouter>
        <DwLastWeeklyReport artifacts={weeklyReports} engagements={[]} />
      </MemoryRouter>
    );
    for (let report of weeklyReports) {
      expect(component.getByText(report.description.substring(0, report.description.lastIndexOf(" ")))).toBeDefined();
      // The last word will be wrapped in a span with an icon, so only match until the last space
    }
  });
});
