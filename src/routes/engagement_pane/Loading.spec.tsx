import React from 'react';
import { render } from 'enzyme';
import { Loading } from './Loading';

test('Basic component renders correctly', () => {
  const component = render(<Loading />);
  expect(component).toMatchSnapshot();
});
