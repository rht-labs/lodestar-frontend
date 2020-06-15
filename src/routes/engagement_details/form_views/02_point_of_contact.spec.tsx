import React from 'react';
import { render } from 'enzyme';
import { PointOfContact } from './02_point_of_contact';
import { getInitialState } from '../../../context/engagement_context/engagement_form_reducer';

test('Basic component renders correctly', () => {
  const component = render(
    <PointOfContact onChange={() => {}} engagement={getInitialState()} />
  );
  expect(component).toMatchSnapshot();
});
