import React from 'react';
import { render } from '@testing-library/react';
import { EngagementList } from '../engagement_list';
import { Engagement } from '../../../schemas/engagement';
import { MemoryRouter } from 'react-router';
describe('Engagement list', () => {
  test('matches snapshot', () => {
    expect(
      render(
        <MemoryRouter>
          <EngagementList engagements={[Engagement.fromFake(true)]} />
        </MemoryRouter>
      )
    ).toMatchSnapshot();
    expect(
      render(
        <MemoryRouter>
          <EngagementList engagements={undefined} />
        </MemoryRouter>
      )
    ).toMatchSnapshot();
  });
});
