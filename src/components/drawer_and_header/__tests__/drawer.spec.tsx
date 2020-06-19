import React from 'react';
import {cleanup, render} from '@testing-library/react';
import {BlackDrawer} from '../black_drawer';
import {MemoryRouter} from 'react-router';
import "@testing-library/jest-dom/extend-expect";

afterEach(cleanup);

describe('BlackDrawer ', () => {
  test('matches the snapshot', () => {
    expect(
      render(
        <MemoryRouter>
          <BlackDrawer/>
        </MemoryRouter>
      )
    ).toMatchSnapshot();
  });

  test('renders drawer with the correct navigation child', () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <BlackDrawer isDrawerOpen={true}>
          <div data-testid="drawer">
          </div>
        </BlackDrawer>
      </MemoryRouter>
    );
    expect(getByTestId("drawer")).toBeInTheDocument();
  });
});




