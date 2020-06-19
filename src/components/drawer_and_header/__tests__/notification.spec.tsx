import React from 'react';
import { Notification } from '../notification';
import { render } from '@testing-library/react';

describe('Notification UI ', () => {
  test('should match snapshot', () => {
    expect(render(<Notification />)).toMatchSnapshot();
  });
});
