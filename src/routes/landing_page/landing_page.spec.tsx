import React from 'react';
import { render } from 'enzyme';
import { LandingPage } from './landing_page';
import { MemoryRouter } from 'react-router';

describe('Landing Page', () => {
  test('landing page matches snapshot', () => {
    const Wrapper = ({ children }) => <MemoryRouter>{children}</MemoryRouter>;
    expect(
      render(
        <Wrapper>
          <LandingPage />
        </Wrapper>
      )
    ).toMatchSnapshot();
  });
});
