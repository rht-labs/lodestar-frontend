import React from 'react';
import { render, fireEvent, queryByAttribute } from '@testing-library/react';
import { CustomerSelect } from '../customer_select_dropdown';

describe('Customer Select Dropdown', () => {
  let customers;
  beforeEach(() => {
    customers = ['foo', 'bar', 'baz'];
  });
  test('matches snapshot', () => {
    expect(
      render(
        <CustomerSelect
          onSelect={() => {}}
          options={customers}
          placeholder="Foobar"
        />
      )
    ).toMatchSnapshot();
  });

  test('shows existing customers', async () => {
    const wrapper = render(
      <CustomerSelect
        onSelect={() => {}}
        options={customers}
        placeholder="Foobar"
      />
    );
    const dropdownButton = await wrapper.findByRole('button');
    await fireEvent.click(dropdownButton);
    const fooCustomer = await wrapper.findByTestId('foo');
    expect(fooCustomer).toBeDefined();
  });

  test('can select existing customer', async () => {
    const selectCallback = jest.fn();
    const wrapper = render(
      <CustomerSelect
        onSelect={selectCallback}
        options={customers}
        placeholder="Foobar"
      />
    );
    const dropdownButton = await wrapper.findByRole('button');
    await fireEvent.click(dropdownButton);
    const fooCustomer = await wrapper.findByTestId('foo');
    await fireEvent.click(fooCustomer);
    expect(selectCallback).toHaveBeenCalled();
  });

  test('can create a new customer', async () => {
    const selectCallback = jest.fn();

    const wrapper = render(
      <CustomerSelect
        onSelect={selectCallback}
        options={customers}
        placeholder="Foobar"
      />
    );
    const dropdownButton = await wrapper.findByRole('button');

    const selectTextInput = await wrapper.findByRole('textbox');
    await fireEvent.click(dropdownButton);
    await fireEvent.change(selectTextInput, { target: { value: 'bot' } });
    const newItem = await wrapper.findByRole('option');
    await fireEvent.click(newItem);
    expect(selectCallback).toBeCalledWith('bot');
  });
});
