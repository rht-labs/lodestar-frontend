import { render } from '@testing-library/react';
import React from 'react';
import { mockEngagementArtifact } from '../../../mocks/engagement_mocks';
import { DwLastWeeklyReport } from './dw_last_weekly_report';

describe('Dashboard last weekly reports', () => {
  test('has the correct title', () => {
    const component = render(<DwLastWeeklyReport artifacts={[]} />);
    expect(component.getByText('Last 5 Weekly Reports')).toBeDefined();
  });
  test('shows the reports', () => {
    const artifacts = new Array(10).fill(null).map(mockEngagementArtifact);
    const weeklyReports = artifacts.map(d => ({ ...d, type: 'weeklyReport' }));
    const component = render(<DwLastWeeklyReport artifacts={weeklyReports} />);
    for (let report of weeklyReports) {
      expect(component.getByText(report.description)).toBeDefined();
    }
  });
});
