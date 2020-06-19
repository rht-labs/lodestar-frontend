import React from 'react';
import {render, cleanup} from '@testing-library/react';
import {EngagementNavigation} from '../engagement_navigation';
import {MemoryRouter} from 'react-router';

afterEach(cleanup);

describe('Engagement Navigation ', () => {
  test('matches the snapshot', () => {
    expect(
      render(
        <MemoryRouter>
          <EngagementNavigation/>
        </MemoryRouter>
      )
    ).toMatchSnapshot();
  });
});
