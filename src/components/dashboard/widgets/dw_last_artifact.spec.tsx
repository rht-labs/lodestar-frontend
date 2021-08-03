import { render } from '@testing-library/react';
import React from 'react';
import { mockEngagementUseCase } from '../../../mocks/engagement_mocks';
import { DwLastArtifacts } from './dw_last_artifact';
import { DwLastUseCases } from './dw_last_use_cases';

describe('Last Use Cases dashboard widget', () => {
  test('has the correct title', () => {
    const component = render(<DwLastArtifacts artifacts={[]} />);
    expect(component.getByText('Artifacts')).toBeDefined();
  });
  test('shows the artifacts', () => {
    const artifacts = new Array(10).fill(null).map(mockEngagementUseCase);
    const component = render(<DwLastUseCases useCases={artifacts} />);
    for (let artifact of artifacts) {
      expect(component.getByText(artifact.description)).toBeDefined();
    }
  });
});
