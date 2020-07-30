import React from 'react';
import { render } from '@testing-library/react';
import { ErrorFallbackUI } from '../error_fallback_ui';

describe('Error fallback UI', () => {
  test('matches snapshot', () => {
    expect(render(<ErrorFallbackUI />)).toMatchSnapshot();
  });
});
