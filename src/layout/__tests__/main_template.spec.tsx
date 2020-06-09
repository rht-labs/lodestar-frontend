import React from 'react';
import {render, act, cleanup} from '@testing-library/react';
import {MainTemplate} from '../main_template';
import {MemoryRouter} from 'react-router';
import "@testing-library/jest-dom/extend-expect";

afterEach(cleanup);

describe('Main Template layout ', () => {
  test('matches the snapshot', () => {
    expect(
      render(
        <MemoryRouter>
          <MainTemplate>
            <div data-testid="mainTemplateContent">main template Content</div>
          </MainTemplate>
        </MemoryRouter>
      )
    ).toMatchSnapshot();
  });

  test('renders all the children components correctly', () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <MainTemplate>
          <div data-testid="mainTemplateContent">main template Content</div>
        </MainTemplate>
      </MemoryRouter>
    )
    expect(getByTestId("mainTemplateContent")).toBeInTheDocument();
  });
});




