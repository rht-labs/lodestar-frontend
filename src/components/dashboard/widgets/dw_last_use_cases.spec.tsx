import { render } from '@testing-library/react';
import React from 'react';
import { createMemoryHistory } from 'history';
import { Router } from 'react-router';
import { mockEngagementUseCase } from '../../../mocks/engagement_mocks';
import { DwLastUseCases } from './dw_last_use_cases';


describe('Last Use Cases dashboard widget', () => {
  test('has the correct title', () => {
    const component = render(
      <Router history={createMemoryHistory({})}>
        <DwLastUseCases useCases={[]} />
      </Router>
    );
    expect(component.getByText('Use Cases')).toBeDefined();
  });
  test('shows the use cases', () => {
    const useCases = new Array(10).fill(null).map(mockEngagementUseCase);
    const component = render(
      <Router history={createMemoryHistory({})}>
        <DwLastUseCases useCases={useCases} />
      </Router>
    );
    for (let useCase of useCases) {
      expect(component.getByText(useCase.description)).toBeDefined();
    }
  });
});
