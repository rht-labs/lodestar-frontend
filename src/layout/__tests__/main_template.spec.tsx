import React from 'react';
import {act, cleanup, fireEvent, queryByAttribute, render} from '@testing-library/react';
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

  test('passes the children components correctly', () => {
    const {getByTestId} = render(
      <MemoryRouter>
        <MainTemplate>
          <div data-testid="mainTemplateContent">main template Content</div>
        </MainTemplate>
      </MemoryRouter>
    )
    expect(getByTestId("mainTemplateContent")).toBeInTheDocument();
  });

  test('drawer is opened by default', async () => {
    const getById = queryByAttribute.bind(null, 'id');
    const dom = render(
      <MemoryRouter>
        <MainTemplate>
          <div data-testid="mainTemplateContent">main template Content</div>
        </MainTemplate>
      </MemoryRouter>
    );

    const pageSideBar = getById(dom.container, 'page-sidebar');
    expect(pageSideBar).toHaveClass('pf-c-page__sidebar pf-m-collapsed');
  });

  test('toggle the drawer between opened and closed', async () => {
    const getById = queryByAttribute.bind(null, 'id');
    const dom = render(
      <MemoryRouter>
        <MainTemplate>
          <div data-testid="mainTemplateContent">main template Content</div>
        </MainTemplate>
      </MemoryRouter>
    );

    const navToggle = getById(dom.container, 'nav-toggle');
    await act(async () => {
      await fireEvent.click(navToggle as Element);
      const pageSideBar = getById(dom.container, 'page-sidebar');
      expect(pageSideBar).toHaveClass('pf-c-page__sidebar pf-m-expanded');
    })
  })
});




