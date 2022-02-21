import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router';
import { mockEngagementArtifact } from '../../../mocks/engagement_mocks';
import { DwLastDemo } from './dw_last_demo';

describe('Dashboard last demos', () => {
  test('has the correct title', () => {
    const component = render(<DwLastDemo demos={[]} engagements={[]} />);
    expect(component.getByText('Demos')).toBeDefined();
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
      expect(component.getByText(demo.description.substring(0, demo.description.lastIndexOf(" ")))).toBeDefined();
      // The last word will be wrapped in a span with an icon, so only match until the last space
    }
  });
});
