import React from 'react';
import {
  render,
  act,
  fireEvent,
  queryByAttribute,
} from '@testing-library/react';
import { EngagementFilterBar } from '../engagement_filter_bar';

const getById = queryByAttribute.bind(null, 'id');

describe('Engagement Navigation ', () => {
  test('matches the snapshot', () => {
    expect(
      render(<EngagementFilterBar filter={{}} onChange={() => {}} />)
    ).toMatchSnapshot();
  });
  test('can find engagement region filter select', async () => {
    const wrapper = render(
      <EngagementFilterBar filter={{}} onChange={() => {}} />
    );
    expect(getById(wrapper.container, 'region_dropdown')).not.toBeNull();
  });
});
