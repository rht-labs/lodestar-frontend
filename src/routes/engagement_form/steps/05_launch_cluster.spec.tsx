import React from 'react';
import { render } from 'enzyme';
import { LaunchCluster } from './05_launch_cluster';
import { initialState } from '../initial_state';

test('Basic component renders correctly', () => {
  const component = render(<LaunchCluster values={initialState} />);
  expect(component).toMatchSnapshot();
});
