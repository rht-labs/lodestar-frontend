import React from 'react';
import { render } from '@testing-library/react';
import { Logo } from './logo';

describe('Logo', () => {
  test('renders properly', () => {
    expect(render(<Logo />)).toMatchSnapshot();
  });
});
