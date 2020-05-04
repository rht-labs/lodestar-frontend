import React from 'react';
import { UnauthorizedPage } from '.';

describe('Unauthorized UI', () => {
  test('should match snapshot', () => {
    expect(<UnauthorizedPage />).toMatchSnapshot();
  });
});
