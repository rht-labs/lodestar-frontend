import React from 'react';
import { UserDropdown } from './user_dropdown';
import { render } from '@testing-library/react';

describe('User Dropdown UI', () => {
  test('should match snapshot', () => {
    expect(render(<UserDropdown />)).toMatchSnapshot();
  });
});
