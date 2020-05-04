import React from 'react';
import { UserDropdown } from './user_dropdown';

describe('User Dropdown UI', () => {
  test('should match snapshot', () => {
    expect(<UserDropdown />).toMatchSnapshot();
  });
});
