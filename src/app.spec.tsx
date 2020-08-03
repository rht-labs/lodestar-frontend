import React from 'react';
import { App } from './app';
import { render } from '@testing-library/react';
import { Config } from './schemas/config';
describe('Root app', () => {
  test('matches snapshot', () => {
    expect(render(<App config={Config.fromFake()} />)).toMatchSnapshot();
  });
});
