import React from 'react';
import { cleanup, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import '@testing-library/jest-dom/extend-expect';
import { EngagementListItem } from '../engagement_list_item';
import { Engagement } from '../../../schemas/engagement';

afterEach(cleanup);

describe('Engagement Card', () => {
  test('renders the components', () => {
    const engagement = Engagement.fromFake(true);
    const { getByText } = render(
      <MemoryRouter>
        <EngagementListItem engagement={engagement}></EngagementListItem>
      </MemoryRouter>
    );
    expect(getByText('View Engagement')).toBeInTheDocument();
  });

  test('matches the snapshot', () => {
    const engagement = Engagement.fromFake(true);
    expect(
      render(
        <MemoryRouter>
          <EngagementListItem engagement={engagement}></EngagementListItem>
        </MemoryRouter>
      )
    ).toMatchSnapshot();
  });
});
