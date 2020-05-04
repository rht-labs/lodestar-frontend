import React from 'react';
import { OMPHeader } from './omp_header';

describe('OMP Header UI', () => {
  test('should match snapshot', () => {
    expect(<OMPHeader />).toMatchSnapshot();
  });
});
