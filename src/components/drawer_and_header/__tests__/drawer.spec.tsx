import React from 'react';
import {cleanup, render} from '@testing-library/react';
import {Drawer} from '../drawer';
import {MemoryRouter} from 'react-router';
import "@testing-library/jest-dom/extend-expect";

afterEach(cleanup);

describe('Drawer ', () => {
  test('matches the snapshot', () => {
    expect(
      render(
        <MemoryRouter>
          <Drawer/>
        </MemoryRouter>
      )
    ).toMatchSnapshot();
  });

  test('renders drawer with the correct navigation child', () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <Drawer isDrawerOpen={true}>
          <div data-testid="drawer">
          </div>
        </Drawer>
      </MemoryRouter>
    );
    expect(getByTestId("drawer")).toBeInTheDocument();
  });
});




