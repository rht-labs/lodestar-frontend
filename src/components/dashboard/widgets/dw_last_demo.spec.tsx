import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router';
import { mockEngagementArtifact } from '../../../mocks/engagement_mocks';
import { DwLastDemo } from './dw_last_demo';

describe('Dashboard last demos', () => {
  test('has the correct title', () => {
    const component = render(<DwLastDemo demos={[]} engagements={[]} />);
    expect(component.getByText('Last 5 Demos')).toBeDefined();
  });
  test('shows the demos', () => {
    const artifacts = new Array(10).fill(null).map(mockEngagementArtifact);
    const demos = artifacts.map(d => ({ ...d, type: 'demo' }));
    const component = render(
      <MemoryRouter>
        <DwLastDemo demos={demos} engagements={[]} />
      </MemoryRouter>
    );
    for (let demo of demos) {
      expect(component.getByText(demo.description)).toBeDefined();
    }
  });
});
