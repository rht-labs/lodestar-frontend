import { fireEvent, render } from '@testing-library/react';
import { sub } from 'date-fns';
import React from 'react';
import { DateRange, DateWindowSelector } from './date_window_selector';

describe('Date window selector', () => {
  test('shows 1w, 1m, 3m, 6m, 1y, All time selectors', () => {
    const component = render(<DateWindowSelector />);
    expect(component.getByTestId('1w-window')).toBeDefined();
    expect(component.getByTestId('1m-window')).toBeDefined();
    expect(component.getByTestId('3m-window')).toBeDefined();
    expect(component.getByTestId('6m-window')).toBeDefined();
    expect(component.getByTestId('1y-window')).toBeDefined();
    expect(component.getByTestId('alltime-window')).toBeDefined();
  });
  test('when clicking a date option, a callback is invoked with a min and max date', () => {
    const dateToCallbackMaps = {
      '1w': (date?: DateRange) => {
        const currentDate = new Date(Date.now());
        expect(date).toBeDefined();
        expect(date.startDate.getDate()).toEqual(
          sub(currentDate, { weeks: 1 }).getDate()
        );
      },
      '1m': (date?: DateRange) => {
        const currentDate = new Date(Date.now());
        expect(date).toBeDefined();
        expect(date.startDate.getDate()).toEqual(
          sub(currentDate, { months: 1 }).getDate()
        );
      },
      '3m': (date?: DateRange) => {
        const currentDate = new Date(Date.now());
        expect(date).toBeDefined();
        expect(date.startDate.getDate()).toEqual(
          sub(currentDate, { months: 3 }).getDate()
        );
      },
      '6m': (date?: DateRange) => {
        const currentDate = new Date(Date.now());
        expect(date).toBeDefined();
        expect(date.startDate.getDate()).toEqual(
          sub(currentDate, { months: 6 }).getDate()
        );
      },
      '1y': (date?: DateRange) => {
        const currentDate = new Date(Date.now());
        expect(date).toBeDefined();
        expect(date.startDate.getDate()).toEqual(
          sub(currentDate, { years: 1 }).getDate()
        );
      },
      'All Time': (date?: DateRange) => {
        expect(date).toBeUndefined();
      },
    };
    let handleSelectWindow = jest.fn();
    const component = render(
      <DateWindowSelector onSelectWindow={handleSelectWindow} />
    );
    for (let key in dateToCallbackMaps) {
      handleSelectWindow = jest
        .fn()
        .mockImplementation(dateToCallbackMaps[key]);
      component.rerender(
        <DateWindowSelector onSelectWindow={handleSelectWindow} />
      );
      fireEvent.click(component.getByText(key));
      expect(handleSelectWindow).toHaveBeenCalled();
    }
  });
  test('Clicking a date window selects that window, and that window should be highlighted', async () => {
    const component = render(<DateWindowSelector onSelectWindow={() => {}} />);
    fireEvent.click(component.getByText('1w'));
    expect(
      component
        .getByTestId('1w-window')
        .getElementsByTagName('button')[0]
        .className.split(' ')
    ).toContain('pf-m-selected');
  });
  test('matches snapshot', () => {
    const component = render(<DateWindowSelector onSelectWindow={() => {}} />);
    expect(component).toMatchSnapshot();
  });
});
