import React from 'react';
import { Dashboard } from '.';

describe('Dashboard Component', () => {
  test('matches snapshot', () => {
    expect(<Dashboard />).toMatchSnapshot();
  });
});
