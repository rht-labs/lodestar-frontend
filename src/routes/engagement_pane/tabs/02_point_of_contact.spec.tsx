import React from 'react';
import { render } from 'enzyme';
import { PointOfContact } from './02_point_of_contact';
import { getInitialState } from '../../../context/engagement_form_context';

test('Basic component renders correctly', () => {
  const component = render(<PointOfContact values={getInitialState()} />);
  expect(component).toMatchSnapshot();
});
