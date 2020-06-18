import React from 'react';
import {cleanup, render} from '@testing-library/react';
import {MemoryRouter} from 'react-router';
import "@testing-library/jest-dom/extend-expect";
import {EngagementListItemCard} from '../engagement_list_item_card';

afterEach(cleanup);

describe('Engagement Card', () => {
  test('renders the components', () => {
    const { getByText, getByTestId } = render(
      <MemoryRouter>
        <EngagementListItemCard title={'Test Title'}>
          <div data-testid="childComponent"> Test Child Component </div>
        </EngagementListItemCard>
      </MemoryRouter>
    );
    expect(getByTestId("childComponent")).toBeInTheDocument();
    expect(getByText("View Engagement")).toBeInTheDocument();
    expect(getByText("Test Title")).toBeInTheDocument();
  });

  test('matches the snapshot', () => {
    expect(
      render(
        <MemoryRouter>
          <EngagementListItemCard title={'Test Title'}>
            <div> Test Child Component </div>
          </EngagementListItemCard>
        </MemoryRouter>
      )
    ).toMatchSnapshot();
  });
});




