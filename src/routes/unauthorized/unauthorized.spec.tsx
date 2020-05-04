import React from 'react';
import { UnauthorizedPage } from '.';
import { render } from '@testing-library/react';

describe('Unauthorized UI', () => {
  test('should match snapshot', () => {
    expect(render(<UnauthorizedPage />)).toMatchSnapshot();
  });
});
