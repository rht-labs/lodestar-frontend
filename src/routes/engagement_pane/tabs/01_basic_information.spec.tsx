import React from 'react';
import { render } from 'enzyme';
import { BasicInformation } from './01_basic_information';
import { getInitialState } from '../../../context/engagement_form_context';

test('Basic component renders correctly', () => {
  const component = render(
    <BasicInformation values={{ initialState: getInitialState() }} />
  );
  expect(component).toMatchSnapshot();
});
