import React from 'react';
import { render } from 'enzyme';
import LaunchResidency from './04_LaunchResidency'

test('Basic component renders correctly', () => {
  const component = render(<LaunchResidency />);
  expect(component).toMatchSnapshot();
});
