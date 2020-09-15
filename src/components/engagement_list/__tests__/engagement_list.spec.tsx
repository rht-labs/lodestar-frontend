import React from 'react';
import { render } from '@testing-library/react';
import { EngagementList } from '../engagement_list';
import { Engagement } from '../../../schemas/engagement';
import { MemoryRouter } from 'react-router';
import MockDate from 'mockdate';

describe('Engagement list', () => {
  test('matches snapshot', () => {
    MockDate.set(new Date(2020, 8, 3));
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
    MockDate.reset();
  });
});
