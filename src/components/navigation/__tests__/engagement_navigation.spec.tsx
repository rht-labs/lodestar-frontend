import React from 'react';
import {render} from '@testing-library/react';
import {EngagementNavigation} from '../engagement_navigation';
import {MemoryRouter} from 'react-router';

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
