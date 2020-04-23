import React from 'react';
import { render } from 'enzyme';
import { LaunchCluster } from './05_launch_cluster';
import { getInitialState } from '../../../context/engagement_form_context';

test('Basic component renders correctly', () => {
  const component = render(<LaunchCluster values={getInitialState()} />);
  expect(component).toMatchSnapshot();
});
