import React from 'react';
import {MemoryRouter} from 'react-router';
import {render} from '@testing-library/react';
import {Header} from '../header';

describe('Notification UI ', () => {
  test('should match snapshot', () => {
    expect(render(
      <MemoryRouter>

        <Header isDrawerOpen={true} onNavToggle={() => null}/>
      </MemoryRouter>))
      .toMatchSnapshot();
  });
});
