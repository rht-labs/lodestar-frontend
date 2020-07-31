import React from 'react';
import { render } from '@testing-library/react';
import { ErrorBoundary } from '../error_boundary';

describe('Error Boundary', () => {
  const ErrorComponent = () => {
    throw Error('an error');
  };
  test('Error boundary should render if an error is thrown in the react render tree', () => {
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});
    const { getByText } = render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );
    expect(getByText("You've found an unexpected feature.")).toBeDefined();

    spy.mockRestore();
  });
});
