import React from 'react';
import {MemoryRouter} from 'react-router';
import {render} from '@testing-library/react';
import {NavigationBar} from '../navigation_bar';

describe('Notification UI ', () => {
  test('should match snapshot', () => {
    expect(render(
      <MemoryRouter>

        <NavigationBar isDrawerOpen={true} onNavToggle={() => null}/>
      </MemoryRouter>))
      .toMatchSnapshot();
  });
});
