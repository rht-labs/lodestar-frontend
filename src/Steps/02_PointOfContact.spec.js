import React from 'react';
import { render } from 'enzyme';
import PointOfContact from './02_PointOfContact'

test('Basic component renders correctly', () => {
  const component = render(<PointOfContact />);
  expect(component).toMatchSnapshot();
});
