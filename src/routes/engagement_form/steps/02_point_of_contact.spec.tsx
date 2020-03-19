import React from 'react';
import { render } from 'enzyme';
import { PointOfContact } from './02_point_of_contact';
import { initialState } from '../initial_state';

test('Basic component renders correctly', () => {
  const component = render(<PointOfContact values={initialState} />);
  expect(component).toMatchSnapshot();
});
