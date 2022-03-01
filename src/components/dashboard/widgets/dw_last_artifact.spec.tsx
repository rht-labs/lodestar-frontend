import { render } from '@testing-library/react';
import React from 'react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router';
import { mockEngagementArtifact } from '../../../mocks/engagement_mocks';
import { DwLastArtifacts } from './dw_last_artifact';

describe('Last Use Cases dashboard widget', () => {
  test('has the correct title', () => {
    const component = render(
      <Router history={createMemoryHistory({})}>
        <DwLastArtifacts artifacts={[]} />
      </Router>
    );
    expect(component.getByText('Artifacts')).toBeDefined();
  });
  test('shows the artifacts', () => {
    const artifacts = new Array(10).fill(null).map(mockEngagementArtifact);
    const component = render(
      <Router history={createMemoryHistory({})}>
        <DwLastArtifacts artifacts={artifacts} />
      </Router>
    );
    for (let artifact of artifacts) {
      expect(component.getByText(artifact.title.substring(0, artifact.title.trim().lastIndexOf(" ")))).toBeDefined();
      // The last word will be wrapped in a span with an icon, so only match until the last space
    }
  });
});
