import React from 'react';
import {
  render,
  act,
  fireEvent,
  queryByAttribute,
} from '@testing-library/react';
import { EngagementFilterBar } from '../engagement_filter_bar';
import { TestStateWrapper } from '../../../common/test_state_wrapper';

const getById = queryByAttribute.bind(null, 'id');

describe('Engagement Navigation ', () => {
  test('matches the snapshot', () => {
    expect(
      render(<EngagementFilterBar filter={{}} onChange={() => {}} />)
    ).toMatchSnapshot();
  });
  test('can find engagement region filter select', async () => {
    const wrapper = render(
      <TestStateWrapper>
        <EngagementFilterBar filter={{}} onChange={() => {}} />
      </TestStateWrapper>
    );
    expect(getById(wrapper.container, 'region_dropdown')).not.toBeNull();
  });
});
