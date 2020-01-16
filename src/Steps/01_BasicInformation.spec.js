import React from 'react';
import { render } from 'enzyme';
import BasicInformation from './01_BasicInformation'

test('Basic component renders correctly', () => {
  const component = render(<BasicInformation />);
  expect(component).toMatchSnapshot();
});
