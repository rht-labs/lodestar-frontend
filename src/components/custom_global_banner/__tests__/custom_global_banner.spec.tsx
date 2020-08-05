import React from 'react';
import { render } from '@testing-library/react';
import CustomGlobalBanner from '../custom_global_banner';

describe('custom global banner', () => {
  test('matches snapshot', () => {
    expect(
      render(<CustomGlobalBanner message="Hello, world!" color="white" />)
    ).toMatchSnapshot();
  });
});
