import React from 'react';
import { render } from '@testing-library/react';
import { LodestarRouter } from './router';
import { MemoryRouter } from 'react-router';

describe('Router component', () => {
  test('renders correctly', () => {
    expect(
      render(
        <MemoryRouter>
          <LodestarRouter />
        </MemoryRouter>
      )
    ).toMatchSnapshot();
  });
});
