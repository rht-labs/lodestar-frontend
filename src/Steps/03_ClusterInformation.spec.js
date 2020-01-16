import React from 'react';
import { render } from 'enzyme';
import ClusterInformation from './03_ClusterInformation'

test('Basic component renders correctly', () => {
  const component = render(<ClusterInformation />);
  expect(component).toMatchSnapshot();
});
