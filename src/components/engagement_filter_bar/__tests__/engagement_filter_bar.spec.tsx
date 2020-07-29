import React from 'react';
import { render } from '@testing-library/react';
import { EngagementFilterBar } from '../engagement_filter_bar';
describe('Engagement Navigation ', () => {
  test('matches the snapshot', () => {
    expect(
      render(<EngagementFilterBar filter={{}} onChange={() => {}} />)
    ).toMatchSnapshot();
  });
});
