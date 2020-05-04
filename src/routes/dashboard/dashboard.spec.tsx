import React from 'react';
import { Dashboard } from '.';
import { render } from '@testing-library/react';

describe('Dashboard Component', () => {
  test('matches snapshot', () => {
    expect(render(<Dashboard />)).toMatchSnapshot();
  });
});
