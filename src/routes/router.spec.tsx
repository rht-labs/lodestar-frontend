import React from 'react';
import { render } from '@testing-library/react';
import { OMPRouter } from './router';
import { MemoryRouter } from 'react-router';

describe('Router component', () => {
  test('renders correctly', () => {
    expect(
      render(
        <MemoryRouter>
          <OMPRouter />
        </MemoryRouter>
      )
    ).toMatchSnapshot();
  });
});
